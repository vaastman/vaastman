"use client";

import {
  IconCalendarFilled,
  IconCheck,
  IconCreditCardFilled,
  IconDownload,
  IconExternalLink,
  IconEyeFilled,
  IconIdFilled,
  IconMailFilled,
  IconPencil,
  IconPhoneFilled,
  IconSchoolFilled,
  IconTrashFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RegisteredStudentRow } from "../lib/actions";
import { PaymentStatusBadge } from "./payment-status-badge";

type CandidateDetailsDialogProps = {
  candidate: RegisteredStudentRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
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

export function CandidateDetailsDialog({
  candidate,
  open,
  onOpenChange,
  onEditClick,
  onDeleteClick,
}: CandidateDetailsDialogProps) {
  const [photoPreview, setPhotoPreview] = useState<{
    url: string;
    title: string;
  } | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[92vw] lg:max-w-[90vw] xl:max-w-[85vw] max-h-[92vh] overflow-y-auto p-6 sm:p-8">
          <DialogHeader className="space-y-4 pb-4 border-b">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <Avatar className="size-20 border-2 border-primary/20 shadow-md">
                  <AvatarImage
                    src={candidate.profilePhoto}
                    alt={candidate.name}
                  />
                  <AvatarFallback className="text-xl font-bold">
                    {getInitials(candidate.name) || "NA"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    {candidate.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                    <span className="font-mono font-medium text-foreground">
                      Univ. Roll: #{candidate.universityRoll}
                    </span>
                    <span>•</span>
                    <span className="font-mono font-medium text-foreground">
                      College Roll: #{candidate.collegeRoll}
                    </span>
                    <span>•</span>
                    <span>{candidate.collegeName}</span>
                  </DialogDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 font-semibold text-xs"
                >
                  {candidate.sessionName}
                </Badge>
                <PaymentStatusBadge status={candidate.paymentStatus} />
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="personal" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="personal" className="gap-2">
                <IconUserFilled className="size-4" />
                Personal Details
              </TabsTrigger>
              <TabsTrigger value="academic" className="gap-2">
                <IconSchoolFilled className="size-4" />
                Academic Details
              </TabsTrigger>
              <TabsTrigger value="payment" className="gap-2">
                <IconCreditCardFilled className="size-4" />
                Payments ({candidate.payments?.length ?? 0})
              </TabsTrigger>
            </TabsList>

            {/* PERSONAL TAB */}
            <TabsContent value="personal" className="space-y-6 pt-4">
              <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.name}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Father's Name
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.fatherName || "—"}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.gender}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.dateOfBirth || "—"}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </p>
                  <p className="text-base font-semibold text-foreground break-all">
                    {candidate.email}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.phone}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Aadhar Number
                  </p>
                  <p className="text-base font-mono font-semibold text-foreground">
                    {candidate.aadharNo}
                  </p>
                </div>
              </div>

              {/* Photos Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Uploaded Documents & Proofs
                </h4>
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Profile Photo */}
                  <div className="rounded-2xl border p-5 flex flex-col items-center gap-4 bg-card shadow-sm">
                    <div className="w-full flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Profile Photo
                      </p>
                      {candidate.profilePhoto && (
                        <Badge variant="outline" className="text-xs">
                          Uploaded
                        </Badge>
                      )}
                    </div>
                    {candidate.profilePhoto ? (
                      <div className="relative aspect-3/4 w-44 overflow-hidden rounded-xl border bg-muted shadow-sm">
                        <Image
                          src={candidate.profilePhoto}
                          alt="Profile photo"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-44 text-muted-foreground">
                        <IconUserFilled className="size-10 opacity-30 mb-2" />
                        <p className="text-sm">No photo uploaded</p>
                      </div>
                    )}
                    {candidate.profilePhoto && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5"
                        onClick={() =>
                          setPhotoPreview({
                            url: candidate.profilePhoto,
                            title: `${candidate.name} - Profile Photo`,
                          })
                        }
                      >
                        <IconEyeFilled className="size-4" />
                        View Full Size Photo
                      </Button>
                    )}
                  </div>

                  {/* Aadhar Photo */}
                  <div className="rounded-2xl border p-5 flex flex-col items-center gap-4 bg-card shadow-sm">
                    <div className="w-full flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Aadhar Document Proof
                      </p>
                      {candidate.aadharPhoto ? (
                        <Badge variant="outline" className="text-xs">
                          Attached
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Not Attached
                        </Badge>
                      )}
                    </div>
                    {candidate.aadharPhoto ? (
                      <div className="relative aspect-4/3 w-64 overflow-hidden rounded-xl border bg-muted/50 shadow-sm">
                        <Image
                          src={candidate.aadharPhoto}
                          alt="Aadhar document"
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-44 text-muted-foreground">
                        <IconIdFilled className="size-10 opacity-30 mb-2" />
                        <p className="text-sm">No Aadhar document attached</p>
                      </div>
                    )}
                    {candidate.aadharPhoto && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5"
                        onClick={() =>
                          setPhotoPreview({
                            url: candidate.aadharPhoto!,
                            title: `${candidate.name} - Aadhar Document`,
                          })
                        }
                      >
                        <IconEyeFilled className="size-4" />
                        View Full Size Document
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ACADEMIC TAB */}
            <TabsContent value="academic" className="space-y-6 pt-4">
              <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                <div className="rounded-xl border bg-muted/20 p-4 space-y-1 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    College Name
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.collegeName}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Affiliated University
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.universityName || "—"}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Academic Session
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.sessionName}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Course Duration
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.duration}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    University Roll Number
                  </p>
                  <p className="text-base font-mono font-semibold text-foreground">
                    {candidate.universityRoll}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    College Roll Number
                  </p>
                  <p className="text-base font-mono font-semibold text-foreground">
                    {candidate.collegeRoll}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Enrolled Course
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.course || "—"}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Major / MJC Subject
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.mjcSubject || "—"}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Domain / Main Subject
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {candidate.domainOrMainSubject || "—"}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-1 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    College Registration Fee
                  </p>
                  <p className="text-lg font-bold text-primary">
                    ₹{candidate.collegeFee}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* PAYMENTS TAB */}
            <TabsContent value="payment" className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Overall Payment Status
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Candidate registration fee status
                  </p>
                </div>
                <PaymentStatusBadge status={candidate.paymentStatus} />
              </div>

              {candidate.payments && candidate.payments.length > 0 ? (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Transaction History ({candidate.payments.length})
                  </h4>
                  <div className="divide-y rounded-xl border overflow-hidden">
                    {candidate.payments.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold">
                              ₹{(p.amount / 100).toFixed(2)}
                            </span>
                            <PaymentStatusBadge status={p.status} />
                          </div>
                          {p.razorpayPaymentId && (
                            <p className="text-xs text-muted-foreground font-mono">
                              Razorpay Txn: {p.razorpayPaymentId}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground sm:text-right">
                          {new Date(p.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 rounded-xl border border-dashed text-muted-foreground space-y-2">
                  <IconCreditCardFilled className="size-10 mx-auto opacity-30" />
                  <p className="text-base font-semibold">
                    No payment attempts recorded
                  </p>
                  <p className="text-xs max-w-sm mx-auto">
                    This candidate has not initiated an online payment attempt
                    yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-3 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto gap-1.5"
              onClick={() => {
                onOpenChange(false);
                onDeleteClick();
              }}
            >
              <IconTrashFilled className="size-4" />
              Delete Candidate
            </Button>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                className="w-full sm:w-auto gap-1.5"
                onClick={() => {
                  onOpenChange(false);
                  onEditClick();
                }}
              >
                <IconPencil className="size-4" />
                Edit Details
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enlarged Photo Preview Dialog */}
      {photoPreview && (
        <Dialog
          open={Boolean(photoPreview)}
          onOpenChange={(open) => !open && setPhotoPreview(null)}
        >
          <DialogContent className="w-[90vw] sm:max-w-[85vw] max-h-[90vh] p-6">
            <DialogHeader>
              <DialogTitle className="text-base">
                {photoPreview.title}
              </DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video w-full max-h-[75vh] overflow-hidden rounded-xl border bg-muted/60 mt-2">
              <Image
                src={photoPreview.url}
                alt={photoPreview.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
