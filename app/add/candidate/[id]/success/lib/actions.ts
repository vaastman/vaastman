"use server";

import { prisma } from "@/lib/db";

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

export async function getOfferLetterData(candidateId: string) {
  try {
    const candidate = await prisma.candidate_Personal.findUnique({
      where: { id: candidateId },
      select: {
        name: true,
        profilePhoto: true,
        candidateEducations: {
          select: {
            universityRoll: true,
            domainOrMainSubject: true,
            college: {
              select: {
                name: true,
                university: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          take: 1,
        },
      },
    });

    if (!candidate) {
      return { success: false, message: "Candidate not found" };
    }

    const education = candidate.candidateEducations[0];

    if (!education) {
      return { success: false, message: "Candidate education not found" };
    }

    // Generate a letter number based on current year and a portion of candidateId
    const letterNo = `${new Date().getFullYear()}/${candidateId.slice(-6).toUpperCase()}`;

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

    return { success: true, data };
  } catch {
    return {
      success: false,
      message: "Failed to fetch offer letter data",
    };
  }
}
