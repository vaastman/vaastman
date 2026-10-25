"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowRight,
  IconCalendarFilled,
  IconFingerprint,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  type CandidateVerificationResult,
  verifyCandidateForUpdate,
} from "../lib/actions";
import {
  type VerifyCandidateSchema,
  verifyCandidateSchema,
} from "../lib/zod-type/verify-candidate";

type VerifyCandidateFormProps = {
  onError: (message: string) => void;
  onSuccess?: (result: CandidateVerificationResult) => void;
};

export function VerifyCandidateForm({
  onError,
  onSuccess,
}: VerifyCandidateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerifyCandidateSchema>({
    resolver: zodResolver(verifyCandidateSchema),
    defaultValues: {
      aadharNo: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (values: VerifyCandidateSchema) => {
    setIsSubmitting(true);
    try {
      const res = await verifyCandidateForUpdate(values);
      if (res.success && res.data) {
        if (onSuccess) {
          onSuccess(res.data);
        }
        // Redirect to form in edit mode
        router.push(`/add/candidate/${res.data.candidateId}?mode=edit`);
      } else {
        onError(res.message ?? "No matching candidate record found.");
      }
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "An error occurred during verification. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-md border-border/80">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">
          Verify Candidate Identity
        </CardTitle>
        <CardDescription>
          Enter your registered Aadhar Number and Date of Birth to update your
          information.
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Aadhar Number */}
          <Controller
            control={form.control}
            name="aadharNo"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel requiredLable>
                  <span className="inline-flex items-center gap-1.5">
                    <IconFingerprint className="size-4 text-primary shrink-0" />
                    <span>Aadhar Number</span>
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    maxLength={14}
                    placeholder="1234 5678 9012"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      const raw = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 12);
                      const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
                      field.onChange(formatted);
                    }}
                    className="font-mono tracking-wider text-base h-11"
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          {/* Date of Birth */}
          <Controller
            control={form.control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel requiredLable>
                  <span className="inline-flex items-center gap-1.5">
                    <IconCalendarFilled className="size-4 text-primary shrink-0" />
                    <span>Date of Birth</span>
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="date"
                    aria-invalid={fieldState.invalid}
                    className="w-full h-11"
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full text-base font-semibold cursor-pointer h-11"
          >
            <LoadingSwap isLoading={isSubmitting}>
              <div className="flex items-center justify-center gap-2">
                <span>Verify & Update Details</span>
                <IconArrowRight className="size-5 shrink-0" />
              </div>
            </LoadingSwap>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
