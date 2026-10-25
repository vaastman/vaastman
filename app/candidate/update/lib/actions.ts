"use server";

import { prisma } from "@/lib/db";
import {
  type VerifyCandidateSchema,
  verifyCandidateSchema,
} from "./zod-type/verify-candidate";

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

export type CandidateVerificationResult = {
  candidateId: string;
  candidateName: string;
};

export async function verifyCandidateForUpdate(payload: VerifyCandidateSchema) {
  const parsed = verifyCandidateSchema.safeParse(payload);
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
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
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

    return {
      success: true as const,
      data: {
        candidateId: candidate.id,
        candidateName: candidate.name,
      },
    };
  } catch (error) {
    console.error("verifyCandidateForUpdate error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to verify candidate identity.";
    return {
      success: false as const,
      message,
    };
  }
}
