import { Controller, type UseFormReturn } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { AddCandidateSchema } from "../../lib/zod-type/candidate";

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
] as const;

export function FirstTwoRow({
  form,
}: {
  form: UseFormReturn<AddCandidateSchema>;
}) {
  return (
    <>
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>Name</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                className="uppercase"
                placeholder="Enter full name"
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
            <FieldLabel requiredLable>Email</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                className="uppercase"
                placeholder="name@example.com"
                type="email"
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
            <FieldLabel requiredLable>Phone</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                className="uppercase"
                placeholder="Enter phone number"
                type="tel"
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
            <FieldLabel requiredLable>Father Name</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                className="uppercase"
                placeholder="Enter father name"
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
          <Field>
            <FieldLabel requiredLable>Aadhar No</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                className="uppercase"
                placeholder="Enter aadhar number"
                type="number"
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
                {genderOptions.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
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
              <Input {...field} aria-invalid={fieldState.invalid} type="date" />
              <FieldError errors={[fieldState.error]} />
            </FieldContent>
          </Field>
        )}
      />
    </>
  );
}
