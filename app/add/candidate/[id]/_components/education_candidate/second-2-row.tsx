import { useEffect } from "react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import type { AddCandidateSchema } from "@/app/add/candidate/[id]/lib/zod-type/candidate";
import { useGetUniversityOptions } from "@/app/add/candidate/[id]/query/use-get-college-options";
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

export function SecondTwoRow({
  form,
}: {
  form: UseFormReturn<AddCandidateSchema>;
}) {
  const { data: universityOptions = [] } = useGetUniversityOptions();
  const selectedUniversityId = useWatch({
    control: form.control,
    name: "universityId",
  });
  const selectedCollegeId = useWatch({
    control: form.control,
    name: "collegeId",
  });
  const selectedCollegeSessionId = useWatch({
    control: form.control,
    name: "collegeSessionId",
  });

  const selectedUniversity = universityOptions.find(
    (u) => u.id === selectedUniversityId,
  );

  const collegeOptions = selectedUniversity?.colleges ?? [];

  const selectedCollege = collegeOptions.find(
    (college) => college.id === selectedCollegeId,
  );

  const selectedSession = selectedCollege?.sessions.find(
    (session) => session.id === selectedCollegeSessionId,
  );

  useEffect(() => {
    if (
      selectedUniversity &&
      selectedCollegeId &&
      !selectedUniversity.colleges.some(
        (college) => college.id === selectedCollegeId,
      )
    ) {
      form.setValue("collegeId", "");
    }

    if (
      selectedCollege &&
      selectedCollegeSessionId &&
      !selectedCollege.sessions.some(
        (session) => session.id === selectedCollegeSessionId,
      )
    ) {
      form.setValue("collegeSessionId", "");
    }

    const currentDomain = form.getValues("domainOrMainSubject");
    if (
      selectedCollege &&
      currentDomain &&
      !selectedCollege.domains.some((domain) => domain.name === currentDomain)
    ) {
      form.setValue("domainOrMainSubject", "");
    }

    form.setValue("duration", selectedSession?.duration ?? "");
  }, [
    selectedUniversity,
    selectedCollegeId,
    selectedCollege,
    selectedCollegeSessionId,
    selectedSession,
    form.setValue,
    form.getValues,
  ]);

  return (
    <>
      <Controller
        control={form.control}
        name="universityId"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>University Name</FieldLabel>
            <FieldContent>
              <NativeSelect
                className="w-full"
                {...field}
                aria-invalid={fieldState.invalid}
              >
                <NativeSelectOption value="">
                  Select University Name
                </NativeSelectOption>
                {universityOptions.map((university) => (
                  <NativeSelectOption key={university.id} value={university.id}>
                    {university.name.replace("_", " ")}
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
        name="collegeId"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>College Name</FieldLabel>
            <FieldContent>
              <NativeSelect
                className="w-full"
                {...field}
                aria-invalid={fieldState.invalid}
              >
                <NativeSelectOption value="">
                  Select college name
                </NativeSelectOption>
                {collegeOptions.map((college) => (
                  <NativeSelectOption key={college.id} value={college.id}>
                    {college.name}
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
        name="collegeSessionId"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>Session</FieldLabel>
            <FieldContent>
              <NativeSelect
                className="w-full"
                {...field}
                aria-invalid={fieldState.invalid}
                disabled={
                  !selectedCollege || selectedCollege.sessions.length === 0
                }
              >
                <NativeSelectOption value="">Select session</NativeSelectOption>
                {selectedCollege?.sessions.map((session) => (
                  <NativeSelectOption key={session.id} value={session.id}>
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
        name="duration"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>Duration</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                disabled
                aria-invalid={fieldState.invalid}
                value={selectedSession?.duration ?? ""}
              />
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
            <FieldLabel requiredLable>Domain/Main Subject</FieldLabel>
            <FieldContent>
              <NativeSelect
                className="w-full"
                {...field}
                aria-invalid={fieldState.invalid}
                disabled={
                  !selectedCollege || selectedCollege.domains.length === 0
                }
              >
                <NativeSelectOption value="">
                  Select domain or main subject
                </NativeSelectOption>
                {selectedCollege?.domains.map((domain) => (
                  <NativeSelectOption key={domain.id} value={domain.name}>
                    {domain.name}
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
