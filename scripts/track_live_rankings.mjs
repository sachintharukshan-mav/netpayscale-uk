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

  const input = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claims))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(input);
  signer.end();
  const sig = signer.sign(keyData.private_key, "base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const res = await fetch(keyData.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${input}.${sig}`,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function queryGsc(token, body) {
  const res = await fetch(
    "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Anetpayscale.uk/searchAnalytics/query",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return await res.json();
}

async function main() {
  console.log("=== Google Search Console Live Performance Telemetry ===");
  const token = await getAccessToken();

  // Search analytics query - Last 28 days (GSC data has 2-3 day lag)
  const today = new Date();
  const endDate = new Date(today.getTime() - 2 * 86400000).toISOString().slice(0, 10);
  const startDate = new Date(today.getTime() - 30 * 86400000).toISOString().slice(0, 10);

  console.log(`Date Range: ${startDate} to ${endDate}\n`);

  // 1. Overall Aggregates
  const totalData = await queryGsc(token, {
    startDate,
    endDate,
  });

  const totalRow = totalData.rows?.[0] || {};
  console.log("--- 28-Day Aggregate Performance ---");
  console.log(`Total Clicks:       ${totalRow.clicks ?? 0}`);
  console.log(`Total Impressions:  ${totalRow.impressions ?? 0}`);
  console.log(`Average CTR:        ${((totalRow.ctr ?? 0) * 100).toFixed(2)}%`);
  console.log(`Average Position:   ${(totalRow.position ?? 0).toFixed(1)}`);
  console.log("------------------------------------\n");

  // 2. Top Search Queries
  const queryData = await queryGsc(token, {
    startDate,
    endDate,
    dimensions: ["query"],
    rowLimit: 25,
  });

  console.log("--- Top Search Queries by Impressions / Clicks ---");
  if (!queryData.rows || queryData.rows.length === 0) {
    console.log("No query rows returned yet (Search Console data processing window or fresh domain).");
  } else {
    console.table(
      queryData.rows.map((r) => ({
        Query: r.keys[0],
        Clicks: r.clicks,
        Impressions: r.impressions,
        CTR: `${(r.ctr * 100).toFixed(1)}%`,
        AvgPos: r.position.toFixed(1),
      }))
    );
  }

  // 3. Top Landing Pages
  const pageData = await queryGsc(token, {
    startDate,
    endDate,
    dimensions: ["page"],
    rowLimit: 20,
  });

  console.log("\n--- Top Landing Pages ---");
  if (!pageData.rows || pageData.rows.length === 0) {
    console.log("No page rows returned yet.");
  } else {
    console.table(
      pageData.rows.map((r) => ({
        Page: r.keys[0].replace("https://netpayscale.uk", ""),
        Clicks: r.clicks,
        Impressions: r.impressions,
        CTR: `${(r.ctr * 100).toFixed(1)}%`,
        AvgPos: r.position.toFixed(1),
      }))
    );
  }

  // 4. Query Sitemaps Status in GSC
  console.log("\n--- Sitemaps Status in Google Search Console ---");
  const smListRes = await fetch(
    "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Anetpayscale.uk/sitemaps",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const smListData = await smListRes.json();
  const sitemaps = smListData.sitemap || [];
  console.table(
    sitemaps.map((s) => ({
      Path: s.path.replace("https://netpayscale.uk", ""),
      LastDownloaded: s.lastDownloaded ? s.lastDownloaded.slice(0, 10) : "Pending",
      Errors: s.errors ?? 0,
      Warnings: s.warnings ?? 0,
      Submitted: s.contents?.[0]?.submitted ?? "N/A",
      Indexed: s.contents?.[0]?.indexed ?? "N/A",
    }))
  );
}

main().catch(console.error);
