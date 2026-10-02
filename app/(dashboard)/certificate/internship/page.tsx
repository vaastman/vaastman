"use client";

import {
  IconAlertTriangleFilled,
  IconCertificate,
  IconDownload,
  IconLoader2,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { jsPDF } from "jspdf";
import { domToJpeg } from "modern-screenshot";
import { useRef, useState } from "react";
import { useGetOldStudents } from "@/app/(dashboard)/lib/old-student/query/use-get-old-students";
import {
  AttendanceSheet,
  type AttendanceSheetData,
} from "@/app/download/internship/_components/attendance-sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDownloadStatus } from "@/lib/hooks/use-download-status";
import {
  type CertificateData,
  InternshipCertificate,
} from "./_components/internship-certificate";

/** A4 dimensions in mm */
const A4_LANDSCAPE = { w: 297, h: 210 };
const A4_PORTRAIT = { w: 210, h: 297 };

/** Pixel sizes for rendering */
const CERT_PX = { w: 1123, h: 794 };
const ATTENDANCE_PX = { w: 794, h: 1123 };

/** Captures a DOM element as a JPEG data URL */
async function captureElement(
  el: HTMLElement,
  width: number,
  height: number,
): Promise<string> {
  return domToJpeg(el, {
    scale: 1.5,
    quality: 0.85,
    width,
    height,
    timeout: 2000,
    fetch: {
      requestInit: {
        cache: "force-cache",
      },
    },
  });
}

export default function CertificatePage() {
  const { data: students, isPending, isError, error } = useGetOldStudents();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CertificateData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadStatus = useDownloadStatus(isDownloading);

  // Refs for off-screen elements
  const exportRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const attendanceRef = useRef<HTMLDivElement>(null);

  const attendanceData: AttendanceSheetData | null = selected
    ? {
        name: selected.name,
        registrationNo: selected.registrationNo,
        honoursSubject: selected.honoursSubject,
        courseName: selected.courseName,
        universityRollNo: selected.universityRollNo,
        gender: selected.gender,
        collegeName: selected.collegeName,
      }
    : null;

  const handleDownload = async () => {
    const target = exportRef.current || printRef.current;
    if (!target) return;
    try {
      setIsDownloading(true);

      // Ensure all fonts are fully loaded before capturing
      if (typeof window !== "undefined" && "fonts" in document) {
        await document.fonts.ready;
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // ── Page 1: Certificate (landscape) ──────────────────
      const certElement = (target.firstElementChild as HTMLElement) || target;
      const certImg = await captureElement(certElement, CERT_PX.w, CERT_PX.h);
      pdf.addImage(
        certImg,
        "JPEG",
        0,
        0,
        A4_LANDSCAPE.w,
        A4_LANDSCAPE.h,
        undefined,
        "FAST",
      );

      // ── Page 2: Attendance Sheet (portrait) ──────────────
      if (attendanceRef.current) {
        pdf.addPage("a4", "portrait");
        const attImg = await captureElement(
          attendanceRef.current,
          ATTENDANCE_PX.w,
          ATTENDANCE_PX.h,
        );
        pdf.addImage(
          attImg,
          "JPEG",
          0,
          0,
          A4_PORTRAIT.w,
          A4_PORTRAIT.h,
          undefined,
          "FAST",
        );
      }

      const fileName = `Certificate_${selected?.name ? selected.name.replace(/\s+/g, "_") : "Student"}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("Failed to download certificate PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Filter students by search query
  const filtered = students?.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.universityRollNo.toLowerCase().includes(q) ||
      s.certificateNo.toLowerCase().includes(q) ||
      s.collegeName.toLowerCase().includes(q)
    );
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <IconAlertTriangleFilled className="size-5" />
          <AlertDescription>
            {error?.message ?? "Failed to load student records"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCertificate className="size-5" />
            Internship Certificates
          </CardTitle>
          <CardDescription>
            View and print internship certificates for old student records.
            {students && (
              <Badge variant="outline" className="ml-2">
                {students.length} total records
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative max-w-sm">
            <IconSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="certificate-search"
              placeholder="Search by name, roll no, certificate no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <IconX className="size-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Student Records
            {filtered && (
              <span className="text-muted-foreground font-normal ml-2">
                ({filtered.length}{" "}
                {filtered.length === 1 ? "record" : "records"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Father&apos;s Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>University Roll No</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Printable</TableHead>
                <TableHead>Certificate No</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered && filtered.length > 0 ? (
                filtered.map((student, i) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {student.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {student.fatherName}
                    </TableCell>
                    <TableCell>{student.courseName}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {student.universityRollNo}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[200px] truncate">
                      {student.collegeName}
                    </TableCell>
                    <TableCell>
                      {student.grade ? (
                        <Badge variant="outline">{student.grade}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.isPrintable ? (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600"
                        >
                          Yes
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-red-500 text-red-600"
                        >
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {student.certificateNo}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelected({
                            name: student.name,
                            fatherName: student.fatherName,
                            courseName: student.courseName,
                            universityRollNo: student.universityRollNo,
                            collegeName: student.collegeName,
                            honoursSubject: student.honoursSubject,
                            topic: student.topic,
                            grade: student.grade,

                            semester: student.semester,
                            programHrs: student.programHrs,
                            certificateNo: student.certificateNo,
                            registrationNo: student.registrationNo,
                            issueDate: student.issueDate,
                            gender: student.gender,
                          })
                        }
                        disabled={!student.isPrintable}
                      >
                        <IconCertificate className="size-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-muted-foreground py-8"
                  >
                    {search
                      ? "No records match your search."
                      : "No old student records found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Certificate Preview Dialog */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-[920px] w-[920px] p-6 max-h-[95vh] overflow-hidden">
          <DialogHeader className="pr-12">
            <DialogTitle className="flex items-center justify-between gap-4">
              <span>Certificate Preview — {selected?.name}</span>
              <Button
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <IconLoader2 className="size-4 animate-spin mr-1" />
                ) : (
                  <IconDownload className="size-4 mr-1" />
                )}
                {isDownloading ? downloadStatus : "Download"}
              </Button>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Preview and download internship certificate for {selected?.name}
            </DialogDescription>
          </DialogHeader>
          {/* Wrapper sized to the scaled certificate dimensions */}
          <div
            className="mt-4"
            style={{
              width: `${Math.ceil(1123 * 0.78)}px`,
              height: `${Math.ceil(794 * 0.78)}px`,
              overflow: "hidden",
            }}
          >
            <div
              ref={printRef}
              style={{
                transform: "scale(0.78)",
                transformOrigin: "top left",
                width: "1123px",
                height: "794px",
              }}
            >
              {selected && <InternshipCertificate data={selected} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Off-screen containers for high-resolution PDF download (unscaled) */}
      {selected && attendanceData && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            opacity: 0,
            pointerEvents: "none",
            zIndex: -9999,
          }}
        >
          {/* Certificate */}
          <div
            style={{
              width: `${CERT_PX.w}px`,
              height: `${CERT_PX.h}px`,
              overflow: "hidden",
            }}
          >
            <div ref={exportRef}>
              <InternshipCertificate data={selected} />
            </div>
          </div>

          {/* Attendance Sheet */}
          <div
            ref={attendanceRef}
            style={{
              width: `${ATTENDANCE_PX.w}px`,
              height: `${ATTENDANCE_PX.h}px`,
              overflow: "hidden",
            }}
          >
            <AttendanceSheet data={attendanceData} />
          </div>
        </div>
      )}
    </div>
  );
}
