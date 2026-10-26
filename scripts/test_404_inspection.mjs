import fs from "fs";
import path from "path";
import crypto from "crypto";

const keyPath = path.resolve("nhspayscale-gsc-2f1e6db0dd83.json");
const keyData = JSON.parse(fs.readFileSync(keyPath, "utf8"));

function b64(str) {
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
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const sigInput = `${b64(JSON.stringify(header))}.${b64(JSON.stringify(claims))}`;
  const signer = crypto.createSign("RSA-SHA256").update(sigInput);
  const sig = signer.sign(keyData.private_key, "base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${sigInput}.${sig}`,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  const testUrls = [
    "https://netpayscale.uk/privacy-policy/",
    "https://netpayscale.uk/terms-of-service/",
    "https://netpayscale.uk/privacy-policy",
    "https://netpayscale.uk/terms-of-service",
    "https://netpayscale.uk/calculator/band-5-nurse-salary-uk-national/",
    "https://netpayscale.uk/calculator/band-6-midwife-salary-uk-national/",
    "https://netpayscale.uk/calculator/",
    "https://netpayscale.uk/bands/",
    "https://netpayscale.uk/calculator",
    "https://netpayscale.uk/bands",
    "https://netpayscale.uk/maternity-calculator/",
    "https://netpayscale.uk/annual-leave/",
    "https://netpayscale.uk/sick-pay/",
    "https://netpayscale.uk/pension/",
  ];

  for (const u of testUrls) {
    const r = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl: u, siteUrl: "sc-domain:netpayscale.uk" }),
    });
    const d = await r.json();
    const st = d.inspectionResult?.indexStatusResult;
    console.log(`${u} -> Verdict: ${st?.verdict} | Coverage: ${st?.coverageState} | CrawledAs: ${st?.crawledAs} | LastCrawl: ${st?.lastCrawlTime}`);
  }
}

main().catch(console.error);
