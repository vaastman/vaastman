import "dotenv/config";
import { Resend } from "resend";
import { prisma } from "../lib/db";
import { generatePdfFromHtml } from "./lib/generate-pdf";
import {
  type OfferLetterData,
  renderOfferLetterHtml,
} from "./lib/offer-letter-template";

async function main() {
  console.log("==================================================");
  console.log("  Vaastman - Dispatch Offer Letters to Candidates ");
  console.log("==================================================");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: RESEND_API_KEY environment variable is not set.");
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  console.log("\n🔍 Finding eligible candidates...");
  console.log(
    "   Criteria: registrationSource = 'api-gForm' AND isOfferLetterSent = false\n",
  );

  const candidates = await prisma.candidate_Personal.findMany({
    where: {
      registrationSource: "api-gForm",
      isOfferLetterSent: false,
    },
    include: {
      candidateEducations: {
        include: {
          college: {
            include: {
              university: true,
            },
          },
          collegeSession: true,
        },
        take: 1,
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  if (candidates.length === 0) {
    console.log("✨ No pending candidates found to send offer letters to.");
    process.exit(0);
  }

  console.log(
    `📋 Found ${candidates.length} candidate(s) awaiting offer letters.\n`,
  );

  let sentCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const prefix = `[${i + 1}/${candidates.length}] Candidate: ${candidate.name} (${candidate.id})`;

    const email = candidate.email?.trim();
    if (!email || !email.includes("@")) {
      console.warn(
        `⚠️  ${prefix} skipped: No valid email provided (${candidate.email || "EMPTY"}).`,
      );
      skippedCount++;
      continue;
    }

    const education = candidate.candidateEducations[0];
    if (!education || !education.college) {
      console.warn(
        `⚠️  ${prefix} skipped: Missing linked college / education record.`,
      );
      skippedCount++;
      continue;
    }

    try {
      // 1. Prepare offer letter details
      const letterNo = `${new Date().getFullYear()}/${candidate.id.slice(-6).toUpperCase()}`;
      const date = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const offerData: OfferLetterData = {
        candidateName: candidate.name,
        collegeName: education.college.name,
        domainOrMainSubject:
          education.domainOrMainSubject || "Vocational / Technical Internship",
        universityRoll: education.universityRoll || "",
        universityName: education.college.university?.name
          ? education.college.university.name.replace(/_/g, " ")
          : "",
        profilePhoto: candidate.profilePhoto || null,
        letterNo,
        date,
      };

      // 2. Render HTML & Generate PDF attachment
      const letterHtml = renderOfferLetterHtml(offerData);
      const pdfBuffer = generatePdfFromHtml(letterHtml);

      const fileName = `Offer_Letter_${candidate.name.trim().replace(/[\\/:*?"<>|\s]+/g, "_")}.pdf`;

      // 3. Email Body
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333333; line-height: 1.6;">
          <div style="background-color: #1a237e; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">VAASTMAN SOLUTIONS PVT. LTD.</h1>
          </div>
          <div style="padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
            <p style="font-size: 16px;">Dear <strong>${candidate.name}</strong>,</p>
            <p>Congratulations! We are pleased to accept your application and offer you an internship opportunity with <strong>Vaastman Solutions Pvt. Ltd.</strong></p>
            <p>Your official <strong>Internship Offer Letter</strong> has been generated and is attached to this email as a PDF document.</p>
            
            <div style="background: #f4f6fb; border-left: 4px solid #1a237e; padding: 12px 16px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #1a237e;">Offer Details:</p>
              <ul style="margin: 0; padding-left: 20px; color: #444444;">
                <li><strong>Letter No:</strong> ${letterNo}</li>
                <li><strong>College:</strong> ${education.college.name}</li>
                <li><strong>Domain / Subject:</strong> ${offerData.domainOrMainSubject}</li>
              </ul>
            </div>

            <p>Please download and retain the attached PDF for your records and submit it to your institution as required.</p>
            
            <p style="margin-top: 28px;">Warm regards,<br /><strong>Team Vaastman Solutions</strong></p>
          </div>
          <p style="text-align: center; font-size: 12px; color: #888888; margin-top: 16px;">
            Registered Office: Patna, Bihar | CIN: U72900BR2024PTC00000<br />
            This is an automated notification regarding your internship application.
          </p>
        </div>
      `;

      // 4. Send via Resend
      const { error: sendError } = await resend.emails.send(
        {
          from: "Vaastman <noreply@id0.uk>",
          to: [email],
          subject: `Internship Offer Letter — ${candidate.name} | Vaastman Solutions`,
          html: emailHtml,
          attachments: [
            {
              filename: fileName,
              content: pdfBuffer,
            },
          ],
        },
        {
          idempotencyKey: `offer-letter/${candidate.id}/${Date.now()}`,
        },
      );

      if (sendError) {
        console.error(
          `❌ ${prefix} failed to send email to ${email}:`,
          sendError.message,
        );
        failedCount++;
        continue;
      }

      // 5. Update DB to prevent duplicate sending
      await prisma.candidate_Personal.update({
        where: { id: candidate.id },
        data: {
          isOfferLetterSent: true,
          offerLetterSentAt: new Date(),
        },
      });

      console.log(`✅ ${prefix} successfully sent to ${email} (PDF attached).`);
      sentCount++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ ${prefix} encountered error:`, msg);
      failedCount++;
    }
  }

  console.log("\n==================================================");
  console.log("  Summary:");
  console.log(`  - Total processed: ${candidates.length}`);
  console.log(`  - Successfully sent: ${sentCount}`);
  console.log(`  - Skipped:           ${skippedCount}`);
  console.log(`  - Failed:            ${failedCount}`);
  console.log("==================================================");

  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error running script:", err);
  process.exit(1);
});
