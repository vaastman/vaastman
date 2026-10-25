"use client";

import {
  IconCertificate,
  IconEdit,
  IconFileTextFilled,
  IconLogin,
  IconRosetteDiscountCheckFilled,
  IconUserPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import type { Navbar1Props } from "./types";
import { getInitials, getMenuItems } from "./utils";

function Navbar1({
  logo = {
    url: "/home",
    src: "/vaastman-logo.jpg",
    alt: "Vaastman Solutions logo",
    title: "Vaastman",
  },
  menu = [
    {
      title: "Offer Letter",
      url: "/download/offer-letter",
      icon: <IconFileTextFilled className="size-5" />,
    },
    {
      title: "Update Details",
      url: "/candidate/update",
      icon: <IconEdit className="size-5" />,
    },
    {
      title: "Download Certificate",
      url: "/download/internship",
      icon: <IconCertificate className="size-5" />,
    },
    {
      title: "Candidate Registration",
      url: "/add/candidate",
      icon: <IconUserPlus className="size-5" />,
    },
    {
      title: "Verify Certificate",
      url: "/verify/internship",
      icon: <IconRosetteDiscountCheckFilled className="size-5" />,
    },
    {
      title: "Sign In",
      url: "/signin",
      icon: <IconLogin className="size-5" />,
    },
  ],
  auth = {
    signin: { title: "Sign In", url: "/signin" },
  },
}: Navbar1Props) {
  const router = useRouter();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const { data: session } = authClient.useSession();

  const menuItems = getMenuItems(menu, auth.signin.url, session?.user.role);

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/signin");
            router.refresh();
          },
        },
      });
    });
  };

  return (
    <section className="mx-auto w-[90%] py-4">
      <div className="container">
        <DesktopNav
          auth={auth}
          getInitials={getInitials}
          isLoggingOut={isLoggingOut}
          logo={logo}
          menuItems={menuItems}
          onLogout={handleLogout}
          session={session ?? null}
        />
        <MobileNav
          auth={auth}
          getInitials={getInitials}
          isLoggingOut={isLoggingOut}
          logo={logo}
          menuItems={menuItems}
          onLogout={handleLogout}
          session={session ?? null}
        />
      </div>
    </section>
  );
}

export { Navbar1 };
