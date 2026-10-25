import fs from "fs";
import path from "path";
import crypto from "crypto";

const keyPath = path.resolve("nhspayscale-gsc-2f1e6db0dd83.json");

if (!fs.existsSync(keyPath)) {
  console.error("Service account JSON key not found at:", keyPath);
  process.exit(1);
}

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
  if (!res.ok) {
    throw new Error(`Token request failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function main() {
  console.log("=== 1. Authenticating with Google Search Console API ===");
  console.log(`Service Account: ${keyData.client_email}`);

  const token = await getAccessToken();
  console.log("✓ Google OAuth2 Access Token successfully acquired!");

  console.log("\n=== 2. Fetching Sites / Properties in GSC ===");
  const sitesRes = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const sitesData = await sitesRes.json();

  if (!sitesRes.ok) {
    console.error("Failed to list sites:", sitesData);
    return;
  }

  const siteEntries = sitesData.siteEntry || [];
  console.log(`Found ${siteEntries.length} site property(s) in GSC:`);
  for (const s of siteEntries) {
    console.log(` - ${s.siteUrl} (permissionLevel: ${s.permissionLevel})`);
  }

  // Check if netpayscale.uk or sc-domain:netpayscale.uk is registered
  const targetDomainProps = ["sc-domain:netpayscale.uk", "https://netpayscale.uk/"];
  let matchedProp = siteEntries.find((s) => targetDomainProps.includes(s.siteUrl));

  if (!matchedProp) {
    console.log("\n⚠️ Neither 'sc-domain:netpayscale.uk' nor 'https://netpayscale.uk/' was found in the sites list.");
    console.log("Attempting to add 'sc-domain:netpayscale.uk' or 'https://netpayscale.uk/' property...");
    
    // Attempt to add site property
    for (const prop of ["sc-domain:netpayscale.uk", "https://netpayscale.uk/"]) {
      try {
        const addRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(prop)}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`Add property '${prop}' response: HTTP ${addRes.status}`);
        if (addRes.ok) {
          matchedProp = { siteUrl: prop };
          break;
        }
      } catch (err) {
        console.log(`Could not add '${prop}':`, err.message);
      }
    }
  }

  if (matchedProp) {
    console.log(`\n=== 3. Checking / Submitting Sitemap for ${matchedProp.siteUrl} ===`);
    const sitemapUrl = "https://netpayscale.uk/sitemap.xml";
    const sitemapApiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      matchedProp.siteUrl
    )}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    const submitRes = await fetch(sitemapApiUrl, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Sitemap submission '${sitemapUrl}': HTTP ${submitRes.status}`);

    // List sitemaps
    const listSitemapsRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(matchedProp.siteUrl)}/sitemaps`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const sitemapsData = await listSitemapsRes.json();
    console.log("Current Sitemaps in GSC:", JSON.stringify(sitemapsData, null, 2));

    // Inspect URL
    console.log("\n=== 4. Testing URL Inspection API for https://netpayscale.uk/ ===");
    const inspectRes = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inspectionUrl: "https://netpayscale.uk/",
        siteUrl: matchedProp.siteUrl,
      }),
    });
    const inspectData = await inspectRes.json();
    console.log("Inspection Status:", JSON.stringify(inspectData, null, 2));
  } else {
    console.log("\nAction required:");
    console.log(`Please add '${keyData.client_email}' as a user (Owner or Full) in Google Search Console for 'netpayscale.uk'`);
  }
}

main().catch((err) => {
  console.error("GSC Client Error:", err);
});
