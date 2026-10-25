import {
  IconArrowRight,
  IconCertificate,
  IconEdit,
  IconFileTextFilled,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";

const studentLinks = [
  {
    title: "Download Offer Letter",
    description:
      "Enter your Aadhar number & Date of Birth to view, download, or print your official Internship Offer Letter.",
    href: "/download/offer-letter",
    badge: "Official Document",
    icon: IconFileTextFilled,
    accent:
      "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
    buttonText: "Download Offer Letter",
  },
  {
    title: "Update Form Details",
    description:
      "Correct or complete your personal details, contact number, roll numbers, or upload your passport photo.",
    href: "/candidate/update",
    badge: "Self-Service",
    icon: IconEdit,
    accent:
      "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    buttonText: "Update My Details",
  },
  {
    title: "Download Certificate",
    description:
      "Look up your completed internship record using your university roll number and download your verified certificate.",
    href: "/download/internship",
    badge: "Completion",
    icon: IconCertificate,
    accent:
      "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    buttonText: "Find Certificate",
  },
  {
    title: "Candidate Registration",
    description:
      "New student or intern? Start your fresh registration process for upcoming university batches and programs.",
    href: "/add/candidate",
    badge: "New Intake",
    icon: IconUserPlus,
    accent:
      "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
    buttonText: "Start Registration",
  },
];

export function StudentServices() {
  return (
    <section
      id="student-services"
      className="relative mx-auto my-16 w-full max-w-6xl px-4 sm:px-6"
      aria-label="Student and Candidate Services Portal"
    >
      <div className="rounded-3xl border border-border/80 bg-linear-to-b from-card/80 to-card/40 p-6 sm:p-10 shadow-sm backdrop-blur-md">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <span>Student &amp; Candidate Portal</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Quick Services for Students
          </h2>

          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Directly access your internship documents, update submitted form
            information, or download official certificates without waiting for
            manual support.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {studentLinks.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-background/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-background hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl border bg-linear-to-br ${item.accent} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={item.href}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-semibold text-foreground transition-all duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground shadow-2xs"
                  >
                    <span>{item.buttonText}</span>
                    <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
