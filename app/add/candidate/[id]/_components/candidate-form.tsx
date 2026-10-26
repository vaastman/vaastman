"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconArrowRight,
  IconSchoolFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
  EDUCATION_FIELDS,
  PERSONAL_FIELDS,
} from "../lib/zod-type/candidate";
import type { AddCandidateEducationSchema } from "../lib/zod-type/candidate-education";
import type { AddCandidatePersonalSchema } from "../lib/zod-type/candidate-personal";
import { useAddCandidate } from "../query/mut-add-candidate";
import { useAddCandidateEducation } from "../query/mut-add-candidate-education";
import { useAddCandidatePersonal } from "../query/mut-add-candidate-personal";
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
  isEditMode = false,
  existingPersonal,
  existingEducation,
}: {
  candidateId: string;
  isEditMode?: boolean;
  existingPersonal: Candidate_Personal | null;
  existingEducation: EducationWithCollege | null;
}) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: ValidTab =
    tabParam === "education" ? "education" : "personal";

  const [currentTab, setCurrentTab] = useState<ValidTab>(initialTab);

  const setDraft = useCandidateDraftStore((s) => s.setDraft);
  const clearDraft = useCandidateDraftStore((s) => s.clearDraft);

  const isEdit = Boolean(isEditMode || (existingPersonal && existingEducation));

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

  const { mutateAsync: addCandidate, isPending: isAllPending } =
    useAddCandidate({
      candidateId,
      isEditMode,
    });

  const { mutateAsync: addPersonal, isPending: isPersonalPending } =
    useAddCandidatePersonal({
      candidateId,
      isEditMode,
    });

  const { mutateAsync: addEducation, isPending: isEducationPending } =
    useAddCandidateEducation({
      candidateId,
      isEditMode,
    });

  const updateTab = useCallback(
    (tab: ValidTab) => {
      setCurrentTab(tab);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", tab);
        if (isEditMode) {
          url.searchParams.set("mode", "edit");
        }
        window.history.replaceState(null, "", url.toString());
      }
    },
    [isEditMode],
  );

  // Rehydrate draft from Zustand localStorage store on mount
  useEffect(() => {
    if (isEdit) {
      // In edit mode, ensure form starts with the database record values
      form.reset(defaultValues);
    } else {
      const drafts = useCandidateDraftStore.getState().drafts;
      const candidateDraft = drafts[candidateId];
      if (candidateDraft && Object.keys(candidateDraft).length > 0) {
        form.reset({
          ...defaultValues,
          ...candidateDraft,
          id: candidateId,
        });
      }
    }

    // If starting on education tab, verify personal data exists, else fallback to personal
    if (tabParam === "education") {
      const hasPersonalData =
        Boolean(existingPersonal?.name) ||
        Boolean(useCandidateDraftStore.getState().drafts[candidateId]?.name);

      if (!hasPersonalData && !isEdit) {
        updateTab("personal");
      }
    }
  }, [
    candidateId,
    defaultValues,
    existingPersonal,
    form,
    tabParam,
    updateTab,
    isEdit,
  ]);

  // Sync form changes to Zustand draft store in real time
  useEffect(() => {
    const subscription = form.watch((values) => {
      setDraft(candidateId, values as Partial<AddCandidateSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, candidateId, setDraft]);

  const handleNextToEducation = async () => {
    if (!isEdit) {
      const isValid = await form.trigger(
        PERSONAL_FIELDS as unknown as (keyof AddCandidateSchema)[],
      );
      if (!isValid) {
        toast.error("Please fill in all required personal details.");
        return;
      }
    }
    updateTab("education");
  };

  const handleTabChange = async (newTab: string) => {
    if (!isEdit && newTab === "education") {
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

  const handleSavePersonalOnly = async () => {
    const isValid = await form.trigger(
      PERSONAL_FIELDS as unknown as (keyof AddCandidateSchema)[],
    );
    if (!isValid) {
      toast.error("Please complete all required personal details.");
      return;
    }

    const values = form.getValues();
    const personalData: AddCandidatePersonalSchema = {
      id: candidateId,
      name: values.name,
      email: values.email,
      phone: values.phone,
      fatherName: values.fatherName,
      aadharNo: values.aadharNo,
      profilePhoto: values.profilePhoto,
      aadharPhoto: values.aadharPhoto,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth,
    };

    await addPersonal(personalData);
    clearDraft(candidateId);
  };

  const handleSaveEducationOrAll = async () => {
    if (!isEdit) {
      const isValid = await form.trigger();
      if (!isValid) {
        const errors = form.formState.errors;
        const hasPersonalErrors = PERSONAL_FIELDS.some((field) =>
          Boolean(errors[field as keyof AddCandidateSchema]),
        );
        if (hasPersonalErrors) {
          updateTab("personal");
          toast.error("Please complete all required personal details.");
        } else {
          toast.error("Please complete all required education details.");
        }
        return;
      }
      await addCandidate(form.getValues());
      clearDraft(candidateId);
      return;
    }

    // In EDIT mode:
    // First validate education fields
    const isEduValid = await form.trigger(
      EDUCATION_FIELDS as unknown as (keyof AddCandidateSchema)[],
    );
    if (!isEduValid) {
      toast.error("Please complete all required education details.");
      return;
    }

    const values = form.getValues();

    // Check if personal fields are also valid
    const isPersonalValid = await form.trigger(
      PERSONAL_FIELDS as unknown as (keyof AddCandidateSchema)[],
    );

    if (isPersonalValid) {
      // Both are valid -> update all details in one transaction
      await addCandidate(values);
      clearDraft(candidateId);
    } else {
      // Personal fields may have legacy validation issues or were not modified,
      // but candidate specifically wanted to update education details
      const educationData: AddCandidateEducationSchema = {
        id: candidateId,
        universityRoll: values.universityRoll,
        collegeRoll: values.collegeRoll,
        universityId: values.universityId,
        collegeId: values.collegeId,
        collegeSessionId: values.collegeSessionId,
        duration: values.duration,
        course: values.course,
        domainOrMainSubject: values.domainOrMainSubject,
        mjcSubject: values.mjcSubject,
      };
      await addEducation(educationData);
      clearDraft(candidateId);
    }
  };

  const isSaving = isAllPending || isPersonalPending || isEducationPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (currentTab === "personal") {
          if (isEdit) {
            handleSavePersonalOnly();
          } else {
            handleNextToEducation();
          }
        } else {
          handleSaveEducationOrAll();
        }
      }}
    >
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
            <CardFooter
              className={isEdit ? "flex justify-between gap-4" : "justify-end"}
            >
              {isEdit ? (
                <>
                  <Button
                    type="button"
                    disabled={isSaving}
                    size="lg"
                    className="px-6 text-base cursor-pointer"
                    onClick={handleSavePersonalOnly}
                  >
                    <LoadingSwap isLoading={isPersonalPending}>
                      Update Personal Details
                    </LoadingSwap>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="px-6 text-base cursor-pointer"
                    onClick={handleNextToEducation}
                  >
                    Next: Education Details
                    <IconArrowRight className="size-5" data-icon="inline-end" />
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  className="px-8 text-base cursor-pointer"
                  onClick={handleNextToEducation}
                >
                  Next: Education Details
                  <IconArrowRight className="size-5" data-icon="inline-end" />
                </Button>
              )}
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
                className="px-6 text-base cursor-pointer"
                onClick={() => updateTab("personal")}
              >
                <IconArrowLeft className="size-5" data-icon="inline-start" />
                Back to Personal
              </Button>
              <Button
                disabled={isSaving}
                type="button"
                size="lg"
                className="px-8 text-base cursor-pointer"
                onClick={handleSaveEducationOrAll}
              >
                <LoadingSwap isLoading={isEducationPending || isAllPending}>
                  {isEdit ? "Update Education Details" : "Save All Details"}
                </LoadingSwap>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
