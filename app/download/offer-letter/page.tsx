"use client";

import {
  IconAlertTriangleFilled,
  IconFileTextFilled,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { OfferLetterLookupForm } from "./_components/offer-letter-lookup-form";
import { OfferLetterResult } from "./_components/offer-letter-result";
import { lookupOfferLetter, type OfferLetterData } from "./lib/actions";

export default function DownloadOfferLetterPage() {
  const [offerLetterData, setOfferLetterData] =
    useState<OfferLetterData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = (data: OfferLetterData) => {
    setOfferLetterData(data);
    setErrorMessage(null);
  };

  const handleError = (message: string) => {
    setOfferLetterData(null);
    setErrorMessage(message);
  };

  const handleBack = () => {
    setOfferLetterData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10 px-4 sm:px-6">
      {/* Brand Header */}
      <header className="max-w-5xl mx-auto mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/certificate/logo.png"
            alt="Vaastman Logo"
            width={44}
            height={44}
            className="object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <span className="font-bold text-lg text-foreground block leading-tight">
              Vaastman Solutions
            </span>
            <span className="text-xs text-muted-foreground">
              Offer Letter Download Portal
            </span>
          </div>
        </Link>

        <Link
          href="/candidate/update"
          className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Need to update your details?
        </Link>
      </header>

      <main className="max-w-5xl mx-auto">
        {offerLetterData ? (
          <OfferLetterResult data={offerLetterData} onBack={handleBack} />
        ) : (
          <div className="max-w-xl mx-auto space-y-8 pt-4">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2 shadow-xs">
                <IconFileTextFilled className="size-8" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Download Offer Letter
              </h1>

              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Enter your registered Aadhar number and Date of Birth to verify
                your identity and download your official Internship Offer
                Letter.
              </p>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                <IconAlertTriangleFilled className="size-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-destructive">
                    Verification Failed
                  </p>
                  <p className="text-xs text-destructive/90">{errorMessage}</p>
                </div>
              </div>
            )}

            <OfferLetterLookupForm
              onSuccess={handleSuccess}
              onError={handleError}
              lookupAction={lookupOfferLetter}
            />

            {/* Security Notice */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
              <IconRosetteDiscountCheckFilled className="size-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  Official Verification System
                </p>
                <p>
                  Your details are verified securely against official
                  registration records. If you recently registered, please allow
                  a few minutes for records to sync.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto mt-16 text-center text-xs text-muted-foreground border-t border-border pt-6 space-y-1">
        <p>
          © {new Date().getFullYear()} Vaastman Solutions Pvt. Ltd. All rights
          reserved.
        </p>
        <p>Official Candidate & Student Portal</p>
      </footer>
    </div>
  );
}
