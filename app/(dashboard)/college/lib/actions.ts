"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { type CollegeSessionStatus, Role } from "@/lib/generated/prisma/enums";
import {
  type AddCollegeSchema,
  addCollegeSchema,
} from "./zod-type/college-info";

export async function getCollegeInfo() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const data = await prisma.college.findMany({
      include: {
        domains: true,
        sessions: {
          include: {
            _count: {
              select: {
                candidateEducations: true,
              },
            },
          },
        },
        _count: {
          select: {
            candidateEducations: true,
          },
        },
      },
    });

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch college info" };
  }
}

export async function addCollegeInfo(data: AddCollegeSchema) {
  const session = await auth.api.getSession({ headers: await headers() });

  // only admin can add college info
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  // check if user is admin
  if (session.user.role !== Role.ADMIN) {
    return { success: false, message: "Unauthorized" };
  }

  const parsedData = addCollegeSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, message: "Invalid data" };
  }

  // check with same code college already exist

  if (parsedData.data.code) {
    const college = await prisma.college.findMany({
      where: {
        code: parsedData.data.code,
      },
    });
    if (college.length > 0) {
      return {
        success: false,
        message: "College with this code already exists",
      };
    }
  }

  try {
    let university = await prisma.university.findFirst({
      where: { name: parsedData.data.universityName },
    });

    if (!university) {
      university = await prisma.university.create({
        data: { name: parsedData.data.universityName },
      });
    }

    const college = await prisma.college.create({
      data: {
        universityId: university.id,
        name: parsedData.data.collegeName,
        code: parsedData.data.code,
        domains: {
          create: parsedData.data.domains?.map((domain) => ({
            name: domain,
          })),
        },
        sessions: {
          create: {
            name: `${parsedData.data.startSession}-${parsedData.data.endSession}`,
            duration: `${parsedData.data.duration}h`,
            fees: parsedData.data.fees,
            isActive: true,
            deprecated: false,
          },
        },
      },
    });

    return { success: true, data: college };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to add college info" };
  }
}

export async function updateCollegeSessionStatus(input: {
  collegeId: string;
  sessionId: string;
  status: CollegeSessionStatus;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (session.user.role !== Role.ADMIN) {
    return { success: false, message: "Unauthorized" };
  }

  if (!input.collegeId.trim() || !input.sessionId.trim()) {
    return { success: false, message: "Invalid session details" };
  }

  try {
    const collegeSession = await prisma.collegeSession.findFirst({
      where: {
        id: input.sessionId,
        collegeId: input.collegeId,
      },
      select: {
        id: true,
      },
    });

    if (!collegeSession) {
      return { success: false, message: "Session not found" };
    }

    const data = await prisma.collegeSession.update({
      where: {
        id: input.sessionId,
      },
      data: {
        status: input.status,
        isActive: input.status === "ACTIVE",
        deprecated: input.status === "INACTIVE",
      },
    });

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update session status" };
  }
}
