import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addCandidateEducationAction } from "../lib/actions";
import type { AddCandidateEducationSchema } from "../lib/zod-type/candidate-education";

export function useAddCandidateEducation({
  candidateId,
}: {
  candidateId: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCandidateEducationSchema) => {
      const res = await addCandidateEducationAction(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["candidate-education", candidateId],
      });
      toast.success("Education details saved.");
      router.push(`/add/candidate/${candidateId}/success`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
