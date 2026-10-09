"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  COURSE_OPTIONS,
  getMjcOptionsForCourse,
} from "@/app/add/candidate/[id]/_components/education_candidate/course-mjc-helpers";
import {
  isAcceptedImageType,
  isWithinProfilePhotoSizeLimit,
  uploadProfilePhoto,
} from "@/app/add/candidate/[id]/_components/personal_candidate/profile-photo-upload-helpers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RegisteredStudentRow } from "../lib/actions";
import {
  type UpdateCandidateSchema,
  updateCandidateSchema,
} from "../lib/zod-type/update-candidate";
import { useUpdateCandidate } from "../query/mut-update-candidate";
import { useRegisteredStudentsContext } from "./registered-students-context";

type CandidateEditDialogProps = {
  candidate: RegisteredStudentRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
] as const;

export function CandidateEditDialog({
  candidate,
  open,
  onOpenChange,
}: CandidateEditDialogProps) {
  const { collegeId, sessions, domains } = useRegisteredStudentsContext();
  const { mutateAsync: updateCandidate, isPending } =
    useUpdateCandidate(collegeId);

  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingAadhar, setIsUploadingAadhar] = useState(false);

  const getCandidateFormValues = useCallback(
    (c: RegisteredStudentRow): UpdateCandidateSchema => ({
      candidateId: c.candidateId,
      collegeId: c.collegeId,
      name: c.name,
      email: c.email,
      phone: c.phone,
      fatherName: c.fatherName,
      aadharNo: c.aadharNo,
      gender: (c.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
      dateOfBirth: c.dateOfBirth,
      profilePhoto: c.profilePhoto,
      aadharPhoto: c.aadharPhoto ?? "",
      universityRoll: c.universityRoll === "—" ? "" : c.universityRoll,
      collegeRoll: c.collegeRoll === "—" ? "" : c.collegeRoll,
      collegeSessionId:
        c.collegeSessionId === "pending-education"
          ? (sessions[0]?.id ?? "")
          : c.collegeSessionId,
      course: c.course === "—" ? "" : (c.course ?? ""),
      mjcSubject: c.mjcSubject === "—" ? "" : c.mjcSubject,
      domainOrMainSubject:
        c.domainOrMainSubject === "—"
          ? (domains[0]?.name ?? "")
          : c.domainOrMainSubject,
      duration: c.duration === "—" ? (sessions[0]?.duration ?? "") : c.duration,
      collegeFee:
        c.collegeFee === "—" ? (sessions[0]?.fees ?? "") : c.collegeFee,
    }),
    [sessions, domains],
  );

  const form = useForm<UpdateCandidateSchema>({
    resolver: zodResolver(updateCandidateSchema),
    defaultValues: getCandidateFormValues(candidate),
  });

  // Reset form when candidate changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset(getCandidateFormValues(candidate));
    }
  }, [open, candidate, form, getCandidateFormValues]);

  const selectedCourse = form.watch("course");
  const mjcOptions = getMjcOptionsForCourse(selectedCourse || "");

  const profilePhotoValue = form.watch("profilePhoto");
  const aadharPhotoValue = form.watch("aadharPhoto");

  const onSubmit = async (data: UpdateCandidateSchema) => {
    try {
      await updateCandidate(data);
      onOpenChange(false);
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAcceptedImageType(file)) {
      toast.error(
        "Please upload a valid image file (JPEG, PNG, JPG, or WebP).",
      );
      return;
    }
    if (!isWithinProfilePhotoSizeLimit(file)) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setIsUploadingProfile(true);
    try {
      const url = await uploadProfilePhoto(file, "profile");
      form.setValue("profilePhoto", url, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Profile photo uploaded!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload photo",
      );
    } finally {
      setIsUploadingProfile(false);
      e.target.value = "";
    }
  };

  const handleAadharUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAcceptedImageType(file)) {
      toast.error(
        "Please upload a valid image file (JPEG, PNG, JPG, or WebP).",
      );
      return;
    }
    if (!isWithinProfilePhotoSizeLimit(file)) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setIsUploadingAadhar(true);
    try {
      const url = await uploadProfilePhoto(file, "aadhar");
      form.setValue("aadharPhoto", url, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Aadhar document uploaded!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload aadhar",
      );
    } finally {
      setIsUploadingAadhar(false);
      e.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[92vw] lg:max-w-[90vw] xl:max-w-[85vw] max-h-[92vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Candidate Details
          </DialogTitle>
          <DialogDescription>
            Update personal and academic records for{" "}
            <strong className="text-foreground">{candidate.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="academic">Academic Details</TabsTrigger>
            </TabsList>

            {/* PERSONAL DETAILS TAB */}
            <TabsContent value="personal" className="space-y-4 pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Full Name</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="Candidate full name"
                          className="uppercase"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="fatherName"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Father's Name</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="Father's name"
                          className="uppercase"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Email Address</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="candidate@example.com"
                          className="uppercase"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Phone Number</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          type="tel"
                          aria-invalid={fieldState.invalid}
                          placeholder="Phone number"
                          className="uppercase"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="gender"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Gender</FieldLabel>
                      <FieldContent>
                        <NativeSelect
                          {...field}
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                        >
                          {genderOptions.map((opt) => (
                            <NativeSelectOption
                              key={opt.value}
                              value={opt.value}
                            >
                              {opt.label}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Date of Birth</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          type="date"
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="aadharNo"
                  render={({ field, fieldState }) => (
                    <Field className="md:col-span-2">
                      <FieldLabel requiredLable>Aadhar Number</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter 12-digit Aadhar number"
                          className="font-mono"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              {/* Photo Uploads in Edit Mode */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t">
                {/* Profile Photo */}
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Profile Photo</span>
                    {isUploadingProfile && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconLoader2 className="size-3.5 animate-spin" />
                        Uploading...
                      </span>
                    )}
                  </div>
                  {profilePhotoValue && (
                    <div className="relative aspect-3/4 w-20 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={profilePhotoValue}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <label className="block">
                    <span className="sr-only">Change profile photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingProfile}
                      onChange={handleProfileUpload}
                      className="block w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Aadhar Photo */}
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Aadhar Photo</span>
                    {isUploadingAadhar && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconLoader2 className="size-3.5 animate-spin" />
                        Uploading...
                      </span>
                    )}
                  </div>
                  {aadharPhotoValue ? (
                    <div className="relative aspect-4/3 w-28 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={aadharPhotoValue}
                        alt="Aadhar preview"
                        fill
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No document attached
                    </p>
                  )}
                  <label className="block">
                    <span className="sr-only">Change aadhar photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingAadhar}
                      onChange={handleAadharUpload}
                      className="block w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* ACADEMIC DETAILS TAB */}
            <TabsContent value="academic" className="space-y-4 pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={form.control}
                  name="universityRoll"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>University Roll</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="University Roll number"
                          className="uppercase font-mono"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="collegeRoll"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>College Roll</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="College Roll number"
                          className="uppercase font-mono"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="collegeSessionId"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Session</FieldLabel>
                      <FieldContent>
                        <NativeSelect
                          {...field}
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(e);
                            // Auto-fill duration and fee from selected session if available
                            const sel = sessions.find(
                              (s) => s.id === e.target.value,
                            );
                            if (sel) {
                              if (sel.duration) {
                                form.setValue("duration", sel.duration);
                              }
                              if (sel.fees) {
                                form.setValue("collegeFee", sel.fees);
                              }
                            }
                          }}
                        >
                          <NativeSelectOption value="">
                            Select Session
                          </NativeSelectOption>
                          {sessions.map((session) => (
                            <NativeSelectOption
                              key={session.id}
                              value={session.id}
                            >
                              {session.name}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="course"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Course</FieldLabel>
                      <FieldContent>
                        <NativeSelect
                          {...field}
                          value={field.value ?? ""}
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(e);
                            form.setValue("mjcSubject", "");
                          }}
                        >
                          <NativeSelectOption value="">
                            Select Course
                          </NativeSelectOption>
                          {COURSE_OPTIONS.map((c) => (
                            <NativeSelectOption key={c.value} value={c.value}>
                              {c.label}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="mjcSubject"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>MJC Subject</FieldLabel>
                      <FieldContent>
                        <NativeSelect
                          {...field}
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                          disabled={!selectedCourse || mjcOptions.length === 0}
                        >
                          <NativeSelectOption value="">
                            {!selectedCourse
                              ? "Select course first"
                              : mjcOptions.length === 0
                                ? "No MJC subjects for this course"
                                : "Select MJC Subject"}
                          </NativeSelectOption>
                          {mjcOptions.map((opt) => (
                            <NativeSelectOption
                              key={opt.value}
                              value={opt.value}
                            >
                              {opt.label}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="domainOrMainSubject"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>
                        Domain / Main Subject
                      </FieldLabel>
                      <FieldContent>
                        {domains && domains.length > 0 ? (
                          <NativeSelect
                            {...field}
                            aria-invalid={fieldState.invalid}
                            className="w-full"
                          >
                            <NativeSelectOption value="">
                              Select Domain
                            </NativeSelectOption>
                            {domains.map((dom) => (
                              <NativeSelectOption key={dom.id} value={dom.name}>
                                {dom.name}
                              </NativeSelectOption>
                            ))}
                          </NativeSelect>
                        ) : (
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            placeholder="Domain name"
                          />
                        )}
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="duration"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>Duration</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. 4 Years"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="collegeFee"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel requiredLable>College Fee</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. 2000"
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              <LoadingSwap isLoading={isPending}>Save Changes</LoadingSwap>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
