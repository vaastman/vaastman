import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  type PublicAddCandidateSchema,
  publicAddCandidateSchema,
} from "./schema";

/**
 * POST /api/public/add-candidate
 *
 * Public endpoint (no auth) for adding a candidate from external sources
 * like Google Forms. All fields are optional except `aadharNo`.
 *
 * Sets `registrationSource` to "api-gForm" so we can track where the
 * student came from.
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

  const parsed = publicAddCandidateSchema.safeParse(body);
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

  const data: PublicAddCandidateSchema = parsed.data;

  // ── Check for duplicate Aadhar ──────────────────────────────────────
  const existingCandidate = await prisma.candidate_Personal.findUnique({
    where: { aadharNo: data.aadharNo },
  });

  if (existingCandidate) {
    return Response.json(
      {
        success: false,
        message: "A candidate with this Aadhar number already exists",
      },
      { status: 409 },
    );
  }

  // ── Validate college + session if education fields are provided ──────
  let selectedCollege: {
    id: string;
    sessions: { id: string; fees: string; duration: string }[];
  } | null = null;

  if (data.collegeId && data.collegeSessionId) {
    selectedCollege = await prisma.college.findUnique({
      where: { id: data.collegeId },
      select: {
        id: true,
        sessions: {
          where: { id: data.collegeSessionId, status: "ACTIVE" },
          select: { id: true, fees: true, duration: true },
        },
      },
    });

    if (!selectedCollege) {
      return Response.json(
        { success: false, message: "Selected college was not found" },
        { status: 400 },
      );
    }

    if (selectedCollege.sessions.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Selected session was not found or is inactive",
        },
        { status: 400 },
      );
    }
  }

  // ── Persist candidate ───────────────────────────────────────────────
  try {
    const result = await prisma.$transaction(async (tx) => {
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
        },
      });

      // 2. Create education only if college + session were provided & valid
      let education: { id: string; candidateId: string } | null = null;
      const session = selectedCollege?.sessions[0];

      if (selectedCollege && session) {
        education = await tx.candidate_Education.create({
          data: {
            candidateId: personal.id,
            collegeId: selectedCollege.id,
            collegeSessionId: session.id,
            universityRoll: data.universityRoll ?? "",
            collegeRoll: data.collegeRoll ?? "",
            collegeFee: session.fees,
            duration: session.duration,
            course: data.course ?? "",
            domainOrMainSubject: data.domainOrMainSubject ?? "",
            mjcSubject: data.mjcSubject ?? "",
          },
          select: { id: true, candidateId: true },
        });
      }

      return { personal, education };
    });

    return Response.json(
      {
        success: true,
        data: {
          candidateId: result.personal.id,
          educationId: result.education?.id ?? null,
        },
      },
      { status: 201 },
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
