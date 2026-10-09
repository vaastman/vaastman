import type { RegisteredStudentRow } from "./actions";

const csvColumns = [
  { key: "registrationStatus", label: "Registration Status" },
  { key: "universityRoll", label: "University Roll Number" },
  { key: "collegeRoll", label: "College Roll Number" },
  { key: "name", label: "Candidate Name" },
  { key: "domainOrMainSubject", label: "Domain" },
  { key: "phone", label: "Phone Number" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "collegeFee", label: "College Fee" },
  { key: "email", label: "Email" },
  { key: "mjcSubject", label: "MJC Subject" },
  { key: "fatherName", label: "Father Name" },
  { key: "gender", label: "Gender" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "duration", label: "Duration" },
] as const;

type CsvColumnKey = (typeof csvColumns)[number]["key"];

type CsvCandidate = Record<CsvColumnKey, string>;

const incompleteCsvColumns = [
  { key: "name", label: "Candidate Name" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "fatherName", label: "Father Name" },
  { key: "aadharNo", label: "Aadhar Number" },
  { key: "gender", label: "Gender" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "registrationStatus", label: "Registration Status" },
  { key: "resumeLink", label: "Resume Registration URL" },
  { key: "candidateId", label: "Candidate ID" },
] as const;

type IncompleteCsvColumnKey = (typeof incompleteCsvColumns)[number]["key"];

function toCsvValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/"/g, '""');
}

function toFileNamePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function downloadRegisteredStudentsSessionCsv({
  collegeName,
  sessionName,
  candidates,
}: {
  collegeName: string;
  sessionName: string;
  candidates: ReadonlyArray<CsvCandidate>;
}) {
  const header = csvColumns
    .map((column) => `"${toCsvValue(column.label)}"`)
    .join(",");
  const rows = candidates.map((candidate) => {
    return csvColumns
      .map((column) => `"${toCsvValue(candidate[column.key])}"`)
      .join(",");
  });
  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const collegePart = toFileNamePart(collegeName) || "college";
  const sessionPart = toFileNamePart(sessionName) || "session";

  link.href = url;
  link.download = `${collegePart}-${sessionPart}-registered-students.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadIncompleteCandidatesCsv({
  collegeName,
  candidates,
}: {
  collegeName: string;
  candidates: ReadonlyArray<RegisteredStudentRow>;
}) {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://www.vaastman.com";

  const rows = candidates.map((candidate) => {
    const candidateData: Record<IncompleteCsvColumnKey, string> = {
      name: candidate.name,
      phone: candidate.phone,
      email: candidate.email,
      fatherName: candidate.fatherName,
      aadharNo: candidate.aadharNo,
      gender: candidate.gender,
      dateOfBirth: candidate.dateOfBirth,
      registrationStatus: "Personal Only (Pending Education)",
      resumeLink: `${origin}/add/candidate/${candidate.candidateId}?tab=education`,
      candidateId: candidate.candidateId,
    };

    return incompleteCsvColumns
      .map((col) => `"${toCsvValue(candidateData[col.key])}"`)
      .join(",");
  });

  const header = incompleteCsvColumns
    .map((column) => `"${toCsvValue(column.label)}"`)
    .join(",");

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const collegePart = toFileNamePart(collegeName) || "college";

  link.href = url;
  link.download = `${collegePart}-incomplete-candidates.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
