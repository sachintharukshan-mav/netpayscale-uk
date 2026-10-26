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
  const sitemapXml = fs.readFileSync(path.resolve("out", "sitemap.xml"), "utf8");
  const allUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  console.log(`Loaded ${allUrls.length} total canonical URLs from out/sitemap.xml.`);

  // 1. Push all 514 URLs to IndexNow (Bing, Yahoo, DuckDuckGo, ChatGPT Search)
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
  console.log(`IndexNow 514-URL Push: HTTP ${indexNowRes.status} (${indexNowRes.statusText})`);

  const token = await getAccessToken(
    "https://www.googleapis.com/auth/indexing https://www.googleapis.com/auth/webmasters"
  );

  // 2. Resubmit 514-URL Sitemap to Google Search Console
  const smRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      "sc-domain:netpayscale.uk"
    )}/sitemaps/${encodeURIComponent("https://netpayscale.uk/sitemap.xml")}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(`GSC Sitemap Resubmission: HTTP ${smRes.status}`);

  // 3. Select Top 100 High-Search-Volume URLs for Google Indexing API Push
  const priorityCalculators = [
    "https://netpayscale.uk/",
    "https://netpayscale.uk/pay-rise-backpay-calculator/",
    "https://netpayscale.uk/promotion-calculator/",
    "https://netpayscale.uk/redundancy-pay-calculator/",
    "https://netpayscale.uk/pension-calculator/",
    "https://netpayscale.uk/sick-pay-calculator/",
    "https://netpayscale.uk/maternity-pay-calculator/",
    "https://netpayscale.uk/annual-leave-calculator/",
    "https://netpayscale.uk/bank-shift-calculator/",
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
  ];

  // Pick top pSEO URLs prioritizing Band 5, Band 6, Band 4, Band 3, Band 2, Band 7 in Inner/Outer London, Scotland, Manchester, Birmingham, Leeds
  const highVolumePseo = allUrls
    .filter((u) => u.includes("/calculator/"))
    .filter(
      (u) =>
        u.includes("inner-london") ||
        u.includes("outer-london") ||
        u.includes("scotland") ||
        u.includes("manchester") ||
        u.includes("birmingham") ||
        u.includes("leeds") ||
        u.includes("wales")
    )
    .slice(0, 80);

  const batchList = [...new Set([...priorityCalculators, ...highVolumePseo])].slice(0, 100);
  console.log(`\nSubmitting ${batchList.length} Priority URLs to Google Indexing API...`);

  let successCount = 0;
  let quotaHit = false;

  for (const url of batchList) {
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
    if (pubRes.status === 200) {
      successCount++;
      if (successCount <= 12 || successCount % 20 === 0) {
        console.log(`✓ [${successCount}/${batchList.length}] Queued: ${url}`);
      }
    } else if (pubRes.status === 429) {
      console.log(`! Daily Google Indexing API quota reached after ${successCount} URLs.`);
      quotaHit = true;
      break;
    } else {
      const errText = await pubRes.text();
      console.log(`! Status ${pubRes.status} on ${url}: ${errText.slice(0, 120)}`);
    }
  }

  console.log(
    `\n=== Batch Indexing Summary: ${successCount} URLs accepted by Google Indexing API (Quota limit hit: ${quotaHit}) ===`
  );
}

main().catch((err) => console.error(err));
