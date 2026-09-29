"use client";

import { Button } from "@/components/ui/button";

export function StartFormButton() {
  return (
    <Button
      type="button"
      size="lg"
      onClick={() =>
        window.alert("The candidate registration portal has not opened yet.")
      }
    >
      Start form
    </Button>
  );
}
