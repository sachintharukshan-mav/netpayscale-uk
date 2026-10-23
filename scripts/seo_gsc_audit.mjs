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
assert(robotsContent.includes('Sitemap: https://netpayscale.co.uk/sitemap.xml'), 'robots.txt references absolute canonical sitemap.xml');

// 2. Sitemap.xml check
const sitemapPath = path.join(outDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists in static export');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Parse loc tags
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
console.log(`Found ${locMatches.length} URLs in sitemap.xml`);

assert(locMatches.length >= 491, `Sitemap contains 491+ URLs (actual: ${locMatches.length})`);
assert(locMatches[0] === 'https://netpayscale.co.uk/', `Homepage in sitemap is exact canonical: https://netpayscale.co.uk/ (actual: ${locMatches[0]})`);

let nonTrailingSlashCount = 0;
let invalidHostCount = 0;

for (const url of locMatches) {
  if (!url.startsWith('https://netpayscale.co.uk')) invalidHostCount++;
  if (!url.endsWith('/')) nonTrailingSlashCount++;
}

assert(invalidHostCount === 0, `All sitemap URLs use https://netpayscale.co.uk (invalid: ${invalidHostCount})`);
assert(nonTrailingSlashCount === 0, `All sitemap URLs end with trailing slash to prevent 308 redirects (non-compliant: ${nonTrailingSlashCount})`);

// 3. Homepage HTML Audit (Canonical, Meta, Schema)
const homePath = path.join(outDir, 'index.html');
assert(fs.existsSync(homePath), 'index.html exists in static export');
const homeHtml = fs.readFileSync(homePath, 'utf8');

const homeCanonical = homeHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || homeHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
assert(homeCanonical && homeCanonical[1] === 'https://netpayscale.co.uk/', `Homepage canonical is exactly https://netpayscale.co.uk/ (actual: ${homeCanonical ? homeCanonical[1] : 'NONE'})`);

assert(homeHtml.includes('"@type":"WebSite"'), 'Homepage contains WebSite schema');
assert(homeHtml.includes('"@type":"WebApplication"'), 'Homepage contains WebApplication schema');
assert(homeHtml.includes('"@type":"FAQPage"'), 'Homepage contains FAQPage schema');

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
  const expectedCanonical = `https://netpayscale.co.uk/calculator/${slug}/`;
  
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

console.log(`\n=== AUDIT SUMMARY: Passed: ${passed}, Warnings: ${warnings}, Failures: ${errors} ===`);
process.exit(errors > 0 ? 1 : 0);
