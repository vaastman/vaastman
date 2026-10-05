"use client";

import { IconIdFilled, IconLoader2 } from "@tabler/icons-react";
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
import { AadharPhotoPreviewButton } from "./aadhar-photo-preview-button";
import {
  ACCEPTED_IMAGE_TYPES,
  isAcceptedImageType,
  isWithinProfilePhotoSizeLimit,
  MAX_PROFILE_PHOTO_FILE_SIZE,
  uploadProfilePhoto,
} from "./profile-photo-upload-helpers";

export function AadharUploadRow({
  form,
}: {
  form: UseFormReturn<AddCandidatePersonalSchema>;
}) {
  const [previewUrl, setPreviewUrl] = useState(form.getValues("aadharPhoto"));
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const watchedPhoto = form.watch("aadharPhoto");

  useEffect(() => {
    if (watchedPhoto && !isUploading) {
      setPreviewUrl(watchedPhoto);
    }
  }, [watchedPhoto, isUploading]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: string) => void,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!isAcceptedImageType(file)) {
      form.setError("aadharPhoto", {
        type: "validate",
        message: "Please upload a valid image file (JPEG, PNG, JPG, or WebP).",
      });
      event.target.value = "";
      return;
    }

    if (!isWithinProfilePhotoSizeLimit(file)) {
      form.setError("aadharPhoto", {
        type: "validate",
        message: `File size too large. Maximum size is ${MAX_PROFILE_PHOTO_FILE_SIZE / (1024 * 1024)}MB.`,
      });
      event.target.value = "";
      return;
    }

    form.clearErrors("aadharPhoto");

    // Instant local preview for immediate visual confirmation
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadProfilePhoto(file, "aadhar");
      setPreviewUrl(uploadedUrl);
      fieldOnChange(uploadedUrl);
      form.setValue("aadharPhoto", uploadedUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Aadhar photo uploaded!");
    } catch (error) {
      setPreviewUrl(form.getValues("aadharPhoto") || "");
      form.setError("aadharPhoto", {
        type: "server",
        message:
          error instanceof Error ? error.message : "Failed to upload image.",
      });
      toast.error("Failed to upload image. Please try again.");
    } finally {
      URL.revokeObjectURL(localUrl);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Controller
      control={form.control}
      name="aadharPhoto"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel requiredLable>Aadhar</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <IconIdFilled className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                aria-invalid={fieldState.invalid}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => handleFileChange(event, field.onChange)}
                ref={(node) => {
                  field.ref(node);
                  fileInputRef.current = node;
                }}
                type="file"
              />
              <InputGroupAddon align="inline-end">
                {isUploading ? (
                  <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground">
                    <IconLoader2 className="size-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : previewUrl ? (
                  <AadharPhotoPreviewButton previewUrl={previewUrl} />
                ) : null}
              </InputGroupAddon>
            </InputGroup>

            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  );
}
