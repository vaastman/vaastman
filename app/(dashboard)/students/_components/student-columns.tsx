"use client";

import { IconEyeFilled } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FilteredStudentRow } from "../lib/zod-type/filter-students";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getStudentColumns({
  onViewStudent,
}: {
  onViewStudent: (student: FilteredStudentRow) => void;
}): ColumnDef<FilteredStudentRow>[] {
  return [
    {
      id: "student",
      header: "Student",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border">
              <AvatarImage
                src={s.profilePhoto}
                alt={s.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-semibold">
                {getInitials(s.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "aadharNo",
      header: "Aadhar No",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">
          {row.original.aadharNo}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <span className="text-xs">{row.original.phone}</span>,
    },
    {
      accessorKey: "universityRoll",
      header: "University Roll",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">
          {row.original.universityRoll || "—"}
        </span>
      ),
    },
    {
      accessorKey: "collegeRoll",
      header: "College Roll",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">
          {row.original.collegeRoll || "—"}
        </span>
      ),
    },
    {
      accessorKey: "sessionName",
      header: "Session",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-normal">
          {row.original.sessionName}
        </Badge>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.original.paymentStatus;
        return (
          <Badge
            variant={status === "VERIFIED" ? "default" : "secondary"}
            className="text-[11px]"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewStudent(row.original)}
              className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <IconEyeFilled className="size-5" />
              <span>Details</span>
            </Button>
          </div>
        );
      },
    },
  ];
}
