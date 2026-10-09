import type { z } from "zod";
import { addCandidateEducationSchema } from "./candidate-education";
import { addCandidatePersonalSchema } from "./candidate-personal";

export const addCandidateSchema = addCandidatePersonalSchema.merge(
  addCandidateEducationSchema,
);

export type AddCandidateSchema = z.infer<typeof addCandidateSchema>;

export const PERSONAL_FIELDS = [
  "name",
  "email",
  "phone",
  "fatherName",
  "aadharNo",
  "profilePhoto",
  "aadharPhoto",
  "gender",
  "dateOfBirth",
] as const;

export type PersonalFieldName = (typeof PERSONAL_FIELDS)[number];
