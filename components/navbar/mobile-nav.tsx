import { IconMenu2 } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <div className="block lg:hidden">
      <div className="flex items-center justify-between">
        <NavbarLogoLink logo={logo} showTitle={true} />
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
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open Navigation Menu"
              >
                <IconMenu2 className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="overflow-y-auto w-[320px] sm:w-[380px] p-0 flex flex-col justify-between"
            >
              <div>
                <SheetHeader className="p-5 border-b border-border/70 text-left">
                  <SheetTitle asChild>
                    <Link
                      href={logo.url}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 group"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={36}
                        height={36}
                        className="size-9 rounded-xl object-contain border border-border/60 p-0.5 shadow-2xs"
                      />
                      <div>
                        <span className="font-bold text-base text-foreground block leading-tight">
                          Vaastman Solutions
                        </span>
                        <span className="text-[11px] text-muted-foreground block font-normal">
                          Student &amp; Candidate Portal
                        </span>
                      </div>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-1">
                  <p className="px-3.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Portal Services
                  </p>
                  <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                      <MobileMenuItem
                        key={item.title}
                        item={item}
                        onNavigate={() => setOpen(false)}
                      />
                    ))}
                  </nav>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="p-4 border-t border-border/70 bg-muted/20">
                {session ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {getInitials(session.user.name, session.user.email)}
                      </div>
                      <div className="text-xs truncate">
                        <p className="font-semibold text-foreground truncate">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onLogout}
                      disabled={isLoggingOut}
                      className="shrink-0"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="w-full font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    <Link href={auth.signin.url}>{auth.signin.title}</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export { MobileNav };
