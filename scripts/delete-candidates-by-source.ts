import "dotenv/config";
import { prisma } from "../lib/db";

async function main() {
  console.log("==================================================");
  console.log("   Vaastman - Delete Candidates By Source        ");
  console.log("==================================================");

  // Read source from CLI arg, defaulting to "api-gForm"
  const args = process.argv.slice(2);
  const targetSource = args[0] || "api-gForm";

  console.log(
    `\n🔍 Searching for candidates with registrationSource: "${targetSource}"...\n`,
  );

  // 1. Fetch matching candidate IDs
  const candidates = await prisma.candidate_Personal.findMany({
    where: {
      registrationSource: targetSource,
    },
    select: {
      id: true,
      name: true,
      aadharNo: true,
      email: true,
    },
  });

  if (candidates.length === 0) {
    console.log(
      `✨ No candidates found with registrationSource = "${targetSource}". Nothing to delete.`,
    );
    process.exit(0);
  }

  const candidateIds = candidates.map((c) => c.id);
  console.log(`📋 Found ${candidates.length} candidate(s) to delete:`);
  for (const c of candidates) {
    console.log(
      `   - ${c.name || "UNNAMED"} | Aadhar: ${c.aadharNo} | Email: ${c.email || "N/A"} (${c.id})`,
    );
  }

  console.log("\n🗑️  Deleting candidate records and all associated data...");

  // 2. Perform cascade deletion in an atomic transaction
  // Note: Candidate_Payment has onDelete: Restrict, so we must delete payments first.
  const result = await prisma.$transaction(async (tx) => {
    const deletedPayments = await tx.candidate_Payment.deleteMany({
      where: {
        candidateId: { in: candidateIds },
      },
    });

    const deletedCertifications = await tx.candidate_Certification.deleteMany({
      where: {
        candidateId: { in: candidateIds },
      },
    });

    const deletedEducations = await tx.candidate_Education.deleteMany({
      where: {
        candidateId: { in: candidateIds },
      },
    });

    const deletedPersonal = await tx.candidate_Personal.deleteMany({
      where: {
        id: { in: candidateIds },
      },
    });

    return {
      payments: deletedPayments.count,
      certifications: deletedCertifications.count,
      educations: deletedEducations.count,
      personal: deletedPersonal.count,
    };
  });

  console.log("\n==================================================");
  console.log("  Deletion Summary:");
  console.log(`  - Target Source:            "${targetSource}"`);
  console.log(`  - Personal Records Deleted: ${result.personal}`);
  console.log(`  - Education Records:        ${result.educations}`);
  console.log(`  - Payment Records:          ${result.payments}`);
  console.log(`  - Certification Records:    ${result.certifications}`);
  console.log("==================================================");
  console.log("✅ All matching records successfully deleted.\n");

  process.exit(0);
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("❌ Fatal error during deletion:", msg);
  process.exit(1);
});
