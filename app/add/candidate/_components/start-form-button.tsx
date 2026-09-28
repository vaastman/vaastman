"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { CandidateLoadingScreen } from "./candidate-loading-screen";

export function StartFormButton() {
  const { pending } = useFormStatus();

  return (
    <>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? (
          <>
            <IconLoader2 className="size-5 animate-spin" aria-hidden="true" />
            Opening form...
          </>
        ) : (
          "Start form"
        )}
      </Button>
      {pending && (
        <div className="fixed inset-0 z-50 bg-background">
          <CandidateLoadingScreen />
        </div>
      )}
    </>
  );
}
