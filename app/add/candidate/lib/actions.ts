"use server";

import { createId } from "@paralleldrive/cuid2";
import { redirect } from "next/navigation";

export async function startCandidateRegistration() {
  redirect(`/add/candidate/${createId()}?tab=personal`);
}
