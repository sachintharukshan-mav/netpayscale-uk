import fs from "fs";
import path from "path";
import React from "react";
import { ImageResponse } from "next/og.js";

const publicDir = path.resolve("public");

function createIconElement(size) {
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.64);
  const dotSize = Math.max(8, Math.round(size * 0.18));
  const dotOffset = Math.max(4, Math.round(size * 0.11));

  return React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #005EB8 0%, #003D78 100%)",
        borderRadius: `${radius}px`,
        position: "relative",
        color: "#FFFFFF",
        fontWeight: 800,
        fontSize: `${fontSize}px`,
        fontFamily: "sans-serif",
      },
    },
    React.createElement(
      "span",
      {
        style: {
          marginTop: `-${Math.round(size * 0.04)}px`,
          letterSpacing: "-0.04em",
        },
      },
      "£"
    ),
    React.createElement("div", {
      style: {
        position: "absolute",
        top: `${dotOffset}px`,
        right: `${dotOffset}px`,
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        borderRadius: "9999px",
        backgroundColor: "#10B981",
        border: `${Math.max(2, Math.round(size * 0.025))}px solid #003D78`,
      },
    })
  );
}

function createOgElement() {
  return React.createElement(
    "div",
    {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #090D16 0%, #0F172A 60%, #002F5F 100%)",
        padding: "56px 64px",
        color: "#FFFFFF",
        fontFamily: "sans-serif",
      },
    },
    // Left Column
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "640px",
        },
      },
      // Top Pill
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(16, 185, 129, 0.16)",
            border: "1px solid rgba(16, 185, 129, 0.45)",
            borderRadius: "9999px",
            padding: "8px 18px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#34D399",
            marginBottom: "24px",
            alignSelf: "flex-start",
          },
        },
        "2026/27 AGENDA FOR CHANGE VERIFIED (+3.3% UPLIFT)"
      ),
      // Main Headline
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            fontSize: "54px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
          },
        },
        React.createElement("span", null, "NHS Pay & Pension"),
        React.createElement(
          "span",
          { style: { color: "#38BDF8" } },
          "Take-Home Calculator"
        )
      ),
      // Subtitle
      React.createElement(
        "div",
        {
          style: {
            fontSize: "22px",
            color: "#CBD5E1",
            lineHeight: 1.45,
            marginBottom: "36px",
          },
        },
        "Instant net monthly pay for Bands 2–9 after PAYE tax, NI, 2015 CARE Pension tiers, London HCAS weighting & shift uplifts."
      ),
      // Bottom Brand Bar
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "16px",
          },
        },
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#005EB8",
              fontSize: "28px",
              fontWeight: 800,
              color: "#FFFFFF",
            },
          },
          "£"
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
            },
          },
          React.createElement(
            "span",
            { style: { fontSize: "22px", fontWeight: 700, color: "#FFFFFF" } },
            "netpayscale.uk"
          ),
          React.createElement(
            "span",
            { style: { fontSize: "15px", color: "#94A3B8" } },
            "490+ UK Trust & Regional Salary Models • Official ESR Payslip Replica"
          )
        )
      )
    ),
    // Right Column: Visual Payslip Ledger Card
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "400px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "32px",
          color: "#09090B",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.55)",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E4E4E7",
            paddingBottom: "14px",
            marginBottom: "18px",
          },
        },
        React.createElement(
          "span",
          { style: { fontSize: "16px", fontWeight: 700, color: "#18181B" } },
          "Estimated Take-Home"
        ),
        React.createElement(
          "span",
          {
            style: {
              fontSize: "13px",
              fontWeight: 700,
              backgroundColor: "#EFF6FF",
              color: "#005EB8",
              padding: "4px 10px",
              borderRadius: "999px",
            },
          },
          "Band 5 • Step 2"
        )
      ),
      React.createElement(
        "span",
        {
          style: {
            fontSize: "13px",
            fontWeight: 700,
            color: "#71717A",
            textTransform: "uppercase",
          },
        },
        "Net Monthly In-Bank"
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "baseline",
            marginTop: "4px",
            marginBottom: "20px",
          },
        },
        React.createElement(
          "span",
          {
            style: {
              fontSize: "52px",
              fontWeight: 800,
              color: "#059669",
              letterSpacing: "-0.03em",
            },
          },
          "£2,184"
        ),
        React.createElement(
          "span",
          {
            style: {
              fontSize: "18px",
              fontWeight: 600,
              color: "#71717A",
              marginLeft: "8px",
            },
          },
          "/ mo"
        )
      ),
      // Bar
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            width: "100%",
            height: "14px",
            borderRadius: "999px",
            overflow: "hidden",
            marginBottom: "20px",
          },
        },
        React.createElement("div", {
          style: { width: "74%", height: "100%", backgroundColor: "#059669" },
        }),
        React.createElement("div", {
          style: { width: "10%", height: "100%", backgroundColor: "#4F46E5" },
        }),
        React.createElement("div", {
          style: { width: "11%", height: "100%", backgroundColor: "#E11D48" },
        }),
        React.createElement("div", {
          style: { width: "5%", height: "100%", backgroundColor: "#D97706" },
        })
      ),
      // Breakdown Rows
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "15px",
            borderTop: "1px solid #E4E4E7",
            paddingTop: "16px",
          },
        },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between" } },
          React.createElement("span", { style: { color: "#52525B" } }, "Gross AfC Salary"),
          React.createElement("span", { style: { fontWeight: 700 } }, "£34,581 / yr")
        ),
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between" } },
          React.createElement("span", { style: { color: "#52525B" } }, "NHS Pension (8.3%)"),
          React.createElement("span", { style: { fontWeight: 700, color: "#4F46E5" } }, "−£239 / mo")
        ),
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between" } },
          React.createElement("span", { style: { color: "#52525B" } }, "PAYE Tax & NI"),
          React.createElement("span", { style: { fontWeight: 700, color: "#E11D48" } }, "−£458 / mo")
        )
      )
    )
  );
}

/**
 * Wraps a PNG buffer into a standard single-image ICO container (supported by all modern browsers and Googlebot).
 */
function pngToIco(pngBuf, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(1, 4); // 1 image

  const dir = Buffer.alloc(16);
  dir.writeUInt8(width >= 256 ? 0 : width, 0);
  dir.writeUInt8(height >= 256 ? 0 : height, 1);
  dir.writeUInt8(0, 2); // Color palette
  dir.writeUInt8(0, 3); // Reserved
  dir.writeUInt16LE(1, 4); // Color planes
  dir.writeUInt16LE(32, 6); // Bits per pixel
  dir.writeUInt32LE(pngBuf.length, 8); // Image size
  dir.writeUInt32LE(22, 12); // Offset (6 + 16)

  return Buffer.concat([header, dir, pngBuf]);
}

async function run() {
  const sizes = [
    { name: "icon-48.png", size: 48 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
  ];

  for (const { name, size } of sizes) {
    const res = new ImageResponse(createIconElement(size), {
      width: size,
      height: size,
    });
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(publicDir, name), buf);
    console.log(`Generated ${name} (${buf.length} bytes)`);

    if (size === 48) {
      const icoBuf = pngToIco(buf, 48, 48);
      fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuf);
      console.log(`Generated favicon.ico (${icoBuf.length} bytes)`);
    }
  }

  const ogRes = new ImageResponse(createOgElement(), {
    width: 1200,
    height: 630,
  });
  const ogBuf = Buffer.from(await ogRes.arrayBuffer());
  fs.writeFileSync(path.join(publicDir, "og-image.png"), ogBuf);
  console.log(`Generated og-image.png (${ogBuf.length} bytes)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
