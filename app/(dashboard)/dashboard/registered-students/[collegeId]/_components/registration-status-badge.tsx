"use client";

import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RegistrationStatusBadgeProps = {
  status: "COMPLETE" | "INCOMPLETE";
};

export function RegistrationStatusBadge({
  status,
}: RegistrationStatusBadgeProps) {
  const isComplete = status === "COMPLETE";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help">
            {isComplete ? (
              <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700 select-none dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                <IconCircleCheckFilled
                  className="size-5"
                  data-icon="inline-start"
                />
                Completed
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-amber-300 bg-amber-100/70 text-amber-800 select-none dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
              >
                <IconAlertTriangleFilled
                  className="size-5"
                  data-icon="inline-start"
                />
                Personal Only
              </Badge>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-2.5 text-xs">
          {isComplete ? (
            <div className="space-y-1 text-left">
              <p className="font-semibold text-emerald-300">
                Registration Complete
              </p>
              <p className="text-zinc-200">
                This candidate has submitted all required personal and
                educational details.
              </p>
            </div>
          ) : (
            <div className="space-y-1 text-left">
              <p className="font-semibold text-amber-300">
                Registration Incomplete
              </p>
              <p className="text-zinc-200">
                Only personal details have been submitted. Academic details
                (college, session, course, rolls) are pending.
              </p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
