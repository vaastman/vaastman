"use client";

import {
  IconBookmarkFilled,
  IconCalendarFilled,
  IconCategoryFilled,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { CollegeOption } from "../lib/zod-type/filter-students";

interface FilterControlsProps {
  colleges: CollegeOption[];
  selectedCollegeId: string;
  selectedDomain: string;
  selectedSessionId: string;
  onCollegeChange: (collegeId: string) => void;
  onDomainChange: (domain: string) => void;
  onSessionChange: (sessionId: string) => void;
  onReset: () => void;
}

export function FilterControls({
  colleges,
  selectedCollegeId,
  selectedDomain,
  selectedSessionId,
  onCollegeChange,
  onDomainChange,
  onSessionChange,
  onReset,
}: FilterControlsProps) {
  const currentCollege = colleges.find((c) => c.id === selectedCollegeId);
  const domains = currentCollege?.domains ?? [];
  const sessions = currentCollege?.sessions ?? [];

  const hasFilterActive = Boolean(
    selectedCollegeId || selectedDomain || selectedSessionId,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">
            Filter Students
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Select a college, domain, and optional session to view registered
            students.
          </p>
        </div>
        {hasFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <IconRotateClockwise className="size-5" />
            Reset Filters
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {/* College Selector */}
          <Field>
            <FieldLabel
              requiredLable
              className="flex items-center gap-1.5 text-xs font-medium"
            >
              <IconBookmarkFilled className="size-5 text-primary" />
              <span>College</span>
            </FieldLabel>
            <FieldContent>
              <NativeSelect
                value={selectedCollegeId}
                onChange={(e) => onCollegeChange(e.target.value)}
                className="w-full"
              >
                <NativeSelectOption value="">
                  Select a college...
                </NativeSelectOption>
                {colleges.map((college) => (
                  <NativeSelectOption key={college.id} value={college.id}>
                    {college.name} {college.code ? `[${college.code}]` : ""}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FieldContent>
          </Field>

          {/* Domain Selector */}
          <Field>
            <FieldLabel
              requiredLable
              className="flex items-center gap-1.5 text-xs font-medium"
            >
              <IconCategoryFilled className="size-5 text-primary" />
              <span>Domain</span>
            </FieldLabel>
            <FieldContent>
              <NativeSelect
                value={selectedDomain}
                onChange={(e) => onDomainChange(e.target.value)}
                disabled={!selectedCollegeId}
                className="w-full"
              >
                <NativeSelectOption value="">
                  {!selectedCollegeId
                    ? "Select college first"
                    : "Select domain..."}
                </NativeSelectOption>
                {domains.map((domain) => (
                  <NativeSelectOption key={domain} value={domain}>
                    {domain}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FieldContent>
          </Field>

          {/* Session Selector (Optional) */}
          <Field>
            <FieldLabel className="flex items-center gap-1.5 text-xs font-medium">
              <IconCalendarFilled className="size-5 text-muted-foreground" />
              <span>Session (Optional)</span>
            </FieldLabel>
            <FieldContent>
              <NativeSelect
                value={selectedSessionId}
                onChange={(e) => onSessionChange(e.target.value)}
                disabled={!selectedCollegeId}
                className="w-full"
              >
                <NativeSelectOption value="">
                  {!selectedCollegeId ? "Select college first" : "All Sessions"}
                </NativeSelectOption>
                {sessions.map((session) => (
                  <NativeSelectOption key={session.id} value={session.id}>
                    {session.name}{" "}
                    {session.duration ? `(${session.duration})` : ""}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FieldContent>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}
