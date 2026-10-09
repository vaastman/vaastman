"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconArrowRight,
  IconSchoolFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Candidate_Education,
  Candidate_Personal,
} from "@/lib/generated/prisma/client";
import { useCandidateDraftStore } from "../lib/use-candidate-draft-store";
import {
  type AddCandidateSchema,
  addCandidateSchema,
  PERSONAL_FIELDS,
} from "../lib/zod-type/candidate";
import { useAddCandidate } from "../query/mut-add-candidate";
import { FirstTwoRow as EducationFirstTwoRow } from "./education_candidate/first-2-row";
import { SecondTwoRow as EducationSecondTwoRow } from "./education_candidate/second-2-row";
import { AadharUploadRow } from "./personal_candidate/aadhar-upload-row";
import { FirstTwoRow as PersonalFirstTwoRow } from "./personal_candidate/first-2-row";
import { SecondTwoRow as PersonalSecondTwoRow } from "./personal_candidate/second-2-row";

export type EducationWithCollege = Candidate_Education & {
  college: { universityId: string };
};

type ValidTab = "personal" | "education";

export function CandidateForm({
  candidateId,
  existingPersonal,
  existingEducation,
}: {
  candidateId: string;
  existingPersonal: Candidate_Personal | null;
  existingEducation: EducationWithCollege | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: ValidTab =
    tabParam === "education" ? "education" : "personal";

  const [currentTab, setCurrentTab] = useState<ValidTab>(initialTab);

  const setDraft = useCandidateDraftStore((s) => s.setDraft);
  const clearDraft = useCandidateDraftStore((s) => s.clearDraft);

  const isEdit = Boolean(existingPersonal && existingEducation);

  const defaultValues = useMemo<AddCandidateSchema>(
    () => ({
      id: candidateId,
      name: existingPersonal?.name ?? "",
      email: existingPersonal?.email ?? "",
      phone: existingPersonal?.phone ?? "",
      fatherName: existingPersonal?.fatherName ?? "",
      aadharNo: existingPersonal?.aadharNo ?? "",
      profilePhoto: existingPersonal?.profilePhoto ?? "",
      aadharPhoto: existingPersonal?.aadharPhoto ?? "",
      gender: existingPersonal?.gender ?? "MALE",
      dateOfBirth: existingPersonal?.dateOfBirth ?? "",
      universityRoll: existingEducation?.universityRoll ?? "",
      collegeRoll: existingEducation?.collegeRoll ?? "",
      universityId: existingEducation?.college?.universityId ?? "",
      collegeId: existingEducation?.collegeId ?? "",
      collegeSessionId: existingEducation?.collegeSessionId ?? "",
      duration: existingEducation?.duration ?? "",
      course: existingEducation?.course ?? "",
      domainOrMainSubject: existingEducation?.domainOrMainSubject ?? "",
      mjcSubject: existingEducation?.mjcSubject ?? "",
    }),
    [candidateId, existingPersonal, existingEducation],
  );

  const form = useForm<AddCandidateSchema>({
    resolver: zodResolver(addCandidateSchema),
    defaultValues,
  });

  const { mutateAsync: addCandidate, isPending } = useAddCandidate({
    candidateId,
  });

  const updateTab = useCallback(
    (tab: ValidTab) => {
      setCurrentTab(tab);
      router.replace(`/add/candidate/${candidateId}?tab=${tab}`, {
        scroll: false,
      });
    },
    [candidateId, router],
  );

  // Rehydrate draft from Zustand localStorage store on mount
  useEffect(() => {
    const drafts = useCandidateDraftStore.getState().drafts;
    const candidateDraft = drafts[candidateId];
    if (candidateDraft && Object.keys(candidateDraft).length > 0) {
      form.reset({
        ...defaultValues,
        ...candidateDraft,
        id: candidateId,
      });
    }

    // If starting on education tab, verify personal data exists, else fallback to personal
    if (tabParam === "education") {
      const hasPersonalData =
        Boolean(candidateDraft?.name || existingPersonal?.name) &&
        Boolean(candidateDraft?.email || existingPersonal?.email);

      if (!hasPersonalData) {
        updateTab("personal");
      }
    }
  }, [candidateId, defaultValues, existingPersonal, form, tabParam, updateTab]);

  // Sync form changes to Zustand draft store in real time
  useEffect(() => {
    const subscription = form.watch((values) => {
      setDraft(candidateId, values as Partial<AddCandidateSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, candidateId, setDraft]);

  const handleNextToEducation = async () => {
    const isValid = await form.trigger(
      PERSONAL_FIELDS as unknown as (keyof AddCandidateSchema)[],
    );
    if (!isValid) {
      toast.error("Please fill in all required personal details.");
      return;
    }
    updateTab("education");
  };

  const handleTabChange = async (newTab: string) => {
    if (newTab === "education") {
      const isValid = await form.trigger(
        PERSONAL_FIELDS as unknown as (keyof AddCandidateSchema)[],
      );
      if (!isValid) {
        toast.error("Please complete required personal details first.");
        return;
      }
    }
    updateTab(newTab as ValidTab);
  };

  const onSubmit = async (data: AddCandidateSchema) => {
    await addCandidate(data);
    clearDraft(candidateId);
  };

  const onInvalid = (errors: FieldErrors<AddCandidateSchema>) => {
    const hasPersonalErrors = PERSONAL_FIELDS.some((field) =>
      Boolean(errors[field as keyof AddCandidateSchema]),
    );

    if (hasPersonalErrors) {
      updateTab("personal");
      toast.error("Please complete all required personal details.");
    } else {
      toast.error("Please complete all required education details.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="flex flex-col gap-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <IconUserFilled className="size-5" />
            <span>1. Personal Details</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <IconSchoolFilled className="size-5" />
            <span>2. Education Details</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-0">
          <Card>
            <CardHeader className="gap-2">
              <CardTitle className="max-w-none">
                <h4>Personal Details</h4>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <PersonalFirstTwoRow form={form} />
                <PersonalSecondTwoRow form={form} />
                <AadharUploadRow form={form} />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                type="button"
                size="lg"
                className="px-8 text-base"
                onClick={handleNextToEducation}
              >
                Next: Education Details
                <IconArrowRight className="size-5" data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="mt-0">
          <Card>
            <CardHeader className="gap-2">
              <CardTitle className="max-w-none">
                <h4>Education Details</h4>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <EducationFirstTwoRow form={form} />
                <EducationSecondTwoRow form={form} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="px-6 text-base"
                onClick={() => updateTab("personal")}
              >
                <IconArrowLeft className="size-5" data-icon="inline-start" />
                Back to Personal
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                size="lg"
                className="px-8 text-base"
              >
                <LoadingSwap isLoading={isPending}>
                  {isEdit ? "Update All Details" : "Save All Details"}
                </LoadingSwap>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
