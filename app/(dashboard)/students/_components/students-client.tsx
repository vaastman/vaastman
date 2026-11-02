"use client";

import { IconInfoCircleFilled, IconSchoolFilled } from "@tabler/icons-react";
import { useState } from "react";
import { ErrorDisplay } from "@/components/error-display";
import { LoaderScreen } from "@/components/loader-screen";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { FilteredStudentRow } from "../lib/zod-type/filter-students";
import { useGetFilterOptions } from "../query/use-get-filter-options";
import { useGetFilteredStudents } from "../query/use-get-filtered-students";
import { FilterControls } from "./filter-controls";
import { StudentDataTable } from "./student-data-table";
import { StudentDetailsModal } from "./student-details-modal";
import { StudentSummaryCards } from "./student-summary-cards";

export function StudentsClient() {
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<FilteredStudentRow | null>(null);

  const {
    data: filterOptions,
    isPending: isOptionsPending,
    error: optionsError,
  } = useGetFilterOptions();

  const isFilterReady = Boolean(selectedCollegeId && selectedDomain);

  const {
    data: studentData,
    isPending: isStudentsPending,
    error: studentsError,
  } = useGetFilteredStudents({
    collegeId: selectedCollegeId,
    domain: selectedDomain,
    sessionId: selectedSessionId || undefined,
  });

  const handleCollegeChange = (newCollegeId: string) => {
    setSelectedCollegeId(newCollegeId);
    setSelectedDomain("");
    setSelectedSessionId("");
  };

  const handleDomainChange = (newDomain: string) => {
    setSelectedDomain(newDomain);
  };

  const handleSessionChange = (newSessionId: string) => {
    setSelectedSessionId(newSessionId);
  };

  const handleReset = () => {
    setSelectedCollegeId("");
    setSelectedDomain("");
    setSelectedSessionId("");
  };

  if (isOptionsPending) {
    return <LoaderScreen message="Loading filter options..." />;
  }

  if (optionsError) {
    return (
      <ErrorDisplay
        message={optionsError.message}
        redirectPath="/dashboard"
        buttonText="Back to Dashboard"
        refreshButton
      />
    );
  }

  const colleges = filterOptions?.colleges ?? [];

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <FilterControls
        colleges={colleges}
        selectedCollegeId={selectedCollegeId}
        selectedDomain={selectedDomain}
        selectedSessionId={selectedSessionId}
        onCollegeChange={handleCollegeChange}
        onDomainChange={handleDomainChange}
        onSessionChange={handleSessionChange}
        onReset={handleReset}
      />

      {/* When filters not selected yet */}
      {!isFilterReady && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary mb-3">
              <IconSchoolFilled className="size-8" />
            </div>
            <h3 className="text-base font-semibold">
              Select College and Domain
            </h3>
            <p className="max-w-md text-xs text-muted-foreground mt-1">
              {!selectedCollegeId
                ? "Choose a college above to start. Its associated domains and sessions will be loaded automatically."
                : "Now select a domain from the dropdown above to display the registered students."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading state for students */}
      {isFilterReady && isStudentsPending && (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner className="size-8 text-primary mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            Fetching registered students...
          </p>
        </div>
      )}

      {/* Error state for students */}
      {isFilterReady && studentsError && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-4 text-destructive">
            <IconInfoCircleFilled className="size-5 shrink-0" />
            <p className="text-sm">{studentsError.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Data display when ready */}
      {isFilterReady && studentData && !isStudentsPending && (
        <div className="space-y-6">
          <StudentSummaryCards summary={studentData.summary} />
          <StudentDataTable
            students={studentData.students}
            collegeName={studentData.summary.collegeName}
            domain={studentData.summary.domain}
            sessionName={studentData.summary.sessionName}
            onViewStudent={setSelectedStudent}
          />
        </div>
      )}

      {/* Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        open={Boolean(selectedStudent)}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      />
    </div>
  );
}
