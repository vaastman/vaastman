import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AddCandidateSchema } from "./zod-type/candidate";

interface CandidateDraftState {
  drafts: Record<string, Partial<AddCandidateSchema>>;
  setDraft: (candidateId: string, values: Partial<AddCandidateSchema>) => void;
  clearDraft: (candidateId: string) => void;
}

export const useCandidateDraftStore = create(
  persist<CandidateDraftState>(
    (set) => ({
      drafts: {},
      setDraft: (candidateId, values) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [candidateId]: {
              ...state.drafts[candidateId],
              ...values,
            },
          },
        })),
      clearDraft: (candidateId) =>
        set((state) => {
          const nextDrafts = { ...state.drafts };
          delete nextDrafts[candidateId];
          if (
            typeof window !== "undefined" &&
            Object.keys(nextDrafts).length === 0
          ) {
            try {
              localStorage.removeItem("vaastman-candidate-drafts");
            } catch {
              // Ignore storage errors in private mode
            }
          }
          return { drafts: nextDrafts };
        }),
    }),
    {
      name: "vaastman-candidate-drafts",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
