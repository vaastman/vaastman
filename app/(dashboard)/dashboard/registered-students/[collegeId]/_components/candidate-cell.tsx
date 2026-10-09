"use client";

import { IconInfoCircleFilled } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CandidateCellProps = {
  name: string;
  profilePhoto?: string | null;
  universityRoll: string;
  collegeRoll: string;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CandidateCell({
  name,
  profilePhoto,
  universityRoll,
  collegeRoll,
}: CandidateCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={profilePhoto ?? ""} alt={name} />
        <AvatarFallback>{getInitials(name) || "NA"}</AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        {universityRoll && universityRoll !== "—" ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="truncate">#{universityRoll}</span>
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center"
                    aria-label="University roll number info"
                  >
                    <IconInfoCircleFilled className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  University roll number
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {collegeRoll && collegeRoll !== "—" && (
              <>
                <span className="truncate ml-2">#{collegeRoll}</span>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center"
                        aria-label="College roll number info"
                      >
                        <IconInfoCircleFilled className="size-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      College roll number
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No roll numbers
          </p>
        )}
      </div>
    </div>
  );
}
