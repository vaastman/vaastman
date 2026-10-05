import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavbarLogoLink } from "./logo-link";
import { MobileMenuItem } from "./menu-links";
import { ProfileDropdown } from "./profile-dropdown";
import type { MenuItem, NavbarAuth, NavbarLogo, SessionData } from "./types";

interface MobileNavProps {
  auth: NavbarAuth;
  getInitials: (name?: string | null, email?: string | null) => string;
  isLoggingOut: boolean;
  logo: NavbarLogo;
  menuItems: MenuItem[];
  onLogout: () => void;
  session: SessionData | null;
}

function MobileNav({
  auth,
  getInitials,
  isLoggingOut,
  logo,
  menuItems,
  onLogout,
  session,
}: MobileNavProps) {
  return (
    <div className="block lg:hidden">
      <div className="flex items-center justify-between">
        <NavbarLogoLink logo={logo} showTitle={false} />
        <div className="flex items-center gap-2">
          {session ? (
            <ProfileDropdown
              compact
              session={session}
              isLoggingOut={isLoggingOut}
              label="Profile"
              onLogout={onLogout}
              getInitials={getInitials}
            />
          ) : (
            <Button asChild size="sm">
              <Link href={auth.signin.url}>{auth.signin.title}</Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <IconMenu2 className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <NavbarLogoLink logo={logo} showTitle={false} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {menuItems.map((item) => (
                    <MobileMenuItem key={item.title} item={item} />
                  ))}
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export { MobileNav };
