import Link from "next/link";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { MenuItem } from "./types";

function DesktopMenuItem({ item }: { item: MenuItem }) {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        <Link href={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

import { IconChevronRight } from "@tabler/icons-react";

function MobileMenuItem({
  item,
  onNavigate,
}: {
  item: MenuItem;
  onNavigate?: () => void;
}) {
  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="border-none"
      >
        <AccordionTrigger className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-muted/70 hover:no-underline transition-colors">
          <div className="flex items-center gap-3">
            {item.icon ? (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {item.icon}
              </div>
            ) : null}
            <span>{item.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="mt-1 flex flex-col gap-1 pl-4">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      key={item.title}
      href={item.url}
      onClick={onNavigate}
      className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted/80 hover:text-primary active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        {item.icon ? (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {item.icon}
          </div>
        ) : null}
        <span className="font-semibold">{item.title}</span>
      </div>
      <IconChevronRight className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

function SubMenuLink({ item }: { item: MenuItem }) {
  const content = (
    <>
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description ? (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <Link
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
      href={item.url}
    >
      {content}
    </Link>
  );
}

export { DesktopMenuItem, MobileMenuItem };
