"use client";

import { IconAlertTriangleFilled, IconDownload } from "@tabler/icons-react";
import { DataTable } from "@/app/(dashboard)/college/_components/data-table";
import {
  downloadIncompleteCandidatesCsv,
  downloadRegisteredStudentsSessionCsv,
} from "@/app/(dashboard)/dashboard/registered-students/[collegeId]/lib/export-session-csv";
import { useGetRegisteredStudents } from "@/app/(dashboard)/dashboard/registered-students/[collegeId]/query/use-get-registered-students";
import { BackRedirect } from "@/components/back-redirect";
import { ErrorDisplay } from "@/components/error-display";
import { LoaderScreen } from "@/components/loader-screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { columns } from "./column";
import { RegisteredStudentsProvider } from "./registered-students-context";

type RegisteredStudentsProps = {
  collegeId: string;
};

export function RegisteredStudents({ collegeId }: RegisteredStudentsProps) {
  const { data, isPending, error } = useGetRegisteredStudents(collegeId);

  if (isPending) {
    return (
      <LoaderScreen
        offsetHeight={NAVBAR_HEIGHT * 2}
        message="Getting registered students..."
      />
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error.message}
        redirectPath="/dashboard"
        buttonText="Back to Dashboard"
      />
    );
  }

  if (!data?.sessions.length) {
    return (
      <div className="mx-auto">
        <BackRedirect
          href="/dashboard"
          label="Back to Dashboard"
          method="href"
        />

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No sessions found</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            This college has no configured sessions yet.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RegisteredStudentsProvider
      value={{
        collegeId: data.college.id,
        collegeName: data.college.name,
        universityName: data.college.universityName,
        sessions: data.college.sessions,
        domains: data.college.domains,
      }}
    >
      <div className="">
        <BackRedirect
          className="mb-4"
          href="/dashboard"
          label="Back to Dashboard"
          method="href"
        />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">
              {data.college.name}{" "}
              {data.college.code ? `[${data.college.code}]` : ""}
            </h3>
            <p className="text-sm text-muted-foreground">Registered students</p>
          </div>

          {(() => {
            const pendingSession = data.sessions.find(
              (s) => s.id === "pending-education",
            );
            if (!pendingSession || !pendingSession.candidates.length)
              return null;

            return (
              <Button
                type="button"
                variant="outline"
                className="gap-2 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50"
                onClick={() =>
                  downloadIncompleteCandidatesCsv({
                    collegeName: data.college.name,
                    candidates: pendingSession.candidates,
                  })
                }
              >
                <IconAlertTriangleFilled
                  className="size-5 text-amber-600 dark:text-amber-400"
                  data-icon="inline-start"
                />
                Export Incomplete Leads ({pendingSession.candidates.length})
              </Button>
            );
          })()}
        </div>

        <Tabs defaultValue={data.sessions[0].id} className="gap-4">
          <TabsList className="h-auto w-full flex-wrap justify-start rounded-2xl p-1">
            {data.sessions.map((session) => (
              <TabsTrigger key={session.id} value={session.id} className="px-3">
                {session.name} ({session.candidates.length})
              </TabsTrigger>
            ))}
          </TabsList>

          {data.sessions.map((session) => (
            <TabsContent key={session.id} value={session.id} className="mt-0">
              <div className="mb-3 flex justify-end">
                {session.id === "pending-education" ? (
                  <Button
                    type="button"
                    className="gap-2 border-amber-500/30 bg-amber-600 text-white hover:bg-amber-700"
                    onClick={() =>
                      downloadIncompleteCandidatesCsv({
                        collegeName: data.college.name,
                        candidates: session.candidates,
                      })
                    }
                    disabled={!session.candidates.length}
                  >
                    <IconDownload className="size-5" data-icon="inline-start" />
                    Export Incomplete Leads CSV
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() =>
                      downloadRegisteredStudentsSessionCsv({
                        collegeName: data.college.name,
                        sessionName: session.name,
                        candidates: session.candidates,
                      })
                    }
                    disabled={!session.candidates.length}
                  >
                    <IconDownload className="size-5" data-icon="inline-start" />
                    Export CSV
                  </Button>
                )}
              </div>
              <DataTable columns={columns} data={session.candidates} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </RegisteredStudentsProvider>
  );
}
