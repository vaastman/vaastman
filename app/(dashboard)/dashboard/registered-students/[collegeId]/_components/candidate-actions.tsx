"use client";

import {
  IconDotsVertical,
  IconEyeFilled,
  IconPencil,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RegisteredStudentRow } from "../lib/actions";
import { CandidateDeleteDialog } from "./candidate-delete-dialog";
import { CandidateDetailsDialog } from "./candidate-details-dialog";
import { CandidateEditDialog } from "./candidate-edit-dialog";
import { useRegisteredStudentsContext } from "./registered-students-context";

type CandidateActionsProps = {
  candidate: RegisteredStudentRow;
};

export function CandidateActions({ candidate }: CandidateActionsProps) {
  const { collegeId } = useRegisteredStudentsContext();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs font-medium"
          onClick={() => setDetailsOpen(true)}
        >
          <IconEyeFilled className="size-4" />
          <span>Details</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="More actions"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => setDetailsOpen(true)}
            >
              <IconEyeFilled className="size-4" />
              <span>Full Details</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => setEditOpen(true)}
            >
              <IconPencil className="size-4" />
              <span>Edit Candidate</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
              onClick={() => setDeleteOpen(true)}
            >
              <IconTrashFilled className="size-4" />
              <span>Delete Candidate</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Details Dialog */}
      <CandidateDetailsDialog
        candidate={candidate}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEditClick={() => setEditOpen(true)}
        onDeleteClick={() => setDeleteOpen(true)}
      />

      {/* Edit Dialog */}
      <CandidateEditDialog
        candidate={candidate}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Delete Confirmation Dialog */}
      <CandidateDeleteDialog
        candidate={candidate}
        collegeId={collegeId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
