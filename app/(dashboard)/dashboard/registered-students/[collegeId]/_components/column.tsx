"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { useGetRegisteredStudents } from "@/app/(dashboard)/dashboard/registered-students/[collegeId]/query/use-get-registered-students";
import { CandidateActions } from "./candidate-actions";
import { CandidateCell } from "./candidate-cell";
import { PaymentStatusBadge } from "./payment-status-badge";

export type RegisteredStudentsRow = NonNullable<
  ReturnType<typeof useGetRegisteredStudents>["data"]
>["sessions"][number]["candidates"][number];

export const columns: ColumnDef<RegisteredStudentsRow>[] = [
  {
    id: "candidate",
    header: "Candidate Name",
    cell: ({ row }) => (
      <CandidateCell
        name={row.original.name}
        profilePhoto={row.original.profilePhoto}
        universityRoll={row.original.universityRoll}
        collegeRoll={row.original.collegeRoll}
      />
    ),
  },
  {
    accessorKey: "domainOrMainSubject",
    header: "Domain",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "collegeFee",
    header: "Fee",
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => (
      <PaymentStatusBadge status={row.original.paymentStatus} />
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <CandidateActions candidate={row.original} />,
  },
];
