"use client";

import {
  IconCheckupList,
  IconClockFilled,
  IconSchoolFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentFilterSummary } from "../lib/zod-type/filter-students";

export function StudentSummaryCards({
  summary,
}: {
  summary: StudentFilterSummary;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Students Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Students
          </CardTitle>
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <IconUserFilled className="size-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">{summary.totalStudents}</div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="secondary" className="gap-1 font-normal">
              <span>Male:</span>
              <span className="font-semibold">{summary.maleCount}</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 font-normal">
              <span>Female:</span>
              <span className="font-semibold">{summary.femaleCount}</span>
            </Badge>
            {summary.otherGenderCount > 0 && (
              <Badge variant="secondary" className="gap-1 font-normal">
                <span>Other:</span>
                <span className="font-semibold">
                  {summary.otherGenderCount}
                </span>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Payment Status
          </CardTitle>
          <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <IconCheckupList className="size-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {summary.verifiedPaymentCount}
            </span>
            <span className="text-xs text-muted-foreground">Verified</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="gap-1 font-normal">
              <IconClockFilled className="size-5 text-amber-500" />
              <span>Pending / Other:</span>
              <span className="font-semibold">
                {summary.pendingPaymentCount}
              </span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* College & Academic Context Card */}
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Selection Context
          </CardTitle>
          <div className="rounded-full bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <IconSchoolFilled className="size-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5 text-xs">
          <div className="truncate font-semibold text-foreground">
            {summary.collegeName}{" "}
            {summary.collegeCode ? `[${summary.collegeCode}]` : ""}
          </div>
          {summary.universityName && (
            <p className="truncate text-muted-foreground">
              {summary.universityName}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge variant="outline" className="font-normal">
              Domain: {summary.domain}
            </Badge>
            <Badge variant="outline" className="font-normal">
              Session: {summary.sessionName ?? "All Sessions"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
