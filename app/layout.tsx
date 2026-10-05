import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "./typography.css";
import Providers from "@/components/providers/progressbar-provider";
import { QueryProviders } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomeToast } from "@/components/toast-provider";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-sans",
  weight: ["500"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaastman Solutions — Digital Agency for Websites & Apps",
  description:
    "Vaastman Solutions is a full-stack digital agency building high-performance websites, web apps, and mobile experiences that deliver real results.",
  icons: {
    icon: "/vaastman-logo.jpg",
    shortcut: "/vaastman-logo.jpg",
    apple: "/vaastman-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <QueryProviders>
              <main>{children}</main>
            </QueryProviders>
          </ThemeProvider>
        </Providers>
        <CustomeToast />
      </body>
    </html>
  );
}
