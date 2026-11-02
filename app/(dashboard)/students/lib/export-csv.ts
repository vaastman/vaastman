import type { FilteredStudentRow } from "./zod-type/filter-students";

function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function downloadFilteredStudentsCsv({
  collegeName,
  domain,
  sessionName,
  students,
}: {
  collegeName: string;
  domain?: string;
  sessionName?: string | null;
  students: FilteredStudentRow[];
}) {
  const headers = [
    "Candidate Name",
    "Email",
    "Phone",
    "Father's Name",
    "Gender",
    "Date of Birth",
    "Aadhar Number",
    "University Roll",
    "College Roll",
    "College Name",
    "College Code",
    "University Name",
    "Domain",
    "MJC Subject",
    "Session",
    "Duration",
    "College Fee",
    "Payment Status",
  ];

  const rows = students.map((s) => [
    s.name,
    s.email,
    s.phone,
    s.fatherName,
    s.gender,
    s.dateOfBirth,
    s.aadharNo,
    s.universityRoll,
    s.collegeRoll,
    s.collegeName,
    s.collegeCode ?? "",
    s.universityName,
    s.domainOrMainSubject,
    s.mjcSubject,
    s.sessionName,
    s.duration,
    s.collegeFee,
    s.paymentStatus,
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const cleanPart = (val: string) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

  const collegePart = cleanPart(collegeName);
  const domainPart = domain && domain !== "ALL" ? `-${cleanPart(domain)}` : "";
  const sessionPart = sessionName ? `-${cleanPart(sessionName)}` : "";

  link.href = url;
  link.download = `${collegePart}${domainPart}${sessionPart}-students.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
