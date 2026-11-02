"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  type FilterOptionsData,
  type FilterStudentsInput,
  type FilteredStudentPayment,
  type FilteredStudentRow,
  type FilteredStudentsData,
  filterStudentsInputSchema,
} from "./zod-type/filter-students";

export async function getStudentFilterOptions(): Promise<{
  success: boolean;
  message?: string;
  data?: FilterOptionsData;
}> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const colleges = await prisma.college.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        university: {
          select: {
            name: true,
          },
        },
        domains: {
          select: {
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
            duration: true,
            fees: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    // Also collect any distinct domains in candidateEducations for each college
    // in case students were registered under a domain not explicitly linked in Domain table
    const educationDomains = await prisma.candidate_Education.findMany({
      select: {
        collegeId: true,
        domainOrMainSubject: true,
      },
      distinct: ["collegeId", "domainOrMainSubject"],
    });

    const collegeDomainMap = new Map<string, Set<string>>();
    for (const ed of educationDomains) {
      if (!ed.domainOrMainSubject || ed.domainOrMainSubject.trim() === "")
        continue;
      if (!collegeDomainMap.has(ed.collegeId)) {
        collegeDomainMap.set(ed.collegeId, new Set());
      }
      collegeDomainMap.get(ed.collegeId)?.add(ed.domainOrMainSubject.trim());
    }

    const collegeOptions = colleges.map((c) => {
      const domainSet = new Set<string>();
      for (const d of c.domains) {
        if (d.name?.trim()) domainSet.add(d.name.trim());
      }
      const extraDomains = collegeDomainMap.get(c.id);
      if (extraDomains) {
        for (const ed of extraDomains) {
          domainSet.add(ed);
        }
      }

      return {
        id: c.id,
        name: c.name,
        code: c.code,
        universityName: c.university?.name
          ? c.university.name.replace(/_/g, " ")
          : "",
        domains: Array.from(domainSet).sort((a, b) => a.localeCompare(b)),
        sessions: c.sessions.map((s) => ({
          id: s.id,
          name: s.name,
          duration: s.duration,
          fees: s.fees,
        })),
      };
    });

    return {
      success: true,
      data: {
        colleges: collegeOptions,
      },
    };
  } catch (error) {
    console.error("Error fetching student filter options:", error);
    return { success: false, message: "Failed to load filter options" };
  }
}

export async function getFilteredStudents(input: FilterStudentsInput): Promise<{
  success: boolean;
  message?: string;
  data?: FilteredStudentsData;
}> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = filterStudentsInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  const { collegeId, domain, sessionId } = parsed.data;

  try {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: {
        id: true,
        name: true,
        code: true,
        university: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!college) {
      return { success: false, message: "College not found" };
    }

    const whereClause: {
      collegeId: string;
      domainOrMainSubject?: string;
      collegeSessionId?: string;
    } = {
      collegeId,
    };

    if (domain && domain.trim() && domain !== "ALL") {
      whereClause.domainOrMainSubject = domain.trim();
    }

    if (sessionId && sessionId.trim() && sessionId !== "ALL") {
      whereClause.collegeSessionId = sessionId.trim();
    }

    const educations = await prisma.candidate_Education.findMany({
      where: whereClause,
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            fatherName: true,
            gender: true,
            dateOfBirth: true,
            aadharNo: true,
            profilePhoto: true,
            aadharPhoto: true,
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
            duration: true,
            fees: true,
          },
        },
      },
      orderBy: {
        candidate: {
          name: "asc",
        },
      },
    });

    let maleCount = 0;
    let femaleCount = 0;
    let otherGenderCount = 0;
    let verifiedPaymentCount = 0;
    let pendingPaymentCount = 0;

    const studentRows: FilteredStudentRow[] = educations.map((item) => {
      const cand = item.candidate;
      const sess = item.collegeSession;

      if (cand.gender === "MALE") maleCount++;
      else if (cand.gender === "FEMALE") femaleCount++;
      else otherGenderCount++;

      const paymentStatuses = cand.candidatePayments.map((p) => p.status);
      let paymentStatus = "N/A";
      if (paymentStatuses.includes("VERIFIED")) {
        paymentStatus = "VERIFIED";
        verifiedPaymentCount++;
      } else if (paymentStatuses.includes("CREATED")) {
        paymentStatus = "CREATED";
        pendingPaymentCount++;
      } else if (paymentStatuses.includes("FAILED")) {
        paymentStatus = "FAILED";
        pendingPaymentCount++;
      } else {
        pendingPaymentCount++;
      }

      const payments: FilteredStudentPayment[] = cand.candidatePayments.map(
        (p) => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          razorpayPaymentId: p.razorpayPaymentId,
          createdAt: p.createdAt.toISOString(),
        }),
      );

      return {
        candidateId: cand.id,
        educationId: item.id,
        name: cand.name,
        email: cand.email,
        phone: cand.phone,
        fatherName: cand.fatherName,
        gender: cand.gender,
        dateOfBirth: cand.dateOfBirth,
        aadharNo: cand.aadharNo,
        profilePhoto: cand.profilePhoto,
        aadharPhoto: cand.aadharPhoto,
        universityRoll: item.universityRoll,
        collegeRoll: item.collegeRoll,
        course: item.course,
        domainOrMainSubject: item.domainOrMainSubject,
        mjcSubject: item.mjcSubject,
        duration: item.duration,
        collegeFee: item.collegeFee,
        collegeId: college.id,
        collegeName: college.name,
        collegeCode: college.code,
        universityName: college.university?.name
          ? college.university.name.replace(/_/g, " ")
          : "",
        sessionId: sess.id,
        sessionName: sess.name,
        paymentStatus,
        registrationStatus: "COMPLETE",
        payments,
      };
    });

    let selectedSessionName: string | null = null;
    if (sessionId && sessionId !== "ALL") {
      const foundSession = educations[0]?.collegeSession;
      if (foundSession) {
        selectedSessionName = foundSession.name;
      }
    }

    return {
      success: true,
      data: {
        students: studentRows,
        summary: {
          totalStudents: studentRows.length,
          maleCount,
          femaleCount,
          otherGenderCount,
          verifiedPaymentCount,
          pendingPaymentCount,
          collegeName: college.name,
          collegeCode: college.code,
          universityName: college.university?.name
            ? college.university.name.replace(/_/g, " ")
            : "",
          domain: domain || "ALL",
          sessionName: selectedSessionName,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching filtered students:", error);
    return { success: false, message: "Failed to fetch student details" };
  }
}
