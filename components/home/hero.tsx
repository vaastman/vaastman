"use client";

import {
  IconBulbFilled,
  IconCloudComputingFilled,
  IconCodeCircle2Filled,
  IconLayout2Filled,
  IconStarFilled,
} from "@tabler/icons-react";
import { Building2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Highlight from "@/components/animate-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import LayoutTextFlipDemo from "../layout-text-flip-demo";

const companies = [
  "NEXOVA TECH",
  "BRIGHTLINE",
  "APEX DIGITAL",
  "CLOUDPEAK",
  "FORGEWAVE",
  "PIXEL LABS",
];

const focusWords = ["Websites", "Web Apps", "Mobile Apps", "Platforms"];

const stats: { value: number; suffix: string; label: string }[] = [
  { value: 50, suffix: "+", label: "Projects shipped" },
  { value: 95, suffix: "%", label: "Client retention" },
  { value: 20, suffix: "+", label: "Active clients" },
];

function useCountUp(target: number, durationMs = 1400, startDelay = 300) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const timeout = setTimeout(() => {
      const step = (t: number) => {
        if (!start) start = t;
        const progress = Math.min((t - start) / durationMs, 1);
        const eased = 1 - (1 - progress) ** 3;
        setValue(Math.round(target * eased));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs, startDelay]);

  return value;
}

function StatCounter({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const count = useCountUp(value, 1400, delay);
  return (
    <div
      className="vs-fade-up group flex flex-col items-center gap-1.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="font-mono text-3xl font-semibold tabular-nums text-foreground transition-colors group-hover:text-primary sm:text-4xl">
        {count}
        {suffix}
      </span>
      <span className="relative text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
        <span className="absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-primary transition-[width] duration-300 group-hover:w-full" />
      </span>
    </div>
  );
}

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setWordIndex((i) => (i + 1) % focusWords.length);
    }, 2200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <section
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-20"
      aria-label="Vaastman Solutions — Digital Engineering Studio"
    >
      {/* SEO fallback for crawlers that don't execute JavaScript */}
      <noscript>
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h1>Vaastman Solutions Pvt Ltd</h1>
          <p>
            We build custom-tailored, high-performance websites, web apps,
            mobile apps, and platforms combining premium design with rock-solid
            engineering to deliver measurable impact.
          </p>
          <p>
            Our core expertise: Web &amp; Mobile Development, AI &amp;
            Automation, Cloud &amp; DevOps, and Product Strategy.
          </p>
          <p>
            50+ projects shipped · 95% client retention · 20+ active clients
          </p>
        </div>
      </noscript>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .vs-fade-up {
            opacity: 0;
            animation: vsFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes vsFadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .vs-highlight {
            background-image: linear-gradient(var(--vs-mark, hsl(var(--primary) / 0.22)), var(--vs-mark, hsl(var(--primary) / 0.22)));
            background-repeat: no-repeat;
            background-position: 0 88%;
            background-size: 0% 55%;
            animation: vsMark 0.6s ease-out 1.1s forwards;
          }
          @keyframes vsMark {
            to { background-size: 100% 55%; }
          }
          .vs-corner {
            transform: scale(0.6);
            opacity: 0;
            animation: vsCorner 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes vsCorner {
            to { transform: scale(1); opacity: 1; }
          }
          .vs-underline path {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: vsDraw 0.5s ease-out forwards;
          }
          @keyframes vsDraw {
            to { stroke-dashoffset: 0; }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .vs-fade-up, .vs-corner { opacity: 1; transform: none; animation: none; }
          .vs-highlight { background-size: 100% 55%; }
        }
      `}</style>

      {/* ── Blueprint grid — faint, grounded in "Vaastman" (structure / vaastu) ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 65% 60% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative flex w-full max-w-5xl flex-col items-center gap-8 text-center md:gap-10">
        {/* ── Corner registration marks — drafting-studio signature ── */}
        <span
          className="vs-corner absolute -left-4 -top-4 size-4 border-l border-t border-foreground/20 sm:-left-8 sm:-top-8"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="vs-corner absolute -right-4 -top-4 size-4 border-r border-t border-foreground/20 sm:-right-8 sm:-top-8"
          style={{ animationDelay: "250ms" }}
        />
        <span
          className="vs-corner absolute -bottom-4 -left-4 size-4 border-b border-l border-foreground/20 sm:-bottom-8 sm:-left-8"
          style={{ animationDelay: "350ms" }}
        />
        <span
          className="vs-corner absolute -bottom-4 -right-4 size-4 border-b border-r border-foreground/20 sm:-bottom-8 sm:-right-8"
          style={{ animationDelay: "450ms" }}
        />

        {/* ── Stars Rating & Badge ────────────────────────────────────────── */}

        <h1 className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1.5 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:gap-x-3 sm:text-6xl lg:text-7xl">
          <span className="vs-fade-up" style={{ animationDelay: "80ms" }}>
            <Highlight text="Vaastman" />
          </span>
          <span
            className="vs-fade-up relative font-normal text-foreground"
            style={{ animationDelay: "160ms" }}
          >
            <span className="vs-highlight">Solutions</span>
            <span className="absolute -right-2 top-0 translate-x-full font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 sm:-right-4 sm:top-1">
              Pvt Ltd
            </span>
          </span>
        </h1>

        {/* <p
          className="vs-fade-up max-w-2xl text-base leading-relaxed text-muted-foreground/90 sm:text-lg md:text-xl font-light"
          style={{ animationDelay: "340ms" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          We build custom-tailored, high-performance{" "}
          <button
            type="button"
            onClick={() => setWordIndex((i) => (i + 1) % focusWords.length)}
            className="relative inline-flex items-baseline font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            aria-live="polite"
          >
            {focusWords[wordIndex]}
            <svg
              key={wordIndex}
              className="vs-underline absolute -bottom-1 left-0 h-1.5 w-full"
              viewBox="0 0 100 8"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M1 5 C 20 2, 80 2, 99 5"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                strokeLinecap="round"
                pathLength="1"
              />
            </svg>
          </button>{" "}
          combining premium design with rock-solid engineering to deliver measurable impact.
        </p> */}
        <LayoutTextFlipDemo />

        <div
          className="vs-fade-up flex items-center gap-3 rounded-full border border-border/60 bg-muted/30 py-1 pl-3.5 pr-1.5"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-yellow-500">
              <IconStarFilled className="size-3.5" />
              <IconStarFilled className="size-3.5" />
              <IconStarFilled className="size-3.5" />
              <IconStarFilled className="size-3.5" />
              <IconStarFilled className="size-3.5 opacity-50" />
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              4.7 rating
            </span>
          </div>

          <div className="h-4 w-px bg-border/85" />

          <div className="flex -space-x-1.5">
            {["dshamshee", "devashishkr3", "amitkys"].map((username) => (
              <Avatar
                key={username}
                className="size-6 border border-background"
              >
                <AvatarImage
                  src={`https://github.com/${username}.png`}
                  alt={username}
                />
                <AvatarFallback className="text-[8px]">
                  {username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        <div
          className="vs-fade-up flex items-center gap-3 pt-1"
          style={{ animationDelay: "420ms" }}
        >
          <Button
            size="lg"
            className="rounded-full px-8 font-semibold transition-transform hover:-translate-y-0.5"
          >
            Get a quote
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 font-semibold transition-transform hover:-translate-y-0.5"
          >
            Our work
          </Button>
        </div>

        {/* ── Trusted Brands / Client Logos ───────────────────────────────── */}
        <div
          className="vs-fade-up mt-6 flex flex-col items-center gap-4"
          style={{ animationDelay: "480ms" }}
        >
          <span className="relative inline-block pb-1.5 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Trusted by Companies
            <svg
              className="vs-underline absolute -bottom-0.5 left-0 h-1.5 w-full"
              viewBox="0 0 100 8"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M1 5 C 20 2, 80 2, 99 5"
                fill="none"
                stroke="#eab308"
                strokeWidth="3.5"
                strokeLinecap="round"
                pathLength="1"
              />
            </svg>
          </span>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {companies.map((company) => (
              <div
                key={company}
                className="
        flex
        h-14
        min-w-[160px]
        sm:min-w-[180px]
        justify-center
        items-center
        rounded-2xl
        border
        border-border/60
        bg-background/40
        px-8
        backdrop-blur-xl
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:bg-background
        hover:shadow-md
        hover:shadow-primary/5
      "
              >
                <span className="font-semibold tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Core Expertise Grid ─────────────────────────────────────────── */}
        <h2 className="sr-only">Our Core Expertise</h2>
        <div
          className="vs-fade-up mt-6 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4"
          style={{ animationDelay: "560ms" }}
        >
          <div className="group rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/45 hover:bg-card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <IconCodeCircle2Filled className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Web &amp; Mobile
            </h3>
            <p className="mt-1.5 text-xs leading-normal text-muted-foreground">
              Fast, responsive Next.js websites and native iOS/Android mobile
              apps.
            </p>
          </div>

          <div className="group rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/45 hover:bg-card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <IconBulbFilled className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              AI &amp; Automation
            </h3>
            <p className="mt-1.5 text-xs leading-normal text-muted-foreground">
              Intelligent LLM integrations, custom AI agents, and smart IVR
              automation.
            </p>
          </div>

          <div className="group rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/45 hover:bg-card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <IconCloudComputingFilled className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Cloud &amp; DevOps
            </h3>
            <p className="mt-1.5 text-xs leading-normal text-muted-foreground">
              Auto-scaling AWS infrastructure, secure pipelines, and reliable
              hosting.
            </p>
          </div>

          <div className="group rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/45 hover:bg-card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <IconLayout2Filled className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Product Strategy
            </h3>
            <p className="mt-1.5 text-xs leading-normal text-muted-foreground">
              Figma-first design systems and technical consulting before writing
              code.
            </p>
          </div>
        </div>

        <div className="mt-6 flex w-full items-center justify-center gap-10 border-t border-border/60 pt-6 sm:gap-16">
          {stats.map((stat, i) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={660 + i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
