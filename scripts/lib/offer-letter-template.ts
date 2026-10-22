import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  LOGO_BASE64,
  SIGNATURE_BASE64,
  STAMP_BASE64,
} from "../../app/add/candidate/[id]/success/_components/offer-letter-assets";

export type OfferLetterData = {
  candidateName: string;
  collegeName: string;
  domainOrMainSubject: string;
  universityRoll: string;
  universityName: string;
  profilePhoto?: string | null;
  letterNo: string;
  date: string;
};

const QR_URL = "https://whatsapp.com/channel/0029Vb8nx3lLdQea0Kp4Hl2a";

export function renderOfferLetterHtml(data: OfferLetterData): string {
  const qrSvg = renderToStaticMarkup(
    React.createElement(QRCodeSVG, {
      value: QR_URL,
      size: 100,
      bgColor: "transparent",
      fgColor: "#1a237e",
      level: "M",
    }),
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Offer Letter - ${data.candidateName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: 'Times New Roman', Times, serif;
      color: #111111;
    }
    .wrapper {
      position: relative;
      width: 210mm;
      height: 297mm;
      max-width: 210mm;
      max-height: 297mm;
      overflow: hidden;
      background: #ffffff;
      padding: 40px 50px;
      display: flex;
      flex-direction: column;
    }
    .outer-border {
      position: absolute;
      inset: 12px;
      border: 2px solid #1a237e;
      pointer-events: none;
    }
    .inner-border {
      position: absolute;
      inset: 16px;
      border: 1px solid #1a237e;
      pointer-events: none;
    }
    .header {
      text-align: center;
      margin-bottom: 6px;
    }
    .header-brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 4px;
    }
    .header-brand img {
      width: 52px;
      height: 52px;
      object-fit: contain;
    }
    .header-brand h1 {
      font-size: 21px;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
      letter-spacing: 0.8px;
      white-space: nowrap;
    }
    .header-sub {
      font-size: 11px;
      color: #555555;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .divider-top {
      border: none;
      border-top: 2px solid #1a237e;
      margin: 8px 0 0 0;
    }
    .divider-bottom {
      border: none;
      border-top: 1px solid #1a237e;
      margin: 3px 0 0 0;
    }
    .title-sec {
      text-align: center;
      margin-top: 14px;
      margin-bottom: 4px;
    }
    .title-sec h2 {
      font-size: 18px;
      font-weight: 700;
      color: #1a237e;
      margin: 4px 0 0 0;
      letter-spacing: 1.5px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 20px;
      font-size: 14px;
    }
    .to-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 20px;
      gap: 20px;
    }
    .candidate-details {
      flex: 1;
      font-size: 14px;
      line-height: 2.1;
    }
    .underline-field {
      display: inline-block;
      width: 380px;
      border-bottom: 1px dotted #555555;
      font-weight: 600;
      color: #000000;
    }
    .photo-box {
      width: 115px;
      height: 145px;
      border: 1.5px solid #333333;
      flex-shrink: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
    }
    .photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .letter-body {
      margin-top: 28px;
      font-size: 14.5px;
      line-height: 1.85;
    }
    .footer {
      margin-top: auto;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .sig-container {
      position: relative;
      height: 90px;
      width: 320px;
      margin-bottom: 4px;
    }
    .sig-stamp {
      position: absolute;
      bottom: 15px;
      left: 30px;
      width: 135px;
      height: 135px;
      z-index: 1;
      opacity: 0.9;
      mix-blend-mode: multiply;
    }
    .sig-signature {
      position: absolute;
      bottom: 15px;
      left: 0px;
      width: 195px;
      height: 85px;
      z-index: 2;
      mix-blend-mode: multiply;
    }
    .qr-container {
      text-align: center;
      margin-bottom: 4px;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="outer-border"></div>
    <div class="inner-border"></div>

    <div class="header">
      <div class="header-brand">
        <img src="${LOGO_BASE64}" alt="Vaastman Logo" />
        <h1>VAASTMAN SOLUTIONS PVT. LTD.</h1>
      </div>
      <p class="header-sub">Registered Office: Patna, Bihar | CIN: U72900BR2024PTC00000</p>
      <hr class="divider-top" />
      <hr class="divider-bottom" />
    </div>

    <div class="title-sec">
      <h2>INTERNSHIP ACCEPTANCE LETTER</h2>
    </div>

    <div class="meta-row">
      <p style="margin: 0;">
        <strong>Letter No. :</strong>
        <span style="color: #b71c1c; font-weight: 700;">${data.letterNo}</span>
      </p>
      <p style="margin: 0;">
        <strong>Date:</strong> ${data.date}
      </p>
    </div>

    <div class="to-section">
      <div class="candidate-details">
        <p style="margin: 0 0 4px 0; font-weight: 600;">To</p>
        <p style="margin: 0;">
          <span class="underline-field">${data.candidateName}</span>
        </p>
        <p style="margin: 0;">
          <span class="underline-field">${data.collegeName}</span>
        </p>
        <p style="margin: 0;">
          <span class="underline-field">${data.domainOrMainSubject || "Vocational / Technical Internship"}</span>
        </p>
        <p style="margin: 0;">
          <span class="underline-field">${data.universityRoll ? `Roll No: ${data.universityRoll}` : data.universityName || ""}</span>
        </p>
      </div>

      <div class="photo-box">
        ${
          data.profilePhoto
            ? `<img src="${data.profilePhoto}" alt="Candidate Photo" />`
            : `<span style="font-size: 10px; color: #888; text-align: center; padding: 6px; line-height: 1.3;">Passport Size Photo of Student</span>`
        }
      </div>
    </div>

    <div class="letter-body">
      <p style="margin: 0 0 16px 0; font-style: italic;">
        Dear Candidate,
      </p>
      <p style="margin: 0 0 16px 0; text-align: justify;">
        We are pleased to accept your application and offer you internship
        at our organization. Our organizations satisfy all the requirements
        as provided in the Internship Guidelines of University for
        Undergraduate Programs.
      </p>
      <p style="margin: 0 0 16px 0;">
        We appreciate your interest in our organization.
      </p>
      <p style="margin: 0; font-weight: 600;">Thank you.</p>
    </div>

    <div class="footer">
      <div>
        <div class="sig-container">
          <img class="sig-stamp" src="${STAMP_BASE64}" alt="Stamp" />
          <img class="sig-signature" src="${SIGNATURE_BASE64}" alt="Signature" />
        </div>
        <p style="font-size: 13px; font-weight: 700; margin: 0;">Supervisor/Head IPO</p>
        <p style="font-size: 12px; color: #555555; margin: 2px 0 0 0;">(Signature and seal)</p>
      </div>

      <div class="qr-container">
        ${qrSvg}
        <p style="font-size: 10px; color: #555555; margin: 4px 0 0 0; font-weight: 600;">Join WhatsApp</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
