"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  type AddCandidateEducationSchema,
  addCandidateEducationSchema,
} from "./zod-type/candidate-education";
import {
  type AddCandidatePersonalSchema,
  addCandidatePersonalSchema,
} from "./zod-type/candidate-personal";

/**
 * Fetch existing candidate personal + education data for a given candidate ID.
 * Used to pre-fill the form on refresh and determine which tab to show.
 */
export async function getCandidateProgress(candidateId: string) {
  try {
    const personal = await prisma.candidate_Personal.findUnique({
      where: { id: candidateId },
    });

    const education = personal
      ? await prisma.candidate_Education.findFirst({
          where: { candidateId },
          include: {
            college: {
              select: { universityId: true },
            },
          },
        })
      : null;

    return {
      success: true,
      data: {
        personal,
        education,
      },
    };
  } catch {
    return {
      success: false,
      message: "Failed to fetch candidate progress",
    };
  }
}

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

  // Check if another candidate (different ID) already has this Aadhar number
  const existingAadhar = await prisma.candidate_Personal.findUnique({
    where: { aadharNo: parsedData.data.aadharNo },
  });

  if (existingAadhar && existingAadhar.id !== parsedData.data.id) {
    return {
      success: false,
      message: "Candidate with this Aadhar number already exists",
    };
  }

  try {
    // Upsert: create if new, update if the candidate already exists (e.g. page refresh)
    const savedCandidate = await prisma.candidate_Personal.upsert({
      where: { id: parsedData.data.id },
      create: parsedData.data,
      update: {
        name: parsedData.data.name,
        email: parsedData.data.email,
        phone: parsedData.data.phone,
        fatherName: parsedData.data.fatherName,
        aadharNo: parsedData.data.aadharNo,
        profilePhoto: parsedData.data.profilePhoto,
        aadharPhoto: parsedData.data.aadharPhoto,
        gender: parsedData.data.gender,
        dateOfBirth: parsedData.data.dateOfBirth,
      },
    });

    return { success: true, data: savedCandidate };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Candidate with this Aadhar number already exists",
        };
      }
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
    // Check if education already exists for this candidate
    const existingEducation = await prisma.candidate_Education.findFirst({
      where: { candidateId: parsedData.data.id },
    });

    const educationData = {
      collegeId: selectedCollege.id,
      collegeSessionId: selectedSession.id,
      universityRoll: parsedData.data.universityRoll,
      collegeRoll: parsedData.data.collegeRoll,
      collegeFee: selectedSession.fees,
      duration: selectedSession.duration,
      course: parsedData.data.course,
      domainOrMainSubject: parsedData.data.domainOrMainSubject,
      mjcSubject: parsedData.data.mjcSubject,
    };

    if (existingEducation) {
      // Update existing education record
      const updatedEducation = await prisma.candidate_Education.update({
        where: { id: existingEducation.id },
        data: educationData,
        select: { id: true, candidateId: true },
      });
      return { success: true, data: updatedEducation };
    }

    // Create new education record
    const createdEducation = await prisma.candidate_Education.create({
      data: {
        candidateId: parsedData.data.id,
        ...educationData,
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
