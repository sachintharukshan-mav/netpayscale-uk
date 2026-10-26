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

async function inspectUrl(url, token, siteUrl = "sc-domain:netpayscale.uk") {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inspectionUrl: url, siteUrl }),
  });
  if (!res.ok) {
    const errText = await res.text();
    return { url, error: `HTTP ${res.status}: ${errText}` };
  }
  const data = await res.json();
  const r = data.inspectionResult?.indexStatusResult || {};
  return {
    url,
    verdict: r.verdict || "UNKNOWN",
    coverageState: r.coverageState || "UNKNOWN",
    robotsTxtState: r.robotsTxtState,
    indexingState: r.indexingState,
    lastCrawlTime: r.lastCrawlTime || null,
    googleCanonical: r.googleCanonical || null,
    userCanonical: r.userCanonical || null,
  };
}

async function main() {
  console.log("=== 1. Checking GSC Sitemap & Analytics Data ===");
  const token = await getAccessToken();

  // 1. Check GSC Sitemap
  const sitemapApi = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent("sc-domain:netpayscale.uk")}/sitemaps/${encodeURIComponent("https://netpayscale.uk/sitemap.xml")}`;
  const smRes = await fetch(sitemapApi, { headers: { Authorization: `Bearer ${token}` } });
  if (smRes.ok) {
    const smData = await smRes.json();
    console.log("GSC Sitemap Report:");
    console.log(` - Path: ${smData.path}`);
    console.log(` - Last Downloaded by Googlebot: ${smData.lastDownloaded}`);
    console.log(` - Warnings: ${smData.warnings}`);
    console.log(` - Errors: ${smData.errors}`);
    if (smData.contents) {
      console.log(" - Contents:", JSON.stringify(smData.contents));
    }
  } else {
    console.log(`Sitemap fetch HTTP status: ${smRes.status}`);
  }

  // 2. Search Analytics
  const analyticsApi = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent("sc-domain:netpayscale.uk")}/searchAnalytics/query`;
  const anaRes = await fetch(analyticsApi, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: "2026-01-01",
      endDate: "2026-10-27",
      dimensions: ["page"],
      rowLimit: 25,
    }),
  });
  if (anaRes.ok) {
    const anaData = await anaRes.json();
    console.log("\nPages with Search Impressions / Clicks:");
    if (anaData.rows && anaData.rows.length > 0) {
      for (const row of anaData.rows) {
        console.log(` - ${row.keys[0]} | Clicks: ${row.clicks} | Impressions: ${row.impressions} | Position: ${row.position.toFixed(1)}`);
      }
    } else {
      console.log(" - No search analytics rows returned yet (fresh domain / 3-day data latency in GSC UI).");
    }
  }

  // 3. Structured Survey of URLs across categories
  console.log("\n=== 2. Surveying URLs with GSC URL Inspection API ===");

  const sitemapXml = fs.readFileSync(path.resolve("out", "sitemap.xml"), "utf8");
  const allUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  console.log(`Total URLs in sitemap: ${allUrls.length}`);

  // Build a representative batch:
  // - Homepage (1)
  // - 8 Specialist Calculators (8)
  // - 11 Band Hubs (11)
  // - 4 Trust Pages (4)
  // - 30 sample pSEO pages across different bands & regions
  const coreUrls = [
    "https://netpayscale.uk/",
    "https://netpayscale.uk/pension-calculator/",
    "https://netpayscale.uk/sick-pay-calculator/",
    "https://netpayscale.uk/maternity-pay-calculator/",
    "https://netpayscale.uk/annual-leave-calculator/",
    "https://netpayscale.uk/bank-shift-calculator/",
    "https://netpayscale.uk/pay-rise-backpay-calculator/",
    "https://netpayscale.uk/promotion-calculator/",
    "https://netpayscale.uk/redundancy-pay-calculator/",
    "https://netpayscale.uk/bands/band-2/",
    "https://netpayscale.uk/bands/band-3/",
    "https://netpayscale.uk/bands/band-4/",
    "https://netpayscale.uk/bands/band-5/",
    "https://netpayscale.uk/bands/band-6/",
    "https://netpayscale.uk/bands/band-7/",
    "https://netpayscale.uk/bands/band-8a/",
    "https://netpayscale.uk/bands/band-8b/",
    "https://netpayscale.uk/bands/band-8c/",
    "https://netpayscale.uk/bands/band-8d/",
    "https://netpayscale.uk/bands/band-9/",
    "https://netpayscale.uk/about/",
    "https://netpayscale.uk/privacy/",
    "https://netpayscale.uk/terms/",
    "https://netpayscale.uk/contact/",
  ];

  // Pick sample pSEO pages across bands (2 through 8d) and diverse regions
  const samplePseo = [
    "https://netpayscale.uk/calculator/band-5-nurse-salary-inner-london/",
    "https://netpayscale.uk/calculator/band-5-nurse-salary-outer-london/",
    "https://netpayscale.uk/calculator/band-5-nurse-salary-fringe/",
    "https://netpayscale.uk/calculator/band-5-nurse-salary-birmingham/",
    "https://netpayscale.uk/calculator/band-5-nurse-salary-manchester/",
    "https://netpayscale.uk/calculator/band-5-nurse-salary-scotland/",
    "https://netpayscale.uk/calculator/band-6-senior-paramedic-salary-scotland/",
    "https://netpayscale.uk/calculator/band-6-midwife-salary-inner-london/",
    "https://netpayscale.uk/calculator/band-6-physiotherapist-salary-leeds/",
    "https://netpayscale.uk/calculator/band-2-healthcare-assistant-salary-birmingham/",
    "https://netpayscale.uk/calculator/band-2-healthcare-assistant-salary-inner-london/",
    "https://netpayscale.uk/calculator/band-3-senior-healthcare-assistant-salary-scotland/",
    "https://netpayscale.uk/calculator/band-3-emergency-care-assistant-salary-outer-london/",
    "https://netpayscale.uk/calculator/band-4-assistant-practitioner-salary-scotland/",
    "https://netpayscale.uk/calculator/band-4-pharmacy-technician-salary-sheffield/",
    "https://netpayscale.uk/calculator/band-7-clinical-manager-salary-manchester/",
    "https://netpayscale.uk/calculator/band-7-ward-manager-salary-inner-london/",
    "https://netpayscale.uk/calculator/band-7-advanced-paramedic-salary-wales/",
    "https://netpayscale.uk/calculator/band-8a-matron-salary-inner-london/",
    "https://netpayscale.uk/calculator/band-8a-clinical-psychologist-salary-bristol/",
    "https://netpayscale.uk/calculator/band-8b-principal-biochemist-salary-newcastle/",
    "https://netpayscale.uk/calculator/band-8c-head-of-nursing-salary-inner-london/",
    "https://netpayscale.uk/calculator/band-8d-consultant-clinical-scientist-salary-birmingham/",
  ];

  const surveyList = [...coreUrls, ...samplePseo];
  console.log(`Inspecting ${surveyList.length} total URLs across all templates and regions...\n`);

  const results = {
    indexed: [],
    discoveredNotIndexed: [],
    crawledNotIndexed: [],
    other: [],
    errors: [],
  };

  for (let i = 0; i < surveyList.length; i++) {
    const url = surveyList[i];
    const res = await inspectUrl(url, token);
    if (res.error) {
      results.errors.push(res);
      console.log(`[ERR ${i + 1}/${surveyList.length}] ${url} -> ${res.error}`);
    } else {
      const isPass = res.verdict === "PASS";
      const isIndexed = res.coverageState?.toLowerCase().includes("indexed") && !res.coverageState?.toLowerCase().includes("not indexed");
      const shortUrl = url.replace("https://netpayscale.uk", "");

      if (isIndexed || isPass) {
        results.indexed.push(res);
        console.log(`✓ [INDEXED ${i + 1}/${surveyList.length}] ${shortUrl} (${res.coverageState} | LastCrawl: ${res.lastCrawlTime?.slice(0, 10) || "N/A"})`);
      } else if (res.coverageState === "Discovered - currently not indexed") {
        results.discoveredNotIndexed.push(res);
        console.log(`⏳ [DISCOVERED ${i + 1}/${surveyList.length}] ${shortUrl} (Queued in Google crawl queue)`);
      } else if (res.coverageState === "Crawled - currently not indexed") {
        results.crawledNotIndexed.push(res);
        console.log(`⚠️ [CRAWLED BUT NOT INDEXED ${i + 1}/${surveyList.length}] ${shortUrl}`);
      } else {
        results.other.push(res);
        console.log(`? [OTHER ${i + 1}/${surveyList.length}] ${shortUrl} (${res.coverageState})`);
      }
    }
    // Small delay to respect rate limit
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log("\n=======================================================");
  console.log("             GSC INDEXING STATUS REPORT                ");
  console.log("=======================================================");
  console.log(`Total URLs Inspected: ${surveyList.length}`);
  console.log(`✅ Indexed (PASS): ${results.indexed.length}`);
  console.log(`⏳ Discovered - currently not indexed (In Crawl Queue): ${results.discoveredNotIndexed.length}`);
  console.log(`⚠️ Crawled - currently not indexed: ${results.crawledNotIndexed.length}`);
  console.log(`❓ Other / Pending: ${results.other.length}`);
  console.log(`❌ API Errors: ${results.errors.length}`);
  console.log("=======================================================\n");

  if (results.discoveredNotIndexed.length > 0) {
    console.log("--- Non-Indexed Pages: Discovered - Currently Not Indexed ---");
    for (const r of results.discoveredNotIndexed) {
      console.log(` - ${r.url}`);
    }
  }

  if (results.crawledNotIndexed.length > 0) {
    console.log("\n--- Non-Indexed Pages: Crawled - Currently Not Indexed ---");
    for (const r of results.crawledNotIndexed) {
      console.log(` - ${r.url}`);
    }
  }

  if (results.other.length > 0) {
    console.log("\n--- Non-Indexed Pages: Other Coverage State ---");
    for (const r of results.other) {
      console.log(` - ${r.url} -> ${r.coverageState}`);
    }
  }
}

main().catch(console.error);
