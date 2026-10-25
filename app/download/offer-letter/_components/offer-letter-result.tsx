"use client";

import {
  IconArrowLeft,
  IconDownload,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { OfferLetter } from "@/app/add/candidate/[id]/success/_components/offer-letter";
import { Button } from "@/components/ui/button";
import type { OfferLetterData } from "../lib/actions";

type OfferLetterResultProps = {
  data: OfferLetterData;
  onBack: () => void;
};

const LETTER_PX = { w: 794, h: 1123 };
const PREVIEW_SCALE = 0.65;

export function OfferLetterResult({ data, onBack }: OfferLetterResultProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Offer_Letter_${data.candidateName.replace(/\s+/g, "_")}`,
    onBeforePrint: async () => {
      if (typeof window !== "undefined") {
        if ("fonts" in document) {
          await document.fonts.ready;
        }
        const images = printRef.current?.querySelectorAll("img");
        if (images) {
          await Promise.all(
            Array.from(images).map((img) => {
              if (img.complete && img.naturalWidth > 0)
                return Promise.resolve();
              return new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              });
            }),
          );
        }
      }
    },
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="gap-2 self-start sm:self-auto cursor-pointer"
        >
          <IconArrowLeft className="size-5" />
          Look Up Another Candidate
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => handlePrint()}
            size="lg"
            className="gap-2 px-6 shadow-sm cursor-pointer"
          >
            <IconDownload className="size-5" />
            Download / Print Offer Letter
          </Button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
        <IconRosetteDiscountCheckFilled className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-sm space-y-0.5">
          <p className="font-semibold">
            Offer Letter Verified: {data.candidateName}
          </p>
          <p className="text-xs text-muted-foreground">
            Roll No:{" "}
            <span className="font-mono font-medium text-foreground">
              {data.universityRoll}
            </span>{" "}
            • College:{" "}
            <span className="font-medium text-foreground">
              {data.collegeName}
            </span>
          </p>
        </div>
      </div>

      {/* Visible scaled preview */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
          Official Internship Acceptance Letter Preview
        </h3>
        <div
          style={{
            width: `${Math.ceil(LETTER_PX.w * PREVIEW_SCALE)}px`,
            height: `${Math.ceil(LETTER_PX.h * PREVIEW_SCALE)}px`,
            overflow: "hidden",
            margin: "0 auto",
          }}
          className="rounded-lg shadow-sm"
        >
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE})`,
              transformOrigin: "top left",
              width: `${LETTER_PX.w}px`,
              height: `${LETTER_PX.h}px`,
            }}
          >
            <OfferLetter data={data} />
          </div>
        </div>
      </div>

      {/* Off-screen unscaled container for printing */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: "0",
          width: `${LETTER_PX.w}px`,
          height: `${LETTER_PX.h}px`,
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <div ref={printRef}>
          <OfferLetter data={data} />
        </div>
      </div>
    </div>
  );
}
