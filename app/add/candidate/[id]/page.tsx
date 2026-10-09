"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ErrorDisplay } from "@/components/error-display";
import { LoaderScreen } from "@/components/loader-screen";
import { Button } from "@/components/ui/button";
import {
  CandidateForm,
  type EducationWithCollege,
} from "./_components/candidate-form";
import { useGetCandidateProgress } from "./query/use-get-candidate-progress";
import { useGetUniversityOptions } from "./query/use-get-college-options";

// Simple CUID2 validation (checks basic format)
export function isValidCuid(id: string): boolean {
  // CUID2 format: lowercase alphanumeric, starts with a letter, 24-32 chars
  return /^[a-z][a-z0-9]{23,31}$/.test(id);
}

export default function Page() {
  const router = useRouter();
  const params = useParams();

  // get college data
  const {
    isPending: isUniversityOptionsPending,
    error: universityOptionsError,
  } = useGetUniversityOptions();

  const candidateId = params.id as string;

  // Fetch existing candidate progress (personal + education data)
  const {
    data: progress,
    isPending: isProgressPending,
    error: progressError,
  } = useGetCandidateProgress({ candidateId });

  // Validate candidateId and redirect if invalid
  useEffect(() => {
    if (!candidateId || !isValidCuid(candidateId)) {
      // Redirect to parent /add route which will generate a new valid CUID
      router.replace("/add/candidate");
    }
  }, [candidateId, router.replace]);

  // If already completed both, redirect to success page
  useEffect(() => {
    if (!progress || !candidateId) return;

    const hasPersonal = Boolean(progress.personal);
    const hasEducation = Boolean(progress.education);

    if (hasPersonal && hasEducation) {
      router.replace(`/add/candidate/${candidateId}/success`);
    }
  }, [progress, candidateId, router.replace]);

  if (isUniversityOptionsPending || isProgressPending) {
    return <LoaderScreen message="Loading..." />;
  }

  if (universityOptionsError) {
    return <ErrorDisplay message={universityOptionsError.message} />;
  }

  if (progressError) {
    return <ErrorDisplay message={progressError.message} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 sm:p-6 md:p-8">
      <div className="flex w-full flex-col items-center gap-2 sm:grid sm:grid-cols-[85px_1fr_85px] sm:gap-4">
        <Button
          asChild
          variant="link"
          className="w-fit self-start gap-2 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground sm:self-auto"
        >
          <Link href="/home">
            <IconArrowLeft className="size-5" data-icon="inline-start" />
            Back
          </Link>
        </Button>

        <h3 className="m-0 w-full text-center">Candidate Information</h3>

        <div className="hidden h-10 w-[85px] sm:block" aria-hidden="true" />
      </div>

      <CandidateForm
        candidateId={candidateId}
        existingPersonal={progress?.personal ?? null}
        existingEducation={
          (progress?.education as EducationWithCollege | undefined) ?? null
        }
      />
    </div>
  );
}
