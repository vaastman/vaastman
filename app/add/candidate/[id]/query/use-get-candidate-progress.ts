import { useQuery } from "@tanstack/react-query";
import { getCandidateProgress } from "../lib/actions";

export function useGetCandidateProgress({
  candidateId,
}: {
  candidateId: string;
}) {
  return useQuery({
    queryKey: ["candidate-progress", candidateId],
    queryFn: async () => {
      const res = await getCandidateProgress(candidateId);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
    retry: false,
  });
}
