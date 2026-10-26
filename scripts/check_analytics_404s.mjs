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
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  const anaUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent("sc-domain:netpayscale.uk")}/searchAnalytics/query`;
  const aRes = await fetch(anaUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate: "2026-01-01",
      endDate: "2026-10-27",
      dimensions: ["page"],
      rowLimit: 500,
    }),
  });
  const aData = await aRes.json();
  console.log(`Found ${aData.rows?.length || 0} pages in Search Analytics:`);
  
  const notFoundList = [];
  const okList = [];

  for (const row of (aData.rows || [])) {
    const pageUrl = row.keys[0];
    try {
      const liveRes = await fetch(pageUrl, { method: "HEAD", redirect: "manual" });
      if (liveRes.status === 404) {
        notFoundList.push({ url: pageUrl, status: 404, impressions: row.impressions, clicks: row.clicks });
        console.log(`❌ [404 NOT FOUND] ${pageUrl} (Impressions: ${row.impressions})`);
      } else {
        okList.push({ url: pageUrl, status: liveRes.status });
      }
    } catch (err) {
      console.log(`Error fetching ${pageUrl}:`, err.message);
    }
  }

  console.log(`\nResults: ${okList.length} OK/Redirected, ${notFoundList.length} 404s in Search Analytics.`);
}

main().catch(console.error);
