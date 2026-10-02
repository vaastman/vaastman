import { Controller, type UseFormReturn, useWatch } from "react-hook-form";

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
import type { AddCandidateEducationSchema } from "../../lib/zod-type/candidate-education";
import { COURSE_OPTIONS, getMjcOptionsForCourse } from "./course-mjc-helpers";

export function FirstTwoRow({
  form,
}: {
  form: UseFormReturn<AddCandidateEducationSchema>;
}) {
  const selectedCourse = useWatch({
    control: form.control,
    name: "course",
  });

  const mjcOptions = getMjcOptionsForCourse(selectedCourse);

  return (
    <>
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
                className="uppercase"
                placeholder="Enter university roll"
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
                className="uppercase"
                placeholder="Enter college roll"
              />
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
                className="w-full"
                {...field}
                aria-invalid={fieldState.invalid}
                onChange={(e) => {
                  field.onChange(e);
                  // Reset MJC when course changes since options are linked
                  form.setValue("mjcSubject", "");
                }}
              >
                <NativeSelectOption value="">Select course</NativeSelectOption>
                {COURSE_OPTIONS.map((option) => (
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
        name="mjcSubject"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>MJC Subject</FieldLabel>
            <FieldContent>
              <NativeSelect
                className="w-full"
                {...field}
                aria-invalid={fieldState.invalid}
                disabled={!selectedCourse || mjcOptions.length === 0}
              >
                <NativeSelectOption value="">
                  {!selectedCourse
                    ? "Select a course first"
                    : mjcOptions.length === 0
                      ? "No MJC subjects available"
                      : "Select MJC subject"}
                </NativeSelectOption>
                {mjcOptions.map((option) => (
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
    </>
  );
}
