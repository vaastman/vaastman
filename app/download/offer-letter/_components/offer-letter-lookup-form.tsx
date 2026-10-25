"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCalendarFilled,
  IconFingerprint,
  IconSearch,
} from "@tabler/icons-react";
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
import type { OfferLetterData } from "../lib/actions";
import {
  type LookupOfferLetterSchema,
  lookupOfferLetterSchema,
} from "../lib/zod-type/lookup-offer-letter";

type OfferLetterLookupFormProps = {
  onSuccess: (data: OfferLetterData) => void;
  onError: (message: string) => void;
  lookupAction: (
    payload: LookupOfferLetterSchema,
  ) => Promise<{ success: boolean; message?: string; data?: OfferLetterData }>;
};

export function OfferLetterLookupForm({
  onSuccess,
  onError,
  lookupAction,
}: OfferLetterLookupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LookupOfferLetterSchema>({
    resolver: zodResolver(lookupOfferLetterSchema),
    defaultValues: {
      aadharNo: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (values: LookupOfferLetterSchema) => {
    setIsSubmitting(true);
    try {
      const res = await lookupAction(values);
      if (res.success && res.data) {
        onSuccess(res.data);
      } else {
        onError(res.message ?? "No matching candidate record found.");
      }
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "An error occurred while verifying your details.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-md border-border/80">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">
          Verify Your Identity
        </CardTitle>
        <CardDescription>
          Enter your 12-digit Aadhar Number and Date of Birth to access your
          offer letter.
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
                      // Allow digits and automatically format with spaces
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
            className="w-full text-base font-semibold h-11"
          >
            <LoadingSwap isLoading={isSubmitting}>
              <div className="flex items-center justify-center gap-2">
                <IconSearch className="size-5 shrink-0" />
                <span>Find & Download Offer Letter</span>
              </div>
            </LoadingSwap>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
