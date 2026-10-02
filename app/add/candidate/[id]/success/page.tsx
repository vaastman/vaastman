import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { OfferLetterPreview } from "./_components/offer-letter-preview";
import { getOfferLetterData } from "./lib/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const education = await prisma.candidate_Education.findFirst({
    where: { candidateId: id },
    select: { id: true },
  });

  if (!education) {
    notFound();
  }

  const offerLetterResult = await getOfferLetterData(id);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
      {/* <Card className="w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            Form submitted successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          We have received your personal and education details. Thank you for
          completing your candidate registration.
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild size="lg">
            <Link href="/home">Return home</Link>
          </Button>
        </CardFooter>
      </Card> */}

      {/* Offer Letter section */}
      {offerLetterResult.success && offerLetterResult.data && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Your Internship Acceptance Letter
            </h3>
            <p className="text-sm text-muted-foreground">
              Preview and download your offer letter below
            </p>
          </div>
          <OfferLetterPreview data={offerLetterResult.data} />
        </div>
      )}
    </main>
  );
}
