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

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-2xl items-center px-4 py-12 sm:px-6">
      <Card className="w-full text-center">
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
      </Card>
    </main>
  );
}
