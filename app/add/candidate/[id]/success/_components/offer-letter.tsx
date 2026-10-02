"use client";

import { Noto_Serif } from "next/font/google";
import { QRCodeSVG } from "qrcode.react";
import type { OfferLetterData } from "../lib/actions";
import {
  LOGO_BASE64,
  SIGNATURE_BASE64,
  STAMP_BASE64,
} from "./offer-letter-assets";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type OfferLetterProps = {
  data: OfferLetterData;
};

const QR_URL = "https://whatsapp.com/channel/0029Vb8nx3lLdQea0Kp4Hl2a";

export function OfferLetter({ data }: OfferLetterProps) {
  return (
    <div
      className="offer-letter-wrapper"
      style={{
        position: "relative",
        width: "794px",
        height: "1123px",
        overflow: "hidden",
        fontFamily: notoSerif.style.fontFamily,
        background: "#fff",
        color: "#111",
      }}
    >
      {/* Page border */}
      <div
        style={{
          position: "absolute",
          inset: "16px",
          border: "2px solid #1a237e",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "20px",
          border: "1px solid #1a237e",
          pointerEvents: "none",
        }}
      />

      {/* Content area */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "50px 60px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header — Organization letterhead */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              marginBottom: "4px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_BASE64}
              alt="Vaastman Logo"
              width={56}
              height={56}
              loading="eager"
              decoding="sync"
              style={{
                objectFit: "contain",
                width: "56px",
                height: "56px",
                flexShrink: 0,
              }}
            />
            <h1
              style={{
                fontSize: "21px",
                fontWeight: 700,
                color: "#1a237e",
                margin: 0,
                letterSpacing: "0.8px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              VAASTMAN SOLUTIONS PVT. LTD.
            </h1>
          </div>
          <p
            style={{
              fontSize: "11px",
              color: "#555",
              margin: 0,
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            Registered Office: Patna, Bihar | CIN: U72900BR2024PTC00000
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "2px solid #1a237e",
              margin: "10px 0 0 0",
            }}
          />
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #1a237e",
              margin: "3px 0 0 0",
            }}
          />
        </div>

        {/* ANNEXURE II heading */}
        <div
          style={{
            textAlign: "center",
            marginTop: "18px",
            marginBottom: "4px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1a237e",
              margin: "6px 0 0 0",
              letterSpacing: "1.5px",
              whiteSpace: "nowrap",
            }}
          >
            INTERNSHIP ACCEPTANCE LETTER
          </h2>
        </div>

        {/* Letter No. and Date row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "24px",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Letter No. :</strong>{" "}
            <span style={{ color: "#b71c1c" }}>{data.letterNo}</span>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Date:</strong> {data.date}
          </p>
        </div>

        {/* To section with photo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "24px",
            gap: "20px",
          }}
        >
          {/* Candidate details */}
          <div style={{ flex: 1, fontSize: "14px", lineHeight: 2.2 }}>
            <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>To</p>
            <p style={{ margin: 0 }}>
              <span
                style={{
                  display: "inline-block",
                  width: "400px",
                  borderBottom: "1px dotted #555",
                }}
              >
                {data.candidateName}
              </span>
            </p>
            <p style={{ margin: 0 }}>
              <span
                style={{
                  display: "inline-block",
                  width: "400px",
                  borderBottom: "1px dotted #555",
                }}
              >
                {data.collegeName}
              </span>
            </p>
            <p style={{ margin: 0 }}>
              <span
                style={{
                  display: "inline-block",
                  width: "400px",
                  borderBottom: "1px dotted #555",
                }}
              >
                {data.domainOrMainSubject}
              </span>
            </p>
            <p style={{ margin: 0 }}>
              <span
                style={{
                  display: "inline-block",
                  width: "400px",
                  borderBottom: "1px dotted #555",
                }}
              >
                {data.universityRoll}
              </span>
            </p>
          </div>

          {/* Passport size photo */}
          <div
            style={{
              width: "120px",
              height: "150px",
              border: "1.5px solid #333",
              flexShrink: 0,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fafafa",
            }}
          >
            {data.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.profilePhoto}
                alt="Candidate Photo"
                width={120}
                height={150}
                loading="eager"
                crossOrigin="anonymous"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <span
                style={{
                  fontSize: "10px",
                  color: "#888",
                  textAlign: "center",
                  padding: "8px",
                  lineHeight: 1.4,
                }}
              >
                Passport Size Photo of The Student
              </span>
            )}
          </div>
        </div>

        {/* Letter body */}
        <div
          style={{
            marginTop: "36px",
            fontSize: "14.5px",
            lineHeight: 1.9,
          }}
        >
          <p style={{ margin: "0 0 20px 0", fontStyle: "italic" }}>
            Dear Candidate,
          </p>
          <p style={{ margin: "0 0 20px 0", textAlign: "justify" }}>
            We are pleased to accept your application and offer you internship
            at our organization. Our organizations satisfy all the requirements
            as provided in the Internship Guidelines of University for
            Undergraduate Programs.
          </p>
          <p style={{ margin: "0 0 20px 0" }}>
            We appreciate your interest in our organization.
          </p>
          <p style={{ margin: "0", fontWeight: 600 }}>Thank you.</p>
        </div>

        {/* Signature, stamp and QR section */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Left — Signature + Stamp + Label */}
          <div>
            {/* Signature and stamp container */}
            <div
              style={{
                position: "relative",
                height: "90px",
                width: "340px",
                marginBottom: "4px",
              }}
            >
              {/* Stamp — placed below signature with multiply blend */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={STAMP_BASE64}
                alt="Company Stamp"
                width={140}
                height={140}
                loading="eager"
                decoding="sync"
                style={{
                  objectFit: "contain",
                  opacity: 0.9,
                  position: "absolute",
                  bottom: "20px",
                  left: "30px",
                  width: "140px",
                  height: "140px",
                  zIndex: 1,
                  mixBlendMode: "multiply",
                }}
              />

              {/* Signature — high opacity ink on top */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SIGNATURE_BASE64}
                alt="Supervisor Signature"
                width={200}
                height={90}
                loading="eager"
                decoding="sync"
                style={{
                  objectFit: "contain",
                  position: "absolute",
                  bottom: "20px",
                  left: "0px",
                  width: "200px",
                  height: "90px",
                  zIndex: 2,
                  mixBlendMode: "multiply",
                }}
              />
            </div>

            {/* Label */}
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Supervisor/Head IPO
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#555",
                margin: "2px 0 0 0",
              }}
            >
              (Signature and seal)
            </p>
          </div>

          {/* Right — QR code */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "4px",
              marginRight: "10px",
            }}
          >
            <QRCodeSVG
              value={QR_URL}
              size={100}
              level="M"
              bgColor="transparent"
              fgColor="#1a237e"
            />
            <p
              style={{
                fontSize: "10px",
                color: "#555",
                marginTop: "4px",
                fontWeight: 600,
              }}
            >
              Join WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: scoped print styles
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 0;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .offer-letter-wrapper {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                page-break-after: avoid !important;
                page-break-inside: avoid !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
