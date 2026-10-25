import fs from "fs";
import path from "path";

const sitemapPath = path.resolve("out", "sitemap.xml");
const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
const urls = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

console.log(`=== 1. Verifying Live Production Endpoints (${urls.length} Sitemap URLs) ===`);

const testEndpoints = [
  "https://netpayscale.uk/sitemap.xml",
  "https://netpayscale.uk/bands/band-5/",
  "https://netpayscale.uk/bands/band-6/",
  "https://netpayscale.uk/maternity-pay-calculator/",
  "https://netpayscale.uk/annual-leave-calculator/",
  "https://netpayscale.uk/bank-shift-calculator/",
  "https://netpayscale.uk/calculator/band-5-nurse-salary-inner-london/",
];

for (const ep of testEndpoints) {
  const res = await fetch(ep, { redirect: "manual" });
  const body = await res.text();
  if (ep.endsWith("sitemap.xml")) {
    const liveLocs = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    console.log(`[HTTP ${res.status}] ${ep} -> Live Sitemap URL Count: ${liveLocs.length}`);
  } else {
    const canMatch =
      body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) ||
      body.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
    console.log(`[HTTP ${res.status}] ${ep} -> Canonical: ${canMatch ? canMatch[1] : "NONE"}`);
  }
}

console.log(`\n=== 2. Pushing All ${urls.length} URLs to Bing / DuckDuckGo / ChatGPT IndexNow ===`);
const indexNowPayload = {
  host: "netpayscale.uk",
  key: "7b9e4a2c8d1f5e3a6b0c9d8e7f6a5b4c",
  keyLocation: "https://netpayscale.uk/7b9e4a2c8d1f5e3a6b0c9d8e7f6a5b4c.txt",
  urlList: urls,
};

const indexNowRes = await fetch("https://www.bing.com/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(indexNowPayload),
});
console.log(`Bing IndexNow API Response: HTTP ${indexNowRes.status} (${indexNowRes.statusText})`);
