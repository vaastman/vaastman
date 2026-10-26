import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addCandidateAction } from "../lib/actions";
import { useCandidateDraftStore } from "../lib/use-candidate-draft-store";
import type { AddCandidateSchema } from "../lib/zod-type/candidate";

export function useAddCandidate({
  candidateId,
  isEditMode,
}: {
  candidateId: string;
  isEditMode?: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCandidateSchema) => {
      const res = await addCandidateAction(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      useCandidateDraftStore.getState().clearDraft(candidateId);
      queryClient.invalidateQueries({
        queryKey: ["candidate-personal", candidateId],
      });
      queryClient.invalidateQueries({
        queryKey: ["candidate-education", candidateId],
      });
      queryClient.invalidateQueries({
        queryKey: ["candidate-progress", candidateId],
      });
      toast.success(
        isEditMode
          ? "Candidate details updated successfully."
          : "Candidate details saved successfully.",
      );
      router.push(`/add/candidate/${candidateId}/success`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
