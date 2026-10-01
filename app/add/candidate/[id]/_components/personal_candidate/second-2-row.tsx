"use client";

import { IconPhotoFilled } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { AddCandidatePersonalSchema } from "../../lib/zod-type/candidate-personal";
import { ProfilePhotoPreviewButton } from "./profile-photo-preview-button";
import { ProfilePhotoUploadButton } from "./profile-photo-upload-button";
import {
  ACCEPTED_IMAGE_TYPES,
  isAcceptedImageType,
  isWithinProfilePhotoSizeLimit,
  MAX_PROFILE_PHOTO_FILE_SIZE,
  uploadProfilePhoto,
} from "./profile-photo-upload-helpers";

export function SecondTwoRow({
  form,
}: {
  form: UseFormReturn<AddCandidatePersonalSchema>;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(form.getValues("profilePhoto"));
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const currentValue = form.getValues("profilePhoto");
    if (currentValue) {
      setPreviewUrl(currentValue);
    }
  }, [form]);

  return (
    <Controller
      control={form.control}
      name="profilePhoto"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel requiredLable>Profile</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <IconPhotoFilled className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                aria-invalid={fieldState.invalid}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    setSelectedFile(null);
                    return;
                  }

                  if (!isAcceptedImageType(file)) {
                    setSelectedFile(null);
                    form.setError("profilePhoto", {
                      type: "validate",
                      message:
                        "Please upload a valid image file (JPEG, PNG, JPG, or WebP).",
                    });
                    event.target.value = "";
                    return;
                  }

                  if (!isWithinProfilePhotoSizeLimit(file)) {
                    setSelectedFile(null);
                    form.setError("profilePhoto", {
                      type: "validate",
                      message: `File size too large. Maximum size is ${MAX_PROFILE_PHOTO_FILE_SIZE / (1024 * 1024)}MB.`,
                    });
                    event.target.value = "";
                    return;
                  }

                  form.clearErrors("profilePhoto");
                  setSelectedFile(file);
                }}
                ref={(node) => {
                  field.ref(node);
                  fileInputRef.current = node;
                }}
                type="file"
              />
              <InputGroupAddon align="inline-end">
                {previewUrl && !selectedFile ? (
                  <ProfilePhotoPreviewButton previewUrl={previewUrl} />
                ) : (
                  <ProfilePhotoUploadButton
                    hasSelectedFile={Boolean(selectedFile)}
                    isUploading={isUploading}
                    onUpload={async () => {
                      if (!selectedFile) {
                        return;
                      }

                      setIsUploading(true);

                      try {
                        const uploadedUrl =
                          await uploadProfilePhoto(selectedFile);

                        setPreviewUrl(uploadedUrl);
                        setSelectedFile(null);
                        field.onChange(uploadedUrl);
                        form.clearErrors("profilePhoto");
                        toast.success("Image uploaded", { duration: 1200 });

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      } catch (error) {
                        form.setError("profilePhoto", {
                          type: "server",
                          message:
                            error instanceof Error
                              ? error.message
                              : "Failed to upload image.",
                        });
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                )}
              </InputGroupAddon>
            </InputGroup>

            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  );
}
