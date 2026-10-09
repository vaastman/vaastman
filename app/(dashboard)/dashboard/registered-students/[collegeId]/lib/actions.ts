"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  type UpdateCandidateSchema,
  updateCandidateSchema,
} from "./zod-type/update-candidate";

export type RegisteredStudentPayment = {
  id: string;
  amount: number;
  status: string;
  razorpayPaymentId: string | null;
  createdAt: string;
};

export type RegisteredStudentRow = {
  candidateId: string;
  educationId: string | null;
  name: string;
  profilePhoto: string;
  aadharPhoto?: string | null;
  aadharNo: string;
  email: string;
  phone: string;
  fatherName: string;
  gender: string;
  dateOfBirth: string;
  universityRoll: string;
  collegeRoll: string;
  course?: string | null;
  domainOrMainSubject: string;
  mjcSubject: string;
  duration: string;
  collegeFee: string;
  paymentStatus: string;
  registrationStatus: "COMPLETE" | "INCOMPLETE";
  collegeId: string;
  collegeName: string;
  universityName: string;
  collegeSessionId: string;
  sessionName: string;
  payments: RegisteredStudentPayment[];
};

export type RegisteredStudentsCollegeData = {
  college: {
    id: string;
    name: string;
    code: string | null;
    universityName: string;
    domains: { id: string; name: string }[];
    sessions: { id: string; name: string; fees: string; duration: string }[];
  };
  sessions: {
    id: string;
    name: string;
    candidates: RegisteredStudentRow[];
  }[];
};

