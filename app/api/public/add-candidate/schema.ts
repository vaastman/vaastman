import { z } from "zod";
import { Gender } from "@/lib/generated/prisma/enums";

/**
 * Public API schema for adding a candidate.
 *
 * Only `aadharNo` is required — every other field is optional.
 * This is designed for external intake sources (Google Forms, webhooks, etc.)
 * where not all data may be available upfront.
 */
export const publicAddCandidateSchema = z.object({
  // ── Personal fields ─────────────────────────────────────────────────

  /** Full name of the candidate. Stored in UPPERCASE. */
  name: z.string().trim().toUpperCase().optional(),

  /** Email address. Stored in UPPERCASE. */
  email: z
    .string()
    .trim()
    .email({ error: "Valid email is required" })
    .toUpperCase()
    .optional(),

  /** Phone number (digits as string). */
  phone: z.string().trim().toUpperCase().optional(),

  /** Father's full name. Stored in UPPERCASE. */
  fatherName: z.string().trim().toUpperCase().optional(),

  /**
   * Aadhar number — this is the ONLY required field.
   * 12-digit Aadhar number as a string (e.g. "123456789012").
   * Must be unique across all candidates.
   */
  aadharNo: z
    .string()
    .trim()
    .min(1, { error: "Aadhar number is required" })
    .toUpperCase(),

  /** URL / path to the candidate's profile photo. */
  profilePhoto: z.string().trim().optional(),

  /** URL / path to the candidate's Aadhar card photo. */
  aadharPhoto: z.string().trim().optional(),

  /** Gender: "MALE" | "FEMALE" | "OTHER" */
  gender: z
    .enum(Gender, { error: "Gender must be MALE, FEMALE, or OTHER" })
    .optional(),

  /** Date of birth as a string (e.g. "2000-01-15" or "15/01/2000"). */
  dateOfBirth: z.string().trim().optional(),

  // ── Education fields ────────────────────────────────────────────────
  // Provide these together. If collegeId + collegeSessionId are missing,
  // the education record will be skipped.

  /** University roll number. Stored in UPPERCASE. */
  universityRoll: z.string().trim().toUpperCase().optional(),

  /** College roll number. Stored in UPPERCASE. */
  collegeRoll: z.string().trim().toUpperCase().optional(),

  /** CUID of the college (from the College table). Required for education. */
  collegeId: z.string().trim().optional(),

  /** CUID of the college session (from the CollegeSession table). Required for education. */
  collegeSessionId: z.string().trim().optional(),

  /** Course name (e.g. "B.A.", "B.Sc."). */
  course: z.string().trim().optional(),

  /** Domain or main subject. Stored in UPPERCASE. */
  domainOrMainSubject: z.string().trim().toUpperCase().optional(),

  /** MJC subject name. */
  mjcSubject: z.string().trim().optional(),
});

export type PublicAddCandidateSchema = z.infer<typeof publicAddCandidateSchema>;

/**
 * Flexible input schema supporting:
 * 1. An array of candidates: `[ { aadharNo: ... }, { aadharNo: ... } ]`
 * 2. An object with a `candidates` array: `{ candidates: [ ... ] }`
 * 3. A single candidate object: `{ aadharNo: ... }`
 */
export const publicAddCandidatesInputSchema = z.union([
  z
    .array(publicAddCandidateSchema)
    .min(1, { error: "Array must contain at least one candidate" }),
  z.object({
    candidates: z.array(publicAddCandidateSchema).min(1, {
      error: "candidates array must contain at least one candidate",
    }),
  }),
  publicAddCandidateSchema,
]);

export type PublicAddCandidatesInput = z.infer<
  typeof publicAddCandidatesInputSchema
>;
