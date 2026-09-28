import { IconLoader2 } from "@tabler/icons-react";

export function CandidateLoadingScreen() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <output className="flex flex-col items-center gap-3 text-muted-foreground">
        <IconLoader2 className="size-5 animate-spin" aria-hidden="true" />
        <p>Opening candidate form...</p>
      </output>
    </div>
  );
}
