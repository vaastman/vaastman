/** Course options and their linked MJC subjects */

export const COURSE_OPTIONS = [
  { label: "B.A", value: "BA" },
  { label: "B.Sc", value: "BSC" },
  { label: "B.Com", value: "BCOM" },
  { label: "B.Com Professional", value: "BCOM_PROFESSIONAL" },
  { label: "B.Sc Professional", value: "BSC_PROFESSIONAL" },
] as const;

export type CourseValue = (typeof COURSE_OPTIONS)[number]["value"];

/**
 * MJC subjects mapped per course.
 * Labels no longer carry the course prefix (e.g. "URDU" instead of "B.A URDU")
 * because the selected course already provides that context.
 */
export const COURSE_MJC_MAP: Record<
  CourseValue,
  readonly { label: string; value: string }[]
> = {
  BA: [
    { label: "LSW", value: "LSW" },
    { label: "PA (Public Administration)", value: "PA" },
    { label: "Sociology", value: "SOCIOLOGY" },
    { label: "Psychology", value: "PSYCHOLOGY" },
    { label: "Geography", value: "GEOGRAPHY" },
    { label: "Home Science", value: "HOME_SCIENCE" },
    {
      label: "AIAS (Ancient Indian & Asian Studies)",
      value: "AIAS",
    },
    { label: "Sanskrit", value: "SANSKRIT" },
    { label: "Political Science", value: "POLITICAL_SCIENCE" },
    { label: "Economics", value: "ECONOMICS" },
    { label: "Philosophy", value: "PHILOSOPHY" },
    { label: "Urdu", value: "URDU" },
    { label: "Hindi", value: "HINDI" },
    { label: "History", value: "HISTORY" },
    { label: "English", value: "ENGLISH" },
  ],
  BSC: [
    { label: "Maths", value: "MATHS" },
    { label: "Chemistry", value: "CHEMISTRY" },
    { label: "Physics", value: "PHYSICS" },
    { label: "Zoology", value: "ZOOLOGY" },
    { label: "Botany", value: "BOTANY" },
  ],
  BCOM: [
    // 1st Year
    { label: "Financial Accounting", value: "FINANCIAL_ACCOUNTING" },
    {
      label: "Business Economics (Microeconomics)",
      value: "BUSINESS_ECONOMICS_MICROECONOMICS",
    },
    {
      label: "Business Mathematics and Statistics",
      value: "BUSINESS_MATHEMATICS_AND_STATISTICS",
    },
    { label: "Business Communication", value: "BUSINESS_COMMUNICATION" },
    {
      label: "Principles of Management",
      value: "PRINCIPLES_OF_MANAGEMENT",
    },
    { label: "Business Law", value: "BUSINESS_LAW" },
    {
      label: "Environmental Studies / Computer Applications",
      value: "ENVIRONMENTAL_STUDIES_COMPUTER_APPLICATIONS",
    },
    // 2nd Year
    { label: "Corporate Accounting", value: "CORPORATE_ACCOUNTING" },
    {
      label: "Business Economics (Macroeconomics)",
      value: "BUSINESS_ECONOMICS_MACROECONOMICS",
    },
    { label: "Company Law", value: "COMPANY_LAW" },
    {
      label: "Income Tax Law and Practice",
      value: "INCOME_TAX_LAW_AND_PRACTICE",
    },
    { label: "Cost Accounting", value: "COST_ACCOUNTING" },
    { label: "Banking and Insurance", value: "BANKING_AND_INSURANCE" },
    {
      label: "Human Resource Management (HRM)",
      value: "HUMAN_RESOURCE_MANAGEMENT",
    },
    {
      label: "E-Commerce / Computerized Accounting",
      value: "E_COMMERCE_COMPUTERIZED_ACCOUNTING",
    },
    // 3rd Year
    {
      label: "Auditing and Corporate Governance",
      value: "AUDITING_AND_CORPORATE_GOVERNANCE",
    },
    { label: "Financial Management", value: "FINANCIAL_MANAGEMENT" },
    {
      label: "Goods and Services Tax (GST) & Indirect Taxes",
      value: "GST_AND_INDIRECT_TAXES",
    },
    { label: "Management Accounting", value: "MANAGEMENT_ACCOUNTING" },
    {
      label: "Entrepreneurship / New Venture Planning",
      value: "ENTREPRENEURSHIP_NEW_VENTURE_PLANNING",
    },
    { label: "International Business", value: "INTERNATIONAL_BUSINESS" },
    // Electives
    {
      label: "Investment Analysis and Portfolio Management",
      value: "INVESTMENT_ANALYSIS_AND_PORTFOLIO_MANAGEMENT",
    },
    {
      label: "Financial Modeling / Advanced Excel",
      value: "FINANCIAL_MODELING_ADVANCED_EXCEL",
    },
    {
      label: "Marketing Management / Consumer Behavior",
      value: "MARKETING_MANAGEMENT_CONSUMER_BEHAVIOR",
    },
    {
      label: "Corporate Tax Planning",
      value: "CORPORATE_TAX_PLANNING",
    },
    {
      label: "Major Research Project / Internship",
      value: "MAJOR_RESEARCH_PROJECT_INTERNSHIP",
    },
  ],
  BCOM_PROFESSIONAL: [],
  BSC_PROFESSIONAL: [],
} as const;

/** Get MJC options for a given course value */
export function getMjcOptionsForCourse(courseValue: string) {
  return COURSE_MJC_MAP[courseValue as CourseValue] ?? [];
}
