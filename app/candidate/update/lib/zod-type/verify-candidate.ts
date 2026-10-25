import { z } from "zod";

export const verifyCandidateSchema = z.object({
  aadharNo: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .min(12, { error: "Aadhar Number must be exactly 12 digits" })
        .max(12, { error: "Aadhar Number must be exactly 12 digits" }),
    ),
  dateOfBirth: z.string().trim().min(1, { error: "Date of Birth is required" }),
});

export type VerifyCandidateSchema = z.infer<typeof verifyCandidateSchema>;
