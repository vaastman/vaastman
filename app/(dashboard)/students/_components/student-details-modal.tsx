"use client";

import {
  IconCheckupList,
  IconIdFilled,
  IconMailFilled,
  IconPhoneFilled,
  IconSchoolFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FilteredStudentRow } from "../lib/zod-type/filter-students";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function StudentDetailsModal({
  student,
  open,
  onOpenChange,
}: {
  student: FilteredStudentRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <IconUserFilled className="size-5 text-primary" />
            Student Details
          </DialogTitle>
        </DialogHeader>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-start">
          <Avatar className="size-20 border-2 border-border shadow-sm">
            <AvatarImage
              src={student.profilePhoto}
              alt={student.name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg font-bold">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <Badge
                variant={
                  student.paymentStatus === "VERIFIED" ? "default" : "secondary"
                }
                className="font-normal"
              >
                {student.paymentStatus}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:justify-start">
              <span className="flex items-center gap-1">
                <IconMailFilled className="size-5 text-muted-foreground/70" />
                {student.email}
              </span>
              <span className="flex items-center gap-1">
                <IconPhoneFilled className="size-5 text-muted-foreground/70" />
                {student.phone}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Father's Name:{" "}
              <span className="font-medium text-foreground">
                {student.fatherName}
              </span>
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          {/* Academic Info */}
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <IconSchoolFilled className="size-5 text-primary" />
              <span>Academic Information</span>
            </div>
            <div className="space-y-1.5 text-muted-foreground">
              <div className="flex justify-between">
                <span>College:</span>
                <span className="font-medium text-foreground text-right">
                  {student.collegeName}{" "}
                  {student.collegeCode ? `[${student.collegeCode}]` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span>University Roll:</span>
                <span className="font-medium text-foreground">
                  {student.universityRoll || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>College Roll:</span>
                <span className="font-medium text-foreground">
                  {student.collegeRoll || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Domain:</span>
                <span className="font-medium text-foreground">
                  {student.domainOrMainSubject}
                </span>
              </div>
              <div className="flex justify-between">
                <span>MJC Subject:</span>
                <span className="font-medium text-foreground">
                  {student.mjcSubject || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Session:</span>
                <span className="font-medium text-foreground">
                  {student.sessionName}
                </span>
              </div>
            </div>
          </div>

          {/* Identity & Personal Info */}
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <IconIdFilled className="size-5 text-primary" />
              <span>Personal & Identity</span>
            </div>
            <div className="space-y-1.5 text-muted-foreground">
              <div className="flex justify-between">
                <span>Aadhar Number:</span>
                <span className="font-medium text-foreground">
                  {student.aadharNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Gender:</span>
                <span className="font-medium text-foreground">
                  {student.gender}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date of Birth:</span>
                <span className="font-medium text-foreground">
                  {student.dateOfBirth}
                </span>
              </div>
              <div className="flex justify-between">
                <span>College Fee:</span>
                <span className="font-medium text-foreground">
                  {student.collegeFee || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium text-foreground">
                  {student.duration || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments List */}
        {student.payments.length > 0 && (
          <div className="space-y-2 rounded-lg border p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <IconCheckupList className="size-5 text-primary" />
              <span>Payment Records</span>
            </div>
            <div className="divide-y rounded border">
              {student.payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2"
                >
                  <div>
                    <span className="font-medium">₹{p.amount}</span>
                    {p.razorpayPaymentId && (
                      <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                        ({p.razorpayPaymentId})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <Badge
                      variant={p.status === "VERIFIED" ? "default" : "outline"}
                      className="text-[10px]"
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
