import { z } from "zod";
import { Gender } from "@/lib/generated/prisma/enums";

export const updateCandidateSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  collegeId: z.string().min(1, "College ID is required"),
  // Personal details
  name: z.string().trim().min(1, "Name is required").toUpperCase(),
  email: z.string().trim().email("Valid email is required").toUpperCase(),
  phone: z.string().trim().min(1, "Phone is required").toUpperCase(),
  fatherName: z.string().trim().min(1, "Father name is required").toUpperCase(),
  aadharNo: z.string().trim().min(1, "Aadhar number is required").toUpperCase(),
  gender: z.enum(Gender, { error: "Gender is required" }),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required"),
  profilePhoto: z.string().trim().min(1, "Profile photo is required"),
  aadharPhoto: z.string().trim().optional().nullable(),
  // Educational details
  universityRoll: z
    .string()
    .trim()
    .min(1, "University roll is required")
    .toUpperCase(),
  collegeRoll: z
    .string()
    .trim()
    .min(1, "College roll is required")
    .toUpperCase(),
  collegeSessionId: z.string().trim().min(1, "Session is required"),
  course: z.string().trim().optional().nullable(),
  mjcSubject: z.string().trim().min(1, "MJC subject is required"),
  domainOrMainSubject: z.string().trim().min(1, "Domain is required"),
  duration: z.string().trim().min(1, "Duration is required"),
  collegeFee: z.string().trim().min(1, "College fee is required"),
});

export type UpdateCandidateSchema = z.infer<typeof updateCandidateSchema>;
