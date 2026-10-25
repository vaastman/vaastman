"use server";

import { prisma } from "@/lib/db";
import {
  type LookupOfferLetterSchema,
  lookupOfferLetterSchema,
} from "./zod-type/lookup-offer-letter";

export type OfferLetterData = {
  candidateName: string;
  collegeName: string;
  domainOrMainSubject: string;
  universityRoll: string;
  universityName: string;
  profilePhoto: string;
  letterNo: string;
  date: string;
};

/**
 * Normalizes date strings (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, etc.)
 * into a standard YYYY-MM-DD format for reliable matching.
 */
function normalizeDate(val: string): string {
  const cleaned = val.trim();
  // YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = cleaned.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = cleaned.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return cleaned;
}

export async function lookupOfferLetter(payload: LookupOfferLetterSchema) {
  const parsed = lookupOfferLetterSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false as const,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { aadharNo, dateOfBirth } = parsed.data;

  try {
    const candidate = await prisma.candidate_Personal.findUnique({
      where: { aadharNo },
      include: {
        candidateEducations: {
          include: {
            college: {
              include: {
                university: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    if (!candidate) {
      return {
        success: false as const,
        message: "No candidate record found with this Aadhar Number.",
      };
    }

    // Verify Date of Birth
    const normalizedInputDob = normalizeDate(dateOfBirth);
    const normalizedStoredDob = normalizeDate(candidate.dateOfBirth);

    if (
      normalizedInputDob !== normalizedStoredDob &&
      dateOfBirth.trim() !== candidate.dateOfBirth.trim()
    ) {
      return {
        success: false as const,
        message: "Date of Birth does not match our records.",
      };
    }

    const education = candidate.candidateEducations[0];
    if (!education) {
      return {
        success: false as const,
        message:
          "Your education details have not been submitted yet. Please complete your registration details first.",
      };
    }

    const letterNo = `${new Date().getFullYear()}/${candidate.id.slice(-6).toUpperCase()}`;

    const data: OfferLetterData = {
      candidateName: candidate.name,
      collegeName: education.college.name,
      domainOrMainSubject: education.domainOrMainSubject,
      universityRoll: education.universityRoll,
      universityName: education.college.university.name.replace(/_/g, " "),
      profilePhoto: candidate.profilePhoto,
      letterNo,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };

    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error("lookupOfferLetter error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to look up offer letter.";
    return {
      success: false as const,
      message,
    };
  }
}
