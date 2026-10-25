import fs from "fs";
import path from "path";
import crypto from "crypto";

const keyPath = path.resolve("nhspayscale-gsc-2f1e6db0dd83.json");
const keyData = JSON.parse(fs.readFileSync(keyPath, "utf8"));

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: keyData.client_email,
    scope: "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly",
    aud: keyData.token_uri || "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaims = base64UrlEncode(JSON.stringify(claims));
  const signatureInput = `${encodedHeader}.${encodedClaims}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signatureInput);
  signer.end();
  const signature = signer.sign(keyData.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch(keyData.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

const testUrls = [
  "https://netpayscale.uk/calculator/band-5-nurse-salary-inner-london/",
  "https://netpayscale.uk/calculator/band-6-senior-paramedic-salary-scotland/",
  "https://netpayscale.uk/calculator/band-2-healthcare-assistant-salary-birmingham/",
  "https://netpayscale.uk/calculator/band-7-clinical-manager-salary-manchester/"
];

async function main() {
  const token = await getAccessToken();
  console.log("=== Inspecting Sample pSEO URLs in GSC ===");

  for (const url of testUrls) {
    try {
      const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl: "sc-domain:netpayscale.uk",
        }),
      });

      const data = await res.json();
      const result = data.inspectionResult?.indexStatusResult;
      console.log(`\nURL: ${url}`);
      console.log(`Verdict: ${result?.verdict || "UNKNOWN"}`);
      console.log(`Coverage: ${result?.coverageState || "Not indexed yet (Queued in sitemap)"}`);
      console.log(`Robots: ${result?.robotsTxtState || "N/A"}`);
      console.log(`Google Canonical: ${result?.googleCanonical || "Pending crawl"}`);
    } catch (e) {
      console.error(`Error inspecting ${url}:`, e.message);
    }
  }
}

main();
