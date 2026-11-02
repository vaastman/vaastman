"use client";

import { useQuery } from "@tanstack/react-query";
import { getFilteredStudents } from "../lib/actions";
import type { FilterStudentsInput } from "../lib/zod-type/filter-students";

export const useGetFilteredStudents = (input: FilterStudentsInput) => {
  const { collegeId, domain, sessionId } = input;

  return useQuery({
    queryKey: [
      "filtered-students",
      collegeId,
      domain ?? "ALL",
      sessionId ?? "ALL",
    ],
    queryFn: async () => {
      const res = await getFilteredStudents(input);

      if (!res.success) {
        throw new Error(res.message ?? "Failed to fetch filtered students");
      }

      return res.data;
    },
    enabled: Boolean(collegeId && domain),
    retry: false,
  });
};