export async function getRegisteredStudentsByCollege(collegeId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!collegeId || !collegeId.trim()) {
    return { success: false, message: "Invalid college id" };
  }

  try {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: {
        id: true,
        name: true,
        code: true,
        university: {
          select: {
            id: true,
            name: true,
          },
        },
        domains: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        },
        sessions: {
          select: {
            id: true,
            name: true,
            fees: true,
            duration: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!college) {
      return { success: false, message: "College not found" };
    }

    const candidates = await prisma.candidate_Education.findMany({
      where: {
        collegeId: college.id,
      },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
            aadharPhoto: true,
            aadharNo: true,
            email: true,
            phone: true,
            fatherName: true,
            gender: true,
            dateOfBirth: true,
            candidatePayments: {
              select: {
                id: true,
                amount: true,
                status: true,
                razorpayPaymentId: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
        collegeSession: {
          select: {
            id: true,
            name: true,
            fees: true,
            duration: true,
          },
        },
      },
    });

    // Group by session ID to handle duplicate session names
    const candidatesBySessionId = new Map<string, RegisteredStudentRow[]>();

    for (const candidate of candidates) {
      const sessionId = candidate.collegeSession.id;
      const groupedCandidates = candidatesBySessionId.get(sessionId) ?? [];

      // Determine the most relevant payment status:
      // Priority 1: VERIFIED
      // Priority 2: CREATED
      // Priority 3: FAILED
      // Priority 4: N/A
      const paymentStatuses = candidate.candidate.candidatePayments.map(
        (p) => p.status,
      );
      let finalPaymentStatus = "N/A";

      if (paymentStatuses.includes("VERIFIED")) {
        finalPaymentStatus = "VERIFIED";
      } else if (paymentStatuses.includes("CREATED")) {
        finalPaymentStatus = "CREATED";
      } else if (paymentStatuses.includes("FAILED")) {
        finalPaymentStatus = "FAILED";
      }

      groupedCandidates.push({
        candidateId: candidate.candidate.id,
        educationId: candidate.id,
        name: candidate.candidate.name,
        profilePhoto: candidate.candidate.profilePhoto,
        aadharPhoto: candidate.candidate.aadharPhoto,
        aadharNo: candidate.candidate.aadharNo,
        email: candidate.candidate.email,
        phone: candidate.candidate.phone,
        fatherName: candidate.candidate.fatherName,
        gender: candidate.candidate.gender,
        dateOfBirth: candidate.candidate.dateOfBirth,
        universityRoll: candidate.universityRoll,
        collegeRoll: candidate.collegeRoll,
        course: candidate.course,
        domainOrMainSubject: candidate.domainOrMainSubject,
        mjcSubject: candidate.mjcSubject,
        duration: candidate.duration,
        collegeFee: candidate.collegeFee,
        collegeId: college.id,
        collegeName: college.name,
        universityName: college.university?.name
          ? college.university.name.replace(/_/g, " ")
          : "",
        collegeSessionId: candidate.collegeSession.id,
        sessionName: candidate.collegeSession.name,
        paymentStatus: finalPaymentStatus,
        registrationStatus: "COMPLETE",
        payments: candidate.candidate.candidatePayments.map((p) => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          razorpayPaymentId: p.razorpayPaymentId,
          createdAt: p.createdAt.toISOString(),
        })),
      });

      candidatesBySessionId.set(sessionId, groupedCandidates);
    }

    for (const [sessionId, sessionCandidates] of candidatesBySessionId) {
      sessionCandidates.sort((a, b) => a.name.localeCompare(b.name));
      candidatesBySessionId.set(sessionId, sessionCandidates);
    }

    // Query candidates who filled personal details but do not have educational details yet
    const pendingCandidates = await prisma.candidate_Personal.findMany({
      where: {
        candidateEducations: { none: {} },
      },
      include: {
        candidatePayments: {
          select: {
            id: true,
            amount: true,
            status: true,
            razorpayPaymentId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const pendingCandidatesRows: RegisteredStudentRow[] = pendingCandidates.map(
      (candidate) => ({
        candidateId: candidate.id,
        educationId: null,
        name: candidate.name,
        profilePhoto: candidate.profilePhoto,
        aadharPhoto: candidate.aadharPhoto,
        aadharNo: candidate.aadharNo,
        email: candidate.email,
        phone: candidate.phone,
        fatherName: candidate.fatherName,
        gender: candidate.gender,
        dateOfBirth: candidate.dateOfBirth,
        universityRoll: "—",
        collegeRoll: "—",
        course: "—",
        domainOrMainSubject: "—",
        mjcSubject: "—",
        duration: "—",
        collegeFee: "—",
        collegeId: college.id,
        collegeName: college.name,
        universityName: college.university?.name
          ? college.university.name.replace(/_/g, " ")
          : "",
        collegeSessionId: "pending-education",
        sessionName: "Pending Education",
        paymentStatus: "N/A",
        registrationStatus: "INCOMPLETE",
        payments: candidate.candidatePayments.map((p) => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          razorpayPaymentId: p.razorpayPaymentId,
          createdAt: p.createdAt.toISOString(),
        })),
      }),
    );

    const configuredIds = college.sessions.map((s) => s.id);
    const extraIds = Array.from(candidatesBySessionId.keys())
      .filter((id) => !configuredIds.includes(id))
      .sort();
    const sessionIds = [...configuredIds, ...extraIds];

    // Build a name lookup from configured sessions
    const sessionNameById = new Map(
      college.sessions.map((s) => [s.id, s.name]),
    );

    const allSessions = sessionIds.map((id) => ({
      id,
      name: sessionNameById.get(id) ?? id,
      candidates: candidatesBySessionId.get(id) ?? [],
    }));

    if (pendingCandidatesRows.length > 0) {
      allSessions.push({
        id: "pending-education",
        name: "Pending Education",
        candidates: pendingCandidatesRows,
      });
    }

    return {
      success: true,
      data: {
        college: {
          id: college.id,
          name: college.name,
          code: college.code,
          universityName: college.university?.name
            ? college.university.name.replace(/_/g, " ")
            : "",
          domains: college.domains,
          sessions: college.sessions,
        },
        sessions: allSessions,
      },
    };
  } catch (error) {
    console.error("Error fetching registered students:", error);
    return { success: false, message: "Failed to fetch registered students" };
  }
}

export async function updateCandidateAction(data: UpdateCandidateSchema) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = updateCandidateSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, message: firstError };
  }

  const val = parsed.data;

  try {
    // Check if another candidate has the same Aadhar number
    const existingAadhar = await prisma.candidate_Personal.findFirst({
      where: {
        aadharNo: val.aadharNo,
        id: { not: val.candidateId },
      },
    });

    if (existingAadhar) {
      return {
        success: false,
        message: "Another candidate with this Aadhar number already exists.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update personal details
      await tx.candidate_Personal.update({
        where: { id: val.candidateId },
        data: {
          name: val.name,
          email: val.email,
          phone: val.phone,
          fatherName: val.fatherName,
          aadharNo: val.aadharNo,
          gender: val.gender,
          dateOfBirth: val.dateOfBirth,
          profilePhoto: val.profilePhoto,
          aadharPhoto: val.aadharPhoto ?? null,
        },
      });

      // 2. Update or create educational details
      const existingEdu = await tx.candidate_Education.findFirst({
        where: { candidateId: val.candidateId },
      });

      if (existingEdu) {
        await tx.candidate_Education.update({
          where: { id: existingEdu.id },
          data: {
            collegeId: val.collegeId,
            universityRoll: val.universityRoll,
            collegeRoll: val.collegeRoll,
            course: val.course ?? null,
            mjcSubject: val.mjcSubject,
            domainOrMainSubject: val.domainOrMainSubject,
            collegeSessionId: val.collegeSessionId,
            duration: val.duration,
            collegeFee: val.collegeFee,
          },
        });
      } else {
        await tx.candidate_Education.create({
          data: {
            candidateId: val.candidateId,
            collegeId: val.collegeId,
            universityRoll: val.universityRoll,
            collegeRoll: val.collegeRoll,
            course: val.course ?? null,
            mjcSubject: val.mjcSubject,
            domainOrMainSubject: val.domainOrMainSubject,
            collegeSessionId: val.collegeSessionId,
            duration: val.duration,
            collegeFee: val.collegeFee,
          },
        });
      }
    });

    return { success: true, message: "Candidate updated successfully" };
  } catch (error) {
    console.error("Error updating candidate:", error);
    return { success: false, message: "Failed to update candidate details" };
  }
}

export async function deleteCandidateAction({
  candidateId,
}: {
  candidateId: string;
  collegeId: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!candidateId) {
    return { success: false, message: "Candidate ID is required" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Delete in correct order to respect foreign key constraints
      await tx.candidate_Payment.deleteMany({
        where: { candidateId },
      });

      await tx.candidate_Certification.deleteMany({
        where: { candidateId },
      });

      await tx.candidate_Education.deleteMany({
        where: { candidateId },
      });

      await tx.candidate_Personal.delete({
        where: { id: candidateId },
      });
    });

    return { success: true, message: "Candidate deleted successfully" };
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return { success: false, message: "Failed to delete candidate" };
  }
}
