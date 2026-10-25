import {
  IconBrandGithubFilled,
  IconBrandInstagramFilled,
  IconBrandLinkedinFilled,
  IconBrandXFilled,
  IconMailFilled,
  IconMapPin,
  IconPhoneFilled,
} from "@tabler/icons-react";
import Link from "next/link";

const services = [
  { label: "Web Development", href: "#" },
  { label: "UI/UX Design", href: "#" },
  { label: "Mobile Apps", href: "#" },
  { label: "Cloud & DevOps", href: "#" },
  { label: "AI & ML Solutions", href: "#" },
  { label: "Tech Consulting", href: "#" },
];

const studentPortalLinks = [
  { label: "Download Offer Letter", href: "/download/offer-letter" },
  { label: "Update Registration Details", href: "/candidate/update" },
  { label: "Download Certificate", href: "/download/internship" },
  { label: "Candidate Registration", href: "/add/candidate" },
  { label: "Verify Certificate", href: "/verify/internship" },
];

const company = [
  { label: "About Us", href: "#" },
  { label: "Our Work", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

const socials = [
  { icon: IconBrandXFilled, href: "#", label: "X / Twitter" },
  { icon: IconBrandLinkedinFilled, href: "#", label: "LinkedIn" },
  { icon: IconBrandInstagramFilled, href: "#", label: "Instagram" },
  { icon: IconBrandGithubFilled, href: "#", label: "GitHub" },
];

const contact = [
  {
    icon: IconMailFilled,
    value: "vaastmansolutions.info@gmail.com",
    href: "mailto:vaastmansolutions.info@gmail.com",
  },
  {
    icon: IconPhoneFilled,
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  { icon: IconMapPin, value: "Patna, Bihar — INDIA, 800001", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-[90%] py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/home" className="w-fit">
              <span className="text-xl font-extrabold tracking-tight text-primary">
                Vaastman
              </span>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                {" "}
                Solutions
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A full-stack digital agency crafting high-performance websites,
              apps, and digital experiences that deliver real results.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Student Portal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Student Portal
            </h4>
            <ul className="flex flex-col gap-2">
              {studentPortalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Services
            </h4>
            <ul className="flex flex-col gap-2">
              {services.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Company
            </h4>
            <ul className="flex flex-col gap-2">
              {company.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              {contact.map(({ icon: Icon, value, href }) => (
                <li key={value}>
                  <a
                    href={href}
                    className="group flex items-start gap-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon className="size-4 mt-0.5 shrink-0 text-primary" />
                    <span>{value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Vaastman Solutions. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ in Patna, India
          </p>
        </div>
      </div>
    </footer>
  );
}
