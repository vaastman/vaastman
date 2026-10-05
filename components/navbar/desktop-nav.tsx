import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavbarLogoLink } from "./logo-link";
import { DesktopMenuItem } from "./menu-links";
import { ProfileDropdown } from "./profile-dropdown";
import type { MenuItem, NavbarAuth, NavbarLogo, SessionData } from "./types";

interface DesktopNavProps {
  auth: NavbarAuth;
  getInitials: (name?: string | null, email?: string | null) => string;
  isLoggingOut: boolean;
  logo: NavbarLogo;
  menuItems: MenuItem[];
  onLogout: () => void;
  session: SessionData | null;
}

function DesktopNav({
  auth,
  getInitials,
  isLoggingOut,
  logo,
  menuItems,
  onLogout,
  session,
}: DesktopNavProps) {
  return (
    <nav className="hidden items-center lg:flex">
      <div className="flex-1">
        <NavbarLogoLink logo={logo} />
      </div>

      <div className="flex-none">
        <NavigationMenu>
          <NavigationMenuList className="gap-3">
            {menuItems.map((item) => (
              <DesktopMenuItem key={item.title} item={item} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {session ? (
          <ProfileDropdown
            session={session}
            isLoggingOut={isLoggingOut}
            label="Profile"
            onLogout={onLogout}
            getInitials={getInitials}
          />
        ) : (
          <Button asChild>
            <Link href={auth.signin.url}>{auth.signin.title}</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

export { DesktopNav };
