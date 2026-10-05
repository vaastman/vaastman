import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCandidateAction } from "../lib/actions";

export function useDeleteCandidate(collegeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidateId: string) => {
      const res = await deleteCandidateAction({ candidateId, collegeId });
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
      toast.success("Candidate deleted successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete candidate.");
    },
  });
}
