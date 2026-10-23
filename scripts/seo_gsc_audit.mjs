import fs from 'fs';
import path from 'path';

const outDir = path.resolve('out');

console.log('=== RUNNING COMPREHENSIVE SEO / AEO / GSC AUDIT ===\n');

let errors = 0;
let warnings = 0;
let passed = 0;

function assert(condition, message, isWarning = false) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else if (isWarning) {
    warnings++;
    console.warn(`[WARN] ${message}`);
  } else {
    errors++;
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Robots.txt check
const robotsPath = path.join(outDir, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists in static export');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(robotsContent.includes('User-Agent: *') || robotsContent.includes('User-agent: *'), 'robots.txt specifies User-agent: *');
assert(robotsContent.includes('Allow: /'), 'robots.txt specifies Allow: /');
assert(robotsContent.includes('Sitemap: https://netpayscale.uk/sitemap.xml'), 'robots.txt references absolute canonical sitemap.xml');

// 2. Sitemap.xml check
const sitemapPath = path.join(outDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists in static export');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Parse loc tags
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
console.log(`Found ${locMatches.length} URLs in sitemap.xml`);

assert(locMatches.length >= 495, `Sitemap contains 495+ URLs (actual: ${locMatches.length})`);
assert(locMatches[0] === 'https://netpayscale.uk/', `Homepage in sitemap is exact canonical: https://netpayscale.uk/ (actual: ${locMatches[0]})`);

let nonTrailingSlashCount = 0;
let invalidHostCount = 0;

for (const url of locMatches) {
  if (!url.startsWith('https://netpayscale.uk')) invalidHostCount++;
  if (!url.endsWith('/')) nonTrailingSlashCount++;
}

assert(invalidHostCount === 0, `All sitemap URLs use https://netpayscale.uk (invalid: ${invalidHostCount})`);
assert(nonTrailingSlashCount === 0, `All sitemap URLs end with trailing slash to prevent 308 redirects (non-compliant: ${nonTrailingSlashCount})`);

// 3. Homepage HTML Audit (Canonical, Meta, Schema)
const homePath = path.join(outDir, 'index.html');
assert(fs.existsSync(homePath), 'index.html exists in static export');
const homeHtml = fs.readFileSync(homePath, 'utf8');

const homeCanonical = homeHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || homeHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
assert(homeCanonical && homeCanonical[1] === 'https://netpayscale.uk/', `Homepage canonical is exactly https://netpayscale.uk/ (actual: ${homeCanonical ? homeCanonical[1] : 'NONE'})`);

assert(homeHtml.includes('"@type":"WebSite"'), 'Homepage contains WebSite schema');
assert(homeHtml.includes('"@type":"WebApplication"'), 'Homepage contains WebApplication schema');
assert(homeHtml.includes('"@type":"FAQPage"'), 'Homepage contains FAQPage schema');
assert(fs.existsSync(path.join(outDir, 'favicon.ico')), 'favicon.ico exists in static export');
assert(fs.existsSync(path.join(outDir, 'icon.svg')), 'icon.svg exists in static export');
assert(fs.existsSync(path.join(outDir, 'icon-48.png')), 'icon-48.png (48x48 Google SERP icon) exists in static export');
assert(fs.existsSync(path.join(outDir, 'apple-touch-icon.png')), 'apple-touch-icon.png exists in static export');
assert(fs.existsSync(path.join(outDir, 'og-image.png')), 'og-image.png (1200x630 social preview) exists in static export');
assert(homeHtml.includes('https://netpayscale.uk/og-image.png'), 'Homepage references https://netpayscale.uk/og-image.png');

// 3B. Mandatory Legal & Trust Pages for Google AdSense & Quality Standards
const trustPages = ['about', 'privacy', 'terms', 'contact'];
for (const p of trustPages) {
  const pPath = path.join(outDir, p, 'index.html');
  assert(fs.existsSync(pPath), `Trust page exists: /${p}/index.html`);
  if (fs.existsSync(pPath)) {
    const pHtml = fs.readFileSync(pPath, 'utf8');
    const expectedCanonical = `https://netpayscale.uk/${p}/`;
    const canonicalMatch = pHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || pHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
    assert(canonicalMatch && canonicalMatch[1] === expectedCanonical, `Page /${p}/ has exact self-referential canonical (actual: ${canonicalMatch ? canonicalMatch[1] : 'NONE'})`);
  }
}

// 4. Sample pSEO Pages Audit (Canonical, OpenGraph, BreadcrumbList, Occupation, AEO Direct Answer)
const sampleSlugs = [
  'band-5-nurse-salary-inner-london',
  'band-6-senior-paramedic-salary-scotland',
  'band-7-clinical-manager-salary-manchester',
  'band-8a-matron-salary-inner-london',
  'band-2-healthcare-assistant-salary-birmingham'
];

for (const slug of sampleSlugs) {
  const pagePath = path.join(outDir, 'calculator', slug, 'index.html');
  assert(fs.existsSync(pagePath), `Page exists: /calculator/${slug}/index.html`);
  if (!fs.existsSync(pagePath)) continue;

  const pageHtml = fs.readFileSync(pagePath, 'utf8');
  const expectedCanonical = `https://netpayscale.uk/calculator/${slug}/`;
  
  const pageCanonical = pageHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || pageHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
  assert(pageCanonical && pageCanonical[1] === expectedCanonical, `Page /${slug}/ has exact self-referential canonical (actual: ${pageCanonical ? pageCanonical[1] : 'NONE'})`);

  const pageOgUrl = pageHtml.match(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i) || pageHtml.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:url"/i);
  assert(pageOgUrl && pageOgUrl[1] === expectedCanonical, `Page /${slug}/ has matching og:url (actual: ${pageOgUrl ? pageOgUrl[1] : 'NONE'})`);

  assert(pageHtml.includes('"@type":"BreadcrumbList"'), `Page /${slug}/ contains BreadcrumbList schema`);
  assert(pageHtml.includes('"@type":"Occupation"'), `Page /${slug}/ contains Occupation schema`);
  assert(pageHtml.includes('"@type":"FAQPage"'), `Page /${slug}/ contains FAQPage schema`);
  assert(pageHtml.includes('Direct Answer · 2026/27 Official Benchmark'), `Page /${slug}/ contains AEO Direct Answer executive block`);
}

// 5. Check Internal Link consistency
console.log('\n--- Checking Internal Links for Trailing Slash Compliance ---');
let internalLinksChecked = 0;
let internalLinksNonCompliant = 0;

const hrefMatches = [...homeHtml.matchAll(/href="(\/calculator\/[^"#]+)"/g)].map(m => m[1]);
for (const href of hrefMatches) {
  internalLinksChecked++;
  if (!href.endsWith('/')) {
    internalLinksNonCompliant++;
    console.warn(`[WARN] Non-trailing slash internal link found on homepage: ${href}`);
  }
}

assert(internalLinksNonCompliant === 0, `All internal calculator links on homepage use trailing slash (checked: ${internalLinksChecked}, non-compliant: ${internalLinksNonCompliant})`);

// 6. Full 490-Page Internal Cross-Linking Mesh & Zero-Orphan Graph Verification
console.log('\n--- Auditing Complete 490-Page Internal Cross-Linking Graph ---');
const calcDir = path.join(outDir, 'calculator');
const allSlugs = fs.readdirSync(calcDir).filter(f => fs.statSync(path.join(calcDir, f)).isDirectory());
const slugSet = new Set(allSlugs);
const inDegree = new Map(allSlugs.map(s => [s, 0]));

// Count links from homepage
for (const href of hrefMatches) {
  const m = href.match(/^\/calculator\/([^/]+)\/$/);
  if (m && inDegree.has(m[1])) {
    inDegree.set(m[1], inDegree.get(m[1]) + 1);
  }
}

let totalCrossLinks = 0;
let brokenCrossLinks = 0;
let nonTrailingCrossLinks = 0;

for (const slug of allSlugs) {
  const pHtml = fs.readFileSync(path.join(calcDir, slug, 'index.html'), 'utf8');
  const links = [...pHtml.matchAll(/href="(\/calculator\/[^"#]+)"/g)].map(m => m[1]);
  for (const l of links) {
    totalCrossLinks++;
    if (!l.endsWith('/')) {
      nonTrailingCrossLinks++;
      continue;
    }
    const m = l.match(/^\/calculator\/([^/]+)\/$/);
    if (!m || !slugSet.has(m[1])) {
      brokenCrossLinks++;
    } else if (m[1] !== slug) {
      inDegree.set(m[1], inDegree.get(m[1]) + 1);
    }
  }
}

const degrees = [...inDegree.values()];
const orphanCount = degrees.filter(d => d === 0).length;
const minInDegree = Math.min(...degrees);
const maxInDegree = Math.max(...degrees);
const avgInDegree = (degrees.reduce((a, b) => a + b, 0) / degrees.length).toFixed(1);

assert(allSlugs.length === 490, `All 490 pSEO static directories exist (actual: ${allSlugs.length})`);
assert(brokenCrossLinks === 0, `Zero broken internal cross-links across all 490 pages (checked: ${totalCrossLinks}, broken: ${brokenCrossLinks})`);
assert(nonTrailingCrossLinks === 0, `100% of cross-links across all 490 pages use trailing slash (non-compliant: ${nonTrailingCrossLinks})`);
assert(orphanCount === 0, `Zero Orphan Pages across all 490 routes (orphans: ${orphanCount}, min incoming links: ${minInDegree}, max: ${maxInDegree}, avg: ${avgInDegree})`);

console.log(`\n=== AUDIT SUMMARY: Passed: ${passed}, Warnings: ${warnings}, Failures: ${errors} ===`);
process.exit(errors > 0 ? 1 : 0);
