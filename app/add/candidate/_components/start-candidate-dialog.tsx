"use client";

import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
} from "@tabler/icons-react";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { startCandidateRegistration } from "../lib/actions";

export function StartCandidateDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleProceed = () => {
    startTransition(async () => {
      await startCandidateRegistration();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg">Start form</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="data-[size=default]:sm:max-w-lg sm:max-w-lg">
        <AlertDialogHeader className="text-left sm:text-left">
          <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
            <IconAlertTriangleFilled className="size-5 shrink-0 text-amber-500" />
            <span>महत्वपूर्ण सूचना / Important Notice</span>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-2 text-foreground">
              {/* Hindi Notice - On Top */}
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 dark:border-amber-500/20 dark:bg-amber-500/15">
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <IconAlertCircleFilled className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>हिंदी (Hindi)</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  कृपया ध्यान दें कि आपके द्वारा इस फॉर्म में भरी जाने वाली जानकारी ही आपके{" "}
                  <strong className="font-semibold text-foreground">
                    ऑफर लेटर (Offer Letter)
                  </strong>{" "}
                  और{" "}
                  <strong className="font-semibold text-foreground">
                    सर्टिफिकेट (Certificate)
                  </strong>{" "}
                  पर दिखाई देगी। इसलिए कृपया इस फॉर्म को अत्यंत सावधानीपूर्वक और
                  सही-सही भरें।
                </p>
              </div>

              {/* English Notice - Below Hindi */}
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <IconAlertCircleFilled className="size-5 shrink-0 text-muted-foreground" />
                  <span>English</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Please note that the information you are going to fill will be
                  displayed on your{" "}
                  <strong className="font-semibold text-foreground">
                    Offer Letter
                  </strong>{" "}
                  and{" "}
                  <strong className="font-semibold text-foreground">
                    Certificate
                  </strong>
                  . Therefore, you must fill this form carefully and accurately.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={isPending}>
            रद्द करें / Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleProceed}
            className="min-w-32"
          >
            <LoadingSwap isLoading={isPending}>आगे बढ़ें / Proceed</LoadingSwap>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
