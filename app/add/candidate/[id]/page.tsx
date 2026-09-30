"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ErrorDisplay } from "@/components/error-display";
import { LoaderScreen } from "@/components/loader-screen";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCandidateEducationForm } from "./_components/education_candidate/main";
import { AddCandidatePersonalForm } from "./_components/personal_candidate/main";
import { useGetUniversityOptions } from "./query/use-get-college-options";

// Valid tab values
const VALID_TABS = ["personal", "education"] as const;
type ValidTab = (typeof VALID_TABS)[number];

// Simple CUID2 validation (checks basic format)
export function isValidCuid(id: string): boolean {
  // CUID2 format: lowercase alphanumeric, starts with a letter, 24-32 chars
  return /^[a-z][a-z0-9]{23,31}$/.test(id);
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // get college data
  const {
    isPending: isUniversityOptionsPending,
    error: universityOptionsError,
  } = useGetUniversityOptions();

  const candidateId = params.id as string;

  const tabParam = searchParams.get("tab");

  // Validate tab - fallback to "patient" if invalid
  const currentTab: ValidTab =
    tabParam && VALID_TABS.includes(tabParam as ValidTab)
      ? (tabParam as ValidTab)
      : "personal";

  // Validate patientId and redirect if invalid
  useEffect(() => {
    if (!candidateId || !isValidCuid(candidateId)) {
      // Redirect to parent /add route which will generate a new valid CUID
      router.replace("/add/candidate");
    } else if (tabParam !== currentTab) {
      // If tab was invalid, update URL to show correct tab
      router.replace(`/add/candidate/${candidateId}?tab=${currentTab}`);
    }
  }, [candidateId, tabParam, currentTab, router.replace]);

  if (isUniversityOptionsPending) {
    return <LoaderScreen message="Loading..." />;
  }

  if (universityOptionsError) {
    return <ErrorDisplay message={universityOptionsError.message} />;
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-4 sm:p-6 md:p-8">
      <div className="flex w-full flex-col items-center gap-2 sm:grid sm:grid-cols-[85px_1fr_85px] sm:gap-4">
        <Button
          asChild
          variant="link"
          className="w-fit self-start gap-2 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground sm:self-auto"
        >
          <Link href="/home">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>

        <h3 className="m-0 w-full text-center">Candidate Information</h3>

        <div className="hidden h-10 w-[85px] sm:block" aria-hidden="true" />
      </div>

      <Tabs value={currentTab} className="gap-4">
        <TabsList className="sr-only">
          <TabsTrigger
            disabled={currentTab !== "personal"}
            value="personal"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger
            disabled={currentTab !== "education"}
            value="education"
          >
            Education
          </TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="mt-0">
          <AddCandidatePersonalForm candidateId={candidateId} />
        </TabsContent>
        <TabsContent value="education" className="mt-0">
          <AddCandidateEducationForm candidateId={candidateId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
