import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCandidateAction } from "../lib/actions";
import type { UpdateCandidateSchema } from "../lib/zod-type/update-candidate";

export function useUpdateCandidate(collegeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCandidateSchema) => {
      const res = await updateCandidateAction(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registered-students", collegeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
      });
      toast.success("Candidate details updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update candidate.");
    },
  });
}
