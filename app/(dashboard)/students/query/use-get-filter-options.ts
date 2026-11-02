"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentFilterOptions } from "../lib/actions";

export const useGetFilterOptions = () => {
  return useQuery({
    queryKey: ["student-filter-options"],
    queryFn: async () => {
      const res = await getStudentFilterOptions();

      if (!res.success) {
        throw new Error(res.message ?? "Failed to load filter options");
      }

      return res.data;
    },
    retry: false,
  });
};
