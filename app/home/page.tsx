import type { Metadata } from "next";
import { Clients } from "@/components/home/clients";
import { Hero } from "@/components/home/hero";
import { HowWeWork } from "@/components/home/how-we-work";
import { ProjectShowcase } from "@/components/home/project-showcase";
import { SquadShowcase } from "@/components/home/squad-showcase";
import { StudentServices } from "@/components/home/student-services";
import { WhyICanBeTrusted } from "@/components/why-i-can-be-trusted";

const SITE_URL = "https://vaastman.com";

export const metadata: Metadata = {
  title: "Vaastman Solutions Pvt Ltd — Web, Mobile & AI Engineering Studio",
  description:
    "Vaastman Solutions builds high-performance websites, web apps, mobile apps, and AI-powered platforms. Trusted by 20+ clients with 95% retention across India and abroad.",
  alternates: {
    canonical: `${SITE_URL}/home`,
  },
  openGraph: {
    title: "Vaastman Solutions Pvt Ltd — Web, Mobile & AI Engineering Studio",
    description:
      "We design and engineer custom-tailored digital products — websites, web apps, mobile apps, and AI platforms — combining premium design with rock-solid engineering.",
    url: `${SITE_URL}/home`,
    siteName: "Vaastman Solutions",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaastman Solutions Pvt Ltd — Engineering Studio",
    description:
      "High-performance websites, web apps, mobile apps & AI platforms. 50+ projects shipped, 95% client retention.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vaastman Solutions Pvt Ltd",
  url: SITE_URL,
  logo: `${SITE_URL}/vaastman-logo.jpg`,
  description:
    "Full-stack digital engineering studio building high-performance websites, web apps, mobile apps, and AI-powered platforms.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  sameAs: [],
  knowsAbout: [
    "Web Development",
    "Mobile App Development",
    "AI & Automation",
    "Cloud & DevOps",
    "Product Strategy",
    "UI/UX Design",
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <StudentServices />
      <WhyICanBeTrusted />
      <ProjectShowcase />
      <HowWeWork />
      <SquadShowcase />
      <Clients />
    </>
  );
}
