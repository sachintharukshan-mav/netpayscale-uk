import fs from "fs";
import path from "path";
import crypto from "crypto";

const keyPath = path.resolve("nhspayscale-gsc-2f1e6db0dd83.json");
const keyData = JSON.parse(fs.readFileSync(keyPath, "utf8"));

const NEW_PRIORITY_URLS = [
  "https://netpayscale.uk/pension-calculator/",
  "https://netpayscale.uk/sick-pay-calculator/",
  "https://netpayscale.uk/bands/band-8b/",
  "https://netpayscale.uk/bands/band-8c/",
  "https://netpayscale.uk/bands/band-8d/",
  "https://netpayscale.uk/bands/band-9/",
];

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: keyData.client_email,
    scope: scopes,
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
  if (!res.ok) {
    throw new Error(`Token error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function main() {
  console.log("=== 1. Verifying Live Production Endpoints (511 Sitemap URLs) ===");
  for (const url of [
    "https://netpayscale.uk/sitemap.xml",
    "https://netpayscale.uk/pension-calculator/",
    "https://netpayscale.uk/sick-pay-calculator/",
  ]) {
    const r = await fetch(url, { redirect: "manual" });
    const text = await r.text();
    if (url.endsWith("sitemap.xml")) {
      const locs = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
      console.log(`[HTTP ${r.status}] ${url} -> Live Sitemap URLs: ${locs.length}`);
    } else {
      const can =
        text.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) ||
        text.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
      console.log(`[HTTP ${r.status}] ${url} -> Canonical: ${can ? can[1] : "NONE"}`);
    }
  }

  console.log("\n=== 2. Pushing All 511 URLs to IndexNow (Bing, DuckDuckGo, Yahoo, ChatGPT) ===");
  const sitemapXml = fs.readFileSync(path.resolve("out", "sitemap.xml"), "utf8");
  const allUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "netpayscale.uk",
      key: "7b9e4a2c8d1f5e3a6b0c9d8e7f6a5b4c",
      keyLocation: "https://netpayscale.uk/7b9e4a2c8d1f5e3a6b0c9d8e7f6a5b4c.txt",
      urlList: allUrls,
    }),
  });
  console.log(`IndexNow 511-URL Push Status: HTTP ${indexNowRes.status} (${indexNowRes.statusText})\n`);

  const token = await getAccessToken(
    "https://www.googleapis.com/auth/indexing https://www.googleapis.com/auth/webmasters"
  );

  console.log("=== 3. Resubmitting 511-URL Sitemap to Google Search Console ===");
  const smRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      "sc-domain:netpayscale.uk"
    )}/sitemaps/${encodeURIComponent("https://netpayscale.uk/sitemap.xml")}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(`GSC Sitemap Submission Status: HTTP ${smRes.status}\n`);

  console.log("=== 4. Requesting Google Indexing API (urlNotifications:publish) for New Calculators & Hubs ===");
  for (const url of NEW_PRIORITY_URLS) {
    const pubRes = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        type: "URL_UPDATED",
      }),
    });
    const pubData = await pubRes.json();
    console.log(
      `✓ [INDEXING API ${pubRes.status}] ${url} -> ${
        pubData.urlNotificationMetadata?.latestUpdate?.notifyTime || "Queued"
      }`
    );
  }

  console.log("\n=== 5. Inspecting New URLs via Google Search Console URL Inspection API ===");
  for (const url of NEW_PRIORITY_URLS) {
    const inspectRes = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
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
    const inspectData = await inspectRes.json();
    const resObj = inspectData.inspectionResult?.indexStatusResult || {};
    const uiLink = inspectData.inspectionResult?.inspectionResultLink || "";
    console.log(
      `- ${url}\n  Status: ${resObj.coverageState || "Unknown"} | Verdict: ${resObj.verdict || "N/A"} | Direct GSC Link: ${uiLink}`
    );
  }
}

main().catch((err) => console.error(err));
