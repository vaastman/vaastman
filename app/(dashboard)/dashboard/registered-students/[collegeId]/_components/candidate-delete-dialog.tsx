"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import type { RegisteredStudentRow } from "../lib/actions";
import { useDeleteCandidate } from "../query/mut-delete-candidate";

type CandidateDeleteDialogProps = {
  candidate: RegisteredStudentRow;
  collegeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CandidateDeleteDialog({
  candidate,
  collegeId,
  open,
  onOpenChange,
}: CandidateDeleteDialogProps) {
  const { mutateAsync: deleteCandidate, isPending } =
    useDeleteCandidate(collegeId);

  const handleDelete = async () => {
    try {
      await deleteCandidate(candidate.candidateId);
      onOpenChange(false);
    } catch {
      // Error handled by mutation hook's toast
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{candidate.name}</strong>?
            </span>
            <span className="block text-xs text-muted-foreground">
              This action cannot be undone. All related personal details,
              educational records, and payment history will be removed.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            <LoadingSwap isLoading={isPending}>Delete Candidate</LoadingSwap>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
