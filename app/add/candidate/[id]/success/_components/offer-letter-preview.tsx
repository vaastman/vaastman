"use client";

import { IconDownload } from "@tabler/icons-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import type { OfferLetterData } from "../lib/actions";
import { OfferLetter } from "./offer-letter";

type OfferLetterPreviewProps = {
  data: OfferLetterData;
};

/** Pixel sizes for rendering */
const LETTER_PX = { w: 794, h: 1123 };

/** Scale factor for the visible preview */
const PREVIEW_SCALE = 0.65;

export function OfferLetterPreview({ data }: OfferLetterPreviewProps) {
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
              if (img.complete && img.naturalWidth > 0) return Promise.resolve();
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
      {/* Download / Print button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => handlePrint()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <IconDownload className="size-5" />
          Download Offer Letter
        </button>
      </div>

      {/* Visible Preview */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Internship Acceptance Letter
        </h3>
        <div
          style={{
            width: `${Math.ceil(LETTER_PX.w * PREVIEW_SCALE)}px`,
            height: `${Math.ceil(LETTER_PX.h * PREVIEW_SCALE)}px`,
            overflow: "hidden",
            margin: "0 auto",
          }}
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

      {/* Off-screen unscaled container for react-to-print */}
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
