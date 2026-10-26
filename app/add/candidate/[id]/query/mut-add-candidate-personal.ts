import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addCandidatePersonalAction } from "../lib/actions";
import { useCandidateDraftStore } from "../lib/use-candidate-draft-store";
import type { AddCandidatePersonalSchema } from "../lib/zod-type/candidate-personal";

export function useAddCandidatePersonal({
  candidateId,
  isEditMode,
}: {
  candidateId: string;
  isEditMode?: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCandidatePersonalSchema) => {
      const res = await addCandidatePersonalAction(data);
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
        queryKey: ["candidate-progress", candidateId],
      });
      toast.success(
        isEditMode
          ? "Personal details updated successfully."
          : "Personal details saved.",
      );
      router.push(`/add/candidate/${candidateId}/success`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
