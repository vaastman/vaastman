import {
  IconBookmarkFilled,
  IconCalendarFilled,
  IconCertificate,
  IconFileTypeCsv,
  IconHomeFilled,
  IconLayoutDashboardFilled,
  IconSchoolFilled,
  IconUserFilled,
  IconUsers,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: ComponentType<{ className?: string }>;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(_pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: IconLayoutDashboardFilled,
          submenus: [],
        },
        {
          href: "/students",
          label: "Students",
          icon: IconUserFilled,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/college",
          label: "Manage colleges",
          icon: IconBookmarkFilled,
        },
        {
          href: "/academic-session",
          label: "Academic sessions",
          icon: IconCalendarFilled,
        },
        {
          href: "/add/candidate",
          label: "Internship",
          icon: IconUsers,
        },
        {
          href: "/add/csv-old/student",
          label: "CSV Upload (Old Students)",
          icon: IconFileTypeCsv,
        },
        {
          href: "/certificate/internship",
          label: "Certificates",
          icon: IconCertificate,
        },
        {
          href: "/home",
          label: "Home Page",
          icon: IconHomeFilled,
        },
        {
          href: "/college-login",
          label: "College Portal",
          icon: IconSchoolFilled,
        },
      ],
    },
  ];
}
