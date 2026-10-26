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

  const signatureInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(claims)
  )}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signatureInput);
  signer.end();
  const signature = signer
    .sign(keyData.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const res = await fetch(keyData.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signatureInput}.${signature}`,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  for (const p of ["sc-domain:netpayscale.uk", "https://netpayscale.uk/"]) {
    console.log(`\n=== Checking property: ${p} ===`);

    // 1. urlCrawlErrorsCounts
    const countsUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(p)}/urlCrawlErrorsCounts`;
    const cRes = await fetch(countsUrl, { headers: { Authorization: `Bearer ${token}` } });
    console.log(`Crawl Errors Counts: HTTP ${cRes.status}`);
    if (cRes.ok) {
      console.log(JSON.stringify(await cRes.json(), null, 2));
    }

    // 2. urlCrawlErrorsSamples
    const samplesUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(p)}/urlCrawlErrorsSamples?category=notFound&platform=web`;
    const sRes = await fetch(samplesUrl, { headers: { Authorization: `Bearer ${token}` } });
    console.log(`404 Samples: HTTP ${sRes.status}`);
    if (sRes.ok) {
      const sData = await sRes.json();
      console.log(JSON.stringify(sData, null, 2));
    }

    // 3. Search Analytics querying for 404s or landing pages
    const anaUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(p)}/searchAnalytics/query`;
    const aRes = await fetch(anaUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: "2026-01-01",
        endDate: "2026-10-27",
        dimensions: ["page"],
        rowLimit: 100,
      }),
    });
    if (aRes.ok) {
      const aData = await aRes.json();
      console.log(`Search Analytics Pages count: ${aData.rows?.length || 0}`);
    }
  }
}

main().catch(console.error);
