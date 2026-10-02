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
  BCOM: [],
  BCOM_PROFESSIONAL: [],
  BSC_PROFESSIONAL: [],
} as const;

/** Get MJC options for a given course value */
export function getMjcOptionsForCourse(courseValue: string) {
  return COURSE_MJC_MAP[courseValue as CourseValue] ?? [];
}
