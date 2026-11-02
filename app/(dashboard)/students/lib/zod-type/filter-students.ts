import { z } from "zod";

export const filterStudentsInputSchema = z.object({
  collegeId: z.string().trim().min(1, "College is required"),
  domain: z.string().trim().optional(),
  sessionId: z.string().trim().optional(),
});

export type FilterStudentsInput = z.infer<typeof filterStudentsInputSchema>;

export type CollegeOption = {
  id: string;
  name: string;
  code: string | null;
  universityName: string;
  domains: string[];
  sessions: {
    id: string;
    name: string;
    fees: string;
    duration: string;
  }[];
};

export type FilterOptionsData = {
  colleges: CollegeOption[];
};

export type FilteredStudentPayment = {
  id: string;
  amount: number;
  status: string;
  razorpayPaymentId: string | null;
  createdAt: string;
};

export type FilteredStudentRow = {
  candidateId: string;
  educationId: string;
  name: string;
  email: string;
  phone: string;
  fatherName: string;
  gender: string;
  dateOfBirth: string;
  aadharNo: string;
  profilePhoto: string;
  aadharPhoto?: string | null;
  universityRoll: string;
  collegeRoll: string;
  course?: string | null;
  domainOrMainSubject: string;
  mjcSubject: string;
  duration: string;
  collegeFee: string;
  collegeId: string;
  collegeName: string;
  collegeCode: string | null;
  universityName: string;
  sessionId: string;
  sessionName: string;
  paymentStatus: string;
  registrationStatus: "COMPLETE" | "INCOMPLETE";
  payments: FilteredStudentPayment[];
};

export type StudentFilterSummary = {
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  otherGenderCount: number;
  verifiedPaymentCount: number;
  pendingPaymentCount: number;
  collegeName: string;
  collegeCode: string | null;
  universityName: string;
  domain: string;
  sessionName: string | null;
};

export type FilteredStudentsData = {
  students: FilteredStudentRow[];
  summary: StudentFilterSummary;
};
