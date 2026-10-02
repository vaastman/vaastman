import { z } from "zod";
import { Gender } from "@/lib/generated/prisma/enums";

export const addCandidatePersonalSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { error: "Name is required" }).toUpperCase(),
  email: z
    .string()
    .trim()
    .email({ error: "Valid email is required" })
    .toUpperCase(),
  phone: z.string().trim().min(1, { error: "Phone is required" }).toUpperCase(),
  fatherName: z
    .string()
    .trim()
    .min(1, { error: "Father name is required" })
    .toUpperCase(),
  aadharNo: z
    .string()
    .trim()
    .min(1, { error: "Aadhar number is required" })
    .toUpperCase(),
  profilePhoto: z
    .string()
    .trim()
    .min(1, { error: "Profile photo is required" }),
  aadharPhoto: z.string().trim().min(1, { error: "Aadhar photo is required" }),
  gender: z.enum(Gender, { error: "Gender is required" }),
  dateOfBirth: z.string().trim().min(1, { error: "Date of birth is required" }),
});

export type AddCandidatePersonalSchema = z.infer<
  typeof addCandidatePersonalSchema
>;
