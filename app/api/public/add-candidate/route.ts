import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  type PublicAddCandidateSchema,
  publicAddCandidatesInputSchema,
} from "./schema";

type CandidateResult = {
  aadharNo: string;
  status: "CREATED" | "DUPLICATE" | "FAILED";
  candidateId?: string;
  educationId?: string | null;
  message?: string;
};

/**
 * POST /api/public/add-candidate
 *
 * Public endpoint (no auth) for adding candidates from external sources
 * like Google Forms or bulk webhook batches.
 *
 * Accepts either:
 * - A single candidate object: `{ aadharNo: "...", name: "..." }`
 * - An array of candidate objects: `[ { aadharNo: "..." }, { aadharNo: "..." } ]`
 * - An object with a candidates array: `{ "candidates": [ ... ] }`
 *
 * All fields are optional except `aadharNo`.
 * Sets `registrationSource` to "api-gForm" and `isOfferLetterSent` to false.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = publicAddCandidatesInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const isSingle =
    !Array.isArray(body) &&
    !(body && typeof body === "object" && "candidates" in body);

  let candidateList: PublicAddCandidateSchema[];
  if (Array.isArray(parsed.data)) {
    candidateList = parsed.data;
  } else if ("candidates" in parsed.data) {
    candidateList = parsed.data.candidates;
  } else {
    candidateList = [parsed.data];
  }

  if (candidateList.length === 0) {
    return Response.json(
      { success: false, message: "No candidate records provided" },
      { status: 400 },
    );
  }

  // ── 1. Batch check for existing Aadhar numbers in DB ────────────────
  const aadharNumbers = candidateList.map((c) => c.aadharNo);
  const existingRecords = await prisma.candidate_Personal.findMany({
    where: { aadharNo: { in: aadharNumbers } },
    select: { aadharNo: true },
  });
  const existingAadharSet = new Set(existingRecords.map((r) => r.aadharNo));

  // ── 2. Pre-fetch unique colleges & active sessions in one query ─────
  const collegeIds = [
    ...new Set(
      candidateList
        .map((c) => c.collegeId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const colleges =
    collegeIds.length > 0
      ? await prisma.college.findMany({
          where: { id: { in: collegeIds } },
          select: {
            id: true,
            sessions: {
              where: { status: "ACTIVE" },
              select: { id: true, fees: true, duration: true },
            },
          },
        })
      : [];

  const collegeMap = new Map(colleges.map((c) => [c.id, c]));

  // ── 3. Persist candidates inside a transaction ──────────────────────
  try {
    const seenInBatch = new Set<string>();

    const results: CandidateResult[] = await prisma.$transaction(async (tx) => {
      const batchResults: CandidateResult[] = [];

      for (const data of candidateList) {
        // Check for duplicate Aadhar (either in DB or earlier in the same batch)
        if (
          existingAadharSet.has(data.aadharNo) ||
          seenInBatch.has(data.aadharNo)
        ) {
          batchResults.push({
            aadharNo: data.aadharNo,
            status: "DUPLICATE",
            message: "A candidate with this Aadhar number already exists",
          });
          continue;
        }

        seenInBatch.add(data.aadharNo);

        // 1. Create personal details
        const personal = await tx.candidate_Personal.create({
          data: {
            name: data.name ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            fatherName: data.fatherName ?? "",
            aadharNo: data.aadharNo,
            profilePhoto: data.profilePhoto ?? "",
            aadharPhoto: data.aadharPhoto ?? "",
            gender: data.gender ?? "MALE",
            dateOfBirth: data.dateOfBirth ?? "",
            registrationSource: "api-gForm",
            isOfferLetterSent: false,
          },
        });

        // 2. Create education record if college + session are valid
        let educationId: string | null = null;
        if (data.collegeId && data.collegeSessionId) {
          const college = collegeMap.get(data.collegeId);
          const session = college?.sessions.find(
            (s) => s.id === data.collegeSessionId,
          );

          if (college && session) {
            const education = await tx.candidate_Education.create({
              data: {
                candidateId: personal.id,
                collegeId: college.id,
                collegeSessionId: session.id,
                universityRoll: data.universityRoll ?? "",
                collegeRoll: data.collegeRoll ?? "",
                collegeFee: session.fees,
                duration: session.duration,
                course: data.course ?? "",
                domainOrMainSubject: data.domainOrMainSubject ?? "",
                mjcSubject: data.mjcSubject ?? "",
              },
              select: { id: true },
            });
            educationId = education.id;
          }
        }

        batchResults.push({
          aadharNo: data.aadharNo,
          status: "CREATED",
          candidateId: personal.id,
          educationId,
        });
      }

      return batchResults;
    });

    // ── Single candidate response format (backwards compatible) ───────
    if (isSingle) {
      const single = results[0];
      if (single.status === "CREATED") {
        return Response.json(
          {
            success: true,
            data: {
              candidateId: single.candidateId,
              educationId: single.educationId,
            },
          },
          { status: 201 },
        );
      }

      if (single.status === "DUPLICATE") {
        return Response.json(
          {
            success: false,
            message: "A candidate with this Aadhar number already exists",
          },
          { status: 409 },
        );
      }
    }

    // ── Bulk candidates response format ───────────────────────────────
    const createdCount = results.filter((r) => r.status === "CREATED").length;
    const duplicateCount = results.filter(
      (r) => r.status === "DUPLICATE",
    ).length;
    const failedCount = results.filter((r) => r.status === "FAILED").length;

    return Response.json(
      {
        success: true,
        summary: {
          total: candidateList.length,
          created: createdCount,
          duplicates: duplicateCount,
          failed: failedCount,
        },
        data: results,
      },
      { status: createdCount > 0 ? 201 : 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return Response.json(
          {
            success: false,
            message: "A candidate with this Aadhar number already exists",
          },
          { status: 409 },
        );
      }
      return Response.json(
        { success: false, message: "Unable to save candidate details" },
        { status: 500 },
      );
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return Response.json(
        { success: false, message: "Invalid candidate details" },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: false,
        message: "Something went wrong while saving candidate details",
      },
      { status: 500 },
    );
  }
}
