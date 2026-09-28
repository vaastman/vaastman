"use server";

import { prisma } from "@/lib/db";
import { ErrorTypes } from "@/lib/error-type";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  type AddCandidateEducationSchema,
  addCandidateEducationSchema,
} from "./zod-type/candidate-education";
import {
  type AddCandidatePersonalSchema,
  addCandidatePersonalSchema,
} from "./zod-type/candidate-personal";

export async function addCandidatePersonalAction(
  data: AddCandidatePersonalSchema,
) {
  const parsedData = addCandidatePersonalSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      success: false,
      message: parsedData.error.issues[0]?.message ?? "Invalid data",
    };
  }

  const candidate = await prisma.candidate_Personal.findUnique({
    where: { id: parsedData.data.id },
  });

  if (candidate) {
    return { success: false, message: ErrorTypes.ALREADY_EXISTS };
  }

  try {
    const createdCandidate = await prisma.candidate_Personal.create({
      data: parsedData.data,
    });

    return { success: true, data: createdCandidate };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false, message: "Unable to save candidate details" };
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return { success: false, message: "Invalid candidate details" };
    }

    return {
      success: false,
      message: "Something went wrong while saving candidate details",
    };
  }
}

export async function addCandidateEducationAction(
  data: AddCandidateEducationSchema,
) {
  const parsedData = addCandidateEducationSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      success: false,
      message: parsedData.error.issues[0]?.message ?? "Invalid data",
    };
  }

  const candidatePersonal = await prisma.candidate_Personal.findUnique({
    where: { id: parsedData.data.id },
  });

  if (!candidatePersonal) {
    return { success: false, message: "Candidate personal details not found" };
  }

  const education = await prisma.candidate_Education.findFirst({
    where: { candidateId: parsedData.data.id },
  });

  if (education) {
    return { success: false, message: "Candidate education already exists" };
  }

  const selectedCollege = await prisma.college.findUnique({
    where: { id: parsedData.data.collegeId },
    select: {
      id: true,
      name: true,
      sessions: {
        where: {
          id: parsedData.data.collegeSessionId,
          status: "ACTIVE",
        },
        select: {
          id: true,
          name: true,
          fees: true,
          duration: true,
        },
      },
    },
  });

  if (!selectedCollege) {
    return { success: false, message: "Selected college was not found" };
  }

  const selectedSession = selectedCollege.sessions[0];

  if (!selectedSession) {
    return { success: false, message: "Selected session was not found" };
  }

  try {
    const createdEducation = await prisma.candidate_Education.create({
      data: {
        candidateId: parsedData.data.id,
        collegeId: selectedCollege.id,
        collegeSessionId: selectedSession.id,
        universityRoll: parsedData.data.universityRoll,
        collegeRoll: parsedData.data.collegeRoll,
        // grade: parsedData.data.grade,
        // marks: Number(parsedData.data.marks),
        collegeFee: selectedSession.fees,
        duration: selectedSession.duration,
        domainOrMainSubject: parsedData.data.domainOrMainSubject,
        mjcSubject: parsedData.data.mjcSubject,
      },
      select: { id: true, candidateId: true },
    });

    return { success: true, data: createdEducation };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false, message: "Unable to save candidate details" };
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return { success: false, message: "Invalid candidate details" };
    }

    return {
      success: false,
      message: "Something went wrong while saving candidate details",
    };
  }
}

export async function getUniversity() {
  try {
    const universities = await prisma.university.findMany({
      select: {
        id: true,
        name: true,
        colleges: {
          select: {
            id: true,
            name: true,
            sessions: {
              where: {
                status: "ACTIVE",
              },
              select: {
                id: true,
                name: true,
                duration: true,
              },
            },
            domains: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return { success: true, data: universities };
  } catch {
    return { success: false, message: "Failed to fetch universities" };
  }
}
