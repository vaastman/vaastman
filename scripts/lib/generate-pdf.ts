import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function findChromePath(): string {
  const possiblePaths = [
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean) as string[];

  for (const candidate of possiblePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return "google-chrome";
}

export function generatePdfFromHtml(html: string): Buffer {
  const chromePath = findChromePath();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const tempHtml = path.join(os.tmpdir(), `offer-${id}.html`);
  const tempPdf = path.join(os.tmpdir(), `offer-${id}.pdf`);

  fs.writeFileSync(tempHtml, html, "utf-8");

  try {
    execFileSync(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--no-pdf-header-footer",
      `--print-to-pdf=${tempPdf}`,
      tempHtml,
    ]);

    if (!fs.existsSync(tempPdf)) {
      throw new Error(`Failed to generate PDF at ${tempPdf}`);
    }

    return fs.readFileSync(tempPdf);
  } finally {
    if (fs.existsSync(tempHtml)) {
      try {
        fs.unlinkSync(tempHtml);
      } catch {
        // ignore cleanup error
      }
    }
    if (fs.existsSync(tempPdf)) {
      try {
        fs.unlinkSync(tempPdf);
      } catch {
        // ignore cleanup error
      }
    }
  }
}
