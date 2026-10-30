import fs from 'fs';
import path from 'path';

const outDir = path.resolve('out');

console.log('=== RUNNING COMPREHENSIVE SEO / AEO / GSC AUDIT (509-PAGE ARCHITECTURE) ===\n');

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
assert(robotsContent.includes('OAI-SearchBot') && robotsContent.includes('PerplexityBot') && robotsContent.includes('Claude-SearchBot'), 'robots.txt explicitly allows AI Search & Citation bots (OAI-SearchBot, PerplexityBot, Claude-SearchBot)');
assert(robotsContent.includes('Sitemap: https://netpayscale.uk/sitemap.xml'), 'robots.txt references absolute canonical sitemap.xml');

// 1B. AI / GEO / LLMs.txt & Markdown Twins check
const llmsPath = path.join(outDir, 'llms.txt');
const llmsFullPath = path.join(outDir, 'llms-full.txt');
const aiTxtPath = path.join(outDir, 'ai.txt');
const indexMdPath = path.join(outDir, 'index.md');
const catalogPath = path.join(outDir, 'api', 'md', '_catalog');
assert(fs.existsSync(llmsPath), 'llms.txt exists in static export');
assert(fs.existsSync(llmsFullPath), 'llms-full.txt exists in static export');
assert(fs.existsSync(aiTxtPath), 'ai.txt exists in static export');
assert(fs.existsSync(indexMdPath), 'index.md exists in static export');
assert(fs.existsSync(catalogPath), 'api/md/_catalog exists in static export');
const llmsFullContent = fs.readFileSync(llmsFullPath, 'utf8');
assert(llmsFullContent.length > 10000 && llmsFullContent.length < 500000, `llms-full.txt length is within optimal LLM context window (${llmsFullContent.length} chars)`);
const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
assert(catalogData.totalMarkdownRoutes === 74, `api/md/_catalog lists all 74 core, band & trust Markdown routes (actual: ${catalogData.totalMarkdownRoutes})`);
assert(catalogData.totalHtmlRoutes === 568, `api/md/_catalog reports 568 total HTML routes (actual: ${catalogData.totalHtmlRoutes})`);

// 2. Sitemap.xml check
const sitemapPath = path.join(outDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists in static export');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Parse loc tags
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
console.log(`Found ${locMatches.length} URLs in sitemap.xml`);

assert(locMatches.length === 568, `Sitemap contains all 568 canonical URLs (8 static + 9 sibling calculators + 11 band hubs + 50 trust hubs + 490 role-region spokes; actual: ${locMatches.length})`);
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

assert(homeHtml.includes('"@type":"Organization"'), 'Homepage contains Organization schema');
assert(homeHtml.includes('"@type":"WebSite"'), 'Homepage contains WebSite schema');
assert(homeHtml.includes('"@type":"WebApplication"'), 'Homepage contains WebApplication schema');
assert(homeHtml.includes('"@type":"FAQPage"'), 'Homepage contains FAQPage schema');
assert(homeHtml.includes('name="ai-summary"'), 'Homepage contains <meta name="ai-summary"> head signal');
assert(homeHtml.includes('type="text/markdown"'), 'Homepage contains <link rel="alternate" type="text/markdown"> head signal');
assert(fs.existsSync(path.join(outDir, 'favicon.ico')), 'favicon.ico exists in static export');
assert(fs.existsSync(path.join(outDir, 'icon.svg')), 'icon.svg exists in static export');
assert(fs.existsSync(path.join(outDir, 'icon-48.png')), 'icon-48.png (48x48 Google SERP icon) exists in static export');
assert(fs.existsSync(path.join(outDir, 'apple-touch-icon.png')), 'apple-touch-icon.png exists in static export');
assert(fs.existsSync(path.join(outDir, 'og-image.png')), 'og-image.png (1200x630 social preview) exists in static export');
assert(homeHtml.includes('https://netpayscale.uk/og-image.png'), 'Homepage references https://netpayscale.uk/og-image.png');
assert(homeHtml.includes('data-share-widget="whatsapp-copy-breakdown"'), 'Homepage calculator includes 1-Tap WhatsApp / Copy Breakdown widget');
assert(!homeHtml.includes('href="#"'), 'Homepage contains zero dead href="#" links');

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

// 3C. 9 High-Volume Sibling Calculators Audit
const siblingCalculators = [
  'pension-calculator',
  'sick-pay-calculator',
  'maternity-pay-calculator',
  'annual-leave-calculator',
  'bank-shift-calculator',
  'pay-rise-backpay-calculator',
  'promotion-calculator',
  'redundancy-pay-calculator',
  'unsocial-hours-calculator',
];
for (const calcSlug of siblingCalculators) {
  const cPath = path.join(outDir, calcSlug, 'index.html');
  assert(fs.existsSync(cPath), `Sibling calculator exists: /${calcSlug}/index.html`);
  if (fs.existsSync(cPath)) {
    const cHtml = fs.readFileSync(cPath, 'utf8');
    const expectedCanonical = `https://netpayscale.uk/${calcSlug}/`;
    const canonicalMatch = cHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || cHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
    assert(canonicalMatch && canonicalMatch[1] === expectedCanonical, `Calculator /${calcSlug}/ has exact self-referential canonical (actual: ${canonicalMatch ? canonicalMatch[1] : 'NONE'})`);
    assert(cHtml.includes('"@type":"BreadcrumbList"'), `Calculator /${calcSlug}/ contains BreadcrumbList schema`);
    assert(cHtml.includes('"@type":"FAQPage"'), `Calculator /${calcSlug}/ contains FAQPage schema`);
    assert(cHtml.includes('data-share-widget="whatsapp-copy-breakdown"'), `Calculator /${calcSlug}/ contains 1-Tap WhatsApp / Copy Breakdown widget`);
    if (calcSlug === 'promotion-calculator') {
      assert(cHtml.includes('Pension Bracket Trap') || cHtml.includes('Pension Trap'), 'Promotion Calculator includes Pension Trap features and schema');
      assert(cHtml.includes('The £50/Month Trap') || cHtml.includes('£50/mo trap') || cHtml.includes('£50/Month'), 'Promotion Calculator features £50/Month Trap scenario preset');
      assert(cHtml.includes('Is moving from Band 5 to Band 6 financially worth it'), 'Promotion Calculator includes clinical FAQ on Band 5 to Band 6 financial verdict');
    }
    if (calcSlug === 'unsocial-hours-calculator') {
      assert(cHtml.includes('Section 2') || cHtml.includes('Section 2 Terms'), 'Unsocial Hours Calculator includes AfC Section 2 statutory references');
      assert(cHtml.includes('+30%') && cHtml.includes('+60%'), 'Unsocial Hours Calculator covers +30% night and +60% Sunday enhancements');
      assert(cHtml.includes('+44%') && cHtml.includes('+88%'), 'Unsocial Hours Calculator covers +44% and +88% Band 2-3 enhancements');
    }
  }
}

// 3D. 11 National Band Hub Pages Audit (/bands/band-2/ to /bands/band-9/)
const bandSlugs = ['band-2', 'band-3', 'band-4', 'band-5', 'band-6', 'band-7', 'band-8a', 'band-8b', 'band-8c', 'band-8d', 'band-9'];
for (const bSlug of bandSlugs) {
  const bPath = path.join(outDir, 'bands', bSlug, 'index.html');
  assert(fs.existsSync(bPath), `National Band Hub exists: /bands/${bSlug}/index.html`);
  if (fs.existsSync(bPath)) {
    const bHtml = fs.readFileSync(bPath, 'utf8');
    const expectedCanonical = `https://netpayscale.uk/bands/${bSlug}/`;
    const canonicalMatch = bHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || bHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
    assert(canonicalMatch && canonicalMatch[1] === expectedCanonical, `Band Hub /bands/${bSlug}/ has exact self-referential canonical (actual: ${canonicalMatch ? canonicalMatch[1] : 'NONE'})`);
    assert(bHtml.includes('"@type":"BreadcrumbList"'), `Band Hub /bands/${bSlug}/ contains BreadcrumbList schema`);
    assert(bHtml.includes('"@type":"FAQPage"'), `Band Hub /bands/${bSlug}/ contains FAQPage schema`);
    assert(bHtml.includes('data-share-widget="whatsapp-copy-breakdown"'), `Band Hub /bands/${bSlug}/ contains 1-Tap WhatsApp / Copy Breakdown widget`);
  }
}

// 3E. International Recruits Hub Page Audit (/international/)
const intlPath = path.join(outDir, 'international', 'index.html');
assert(fs.existsSync(intlPath), 'International recruits guide exists: /international/index.html');
if (fs.existsSync(intlPath)) {
  const intlHtml = fs.readFileSync(intlPath, 'utf8');
  const expectedCanonical = 'https://netpayscale.uk/international/';
  const canonicalMatch = intlHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || intlHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
  assert(canonicalMatch && canonicalMatch[1] === expectedCanonical, `Page /international/ has exact self-referential canonical (actual: ${canonicalMatch ? canonicalMatch[1] : 'NONE'})`);
  assert(intlHtml.includes('"@type":"BreadcrumbList"'), 'International page contains BreadcrumbList schema');
  assert(intlHtml.includes('"@type":"FAQPage"'), 'International page contains FAQPage schema');
  assert(intlHtml.includes('data-share-widget="whatsapp-copy-breakdown"'), 'International page contains 1-Tap WhatsApp / Copy Breakdown widget');
  assert(intlHtml.includes('Pre-OSCE') && intlHtml.includes('Post-OSCE'), 'International page explains Pre-OSCE vs Post-OSCE progression');
  assert(intlHtml.includes('Health and Care Worker Visa') || intlHtml.includes('Health &amp; Care Worker Visa'), 'International page covers Health & Care Worker Visa');
  assert(intlHtml.includes('Immigration Health Surcharge') || intlHtml.includes('IHS'), 'International page covers IHS exemption (£1,035/yr)');
}

// 3F. Embed Generator Hub & Embeddable Calculator Widget Audit (/embed/ and /embed/calculator/)
const embedHubPath = path.join(outDir, 'embed', 'index.html');
assert(fs.existsSync(embedHubPath), 'Embed Generator Hub exists: /embed/index.html');
if (fs.existsSync(embedHubPath)) {
  const embedHubHtml = fs.readFileSync(embedHubPath, 'utf8');
  const expectedCanonical = 'https://netpayscale.uk/embed/';
  const canonicalMatch = embedHubHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || embedHubHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
  assert(canonicalMatch && canonicalMatch[1] === expectedCanonical, `Page /embed/ has exact self-referential canonical (actual: ${canonicalMatch ? canonicalMatch[1] : 'NONE'})`);
  assert(embedHubHtml.includes('"@type":"BreadcrumbList"'), 'Embed page contains BreadcrumbList schema');
  assert(embedHubHtml.includes('"@type":"FAQPage"'), 'Embed page contains FAQPage schema');
  assert(embedHubHtml.includes('data-share-widget="whatsapp-copy-breakdown"'), 'Embed page contains 1-Tap WhatsApp / Copy Breakdown widget');
  assert(embedHubHtml.includes('<iframe') || embedHubHtml.includes('&lt;iframe'), 'Embed page contains interactive live iframe preview');
}

const embedCalcPath = path.join(outDir, 'embed', 'calculator', 'index.html');
assert(fs.existsSync(embedCalcPath), 'Embeddable Calculator Widget exists: /embed/calculator/index.html');
if (fs.existsSync(embedCalcPath)) {
  const embedCalcHtml = fs.readFileSync(embedCalcPath, 'utf8');
  assert(embedCalcHtml.includes('NetPayScale UK'), 'Embed widget contains NetPayScale UK attribution');
  assert(embedCalcHtml.includes('2026/27'), 'Embed widget contains 2026/27 AfC benchmark');
}

// 3G. Top 50 NHS Trusts Directory Audit (/trusts/)
const trustsPath = path.join(outDir, 'trusts', 'index.html');
assert(fs.existsSync(trustsPath), 'NHS Trusts Directory exists: /trusts/index.html');
if (fs.existsSync(trustsPath)) {
  const trustsHtml = fs.readFileSync(trustsPath, 'utf8');
  const expectedCanonical = 'https://netpayscale.uk/trusts/';
  const canonicalMatch = trustsHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || trustsHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
  assert(canonicalMatch && canonicalMatch[1] === expectedCanonical, `Page /trusts/ has exact self-referential canonical (actual: ${canonicalMatch ? canonicalMatch[1] : 'NONE'})`);
  assert(trustsHtml.includes('"@type":"BreadcrumbList"'), 'Trusts directory contains BreadcrumbList schema');
  assert(trustsHtml.includes('"@type":"FAQPage"'), 'Trusts directory contains FAQPage schema');
  assert(trustsHtml.includes('data-share-widget="whatsapp-copy-breakdown"'), 'Trusts directory contains 1-Tap WhatsApp / Copy Breakdown widget');
  assert(trustsHtml.includes("Guy&#x27;s and St Thomas") || trustsHtml.includes("Guy's and St Thomas"), 'Trusts directory covers Guy\'s and St Thomas\'');
  assert(trustsHtml.includes('Barts Health'), 'Trusts directory covers Barts Health');
  assert(trustsHtml.includes('Manchester University'), 'Trusts directory covers Manchester MFT');
}

// 3H. Programmatic NHS Trust Detail Pages Audit (/trusts/[slug]/)
const sampleTrustSlugs = [
  'guys-and-st-thomas',
  'barts-health',
  'manchester-university',
  'nhs-greater-glasgow-clyde'
];

for (const tSlug of sampleTrustSlugs) {
  const tPath = path.join(outDir, 'trusts', tSlug, 'index.html');
  assert(fs.existsSync(tPath), `Trust detail page exists: /trusts/${tSlug}/index.html`);
  if (!fs.existsSync(tPath)) continue;

  const tHtml = fs.readFileSync(tPath, 'utf8');
  const expectedCanonical = `https://netpayscale.uk/trusts/${tSlug}/`;
  const canonicalMatch = tHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || tHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
  assert(canonicalMatch && canonicalMatch[1] === expectedCanonical, `Trust page /trusts/${tSlug}/ has exact canonical (actual: ${canonicalMatch ? canonicalMatch[1] : 'NONE'})`);
  assert(tHtml.includes('"@type":"MedicalOrganization"'), `Trust page /${tSlug}/ contains MedicalOrganization schema`);
  assert(tHtml.includes('"@type":"BreadcrumbList"'), `Trust page /${tSlug}/ contains BreadcrumbList schema`);
  assert(tHtml.includes('"@type":"FAQPage"'), `Trust page /${tSlug}/ contains FAQPage schema`);
  assert(tHtml.includes('data-share-widget="whatsapp-copy-breakdown"'), `Trust page /${tSlug}/ contains 1-Tap WhatsApp Share widget`);
}

// 4. Sample pSEO Pages Audit (Canonical, OpenGraph, BreadcrumbList, Occupation, AEO Direct Answer, Multi-Step Matrix)
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
  assert(pageHtml.includes('data-share-widget="whatsapp-copy-breakdown"'), `Page /${slug}/ contains 1-Tap WhatsApp / Copy Breakdown widget`);
  assert(pageHtml.includes('Full-Time, Part-Time Pro-Rata &amp; Night Shift Take-Home Matrix'), `Page /${slug}/ contains Phase 2 Working Pattern & Shift Matrix`);
}

// 5. Check Internal Link consistency
console.log('\n--- Checking Internal Links for Trailing Slash Compliance ---');
let internalLinksChecked = 0;
let internalLinksNonCompliant = 0;

const hrefMatches = [...homeHtml.matchAll(/href="(\/(?:calculator|bands)\/[^"#]+)"/g)].map(m => m[1]);
for (const href of hrefMatches) {
  internalLinksChecked++;
  if (!href.endsWith('/')) {
    internalLinksNonCompliant++;
    console.warn(`[WARN] Non-trailing slash internal link found on homepage: ${href}`);
  }
}

assert(internalLinksNonCompliant === 0, `All internal calculator & band hub links on homepage use trailing slash (checked: ${internalLinksChecked}, non-compliant: ${internalLinksNonCompliant})`);

// 6. Full 490-Page Internal Cross-Linking Mesh & Zero-Orphan Graph Verification
console.log('\n--- Auditing Complete 490-Page Internal Cross-Linking Graph ---');
const calcDir = path.join(outDir, 'calculator');
const allSlugs = fs.readdirSync(calcDir).filter(f => fs.statSync(path.join(calcDir, f)).isDirectory());
const slugSet = new Set(allSlugs);
const inDegree = new Map(allSlugs.map(s => [s, 0]));

// Count links from homepage and Band Hubs
for (const href of hrefMatches) {
  const m = href.match(/^\/calculator\/([^/]+)\/$/);
  if (m && inDegree.has(m[1])) {
    inDegree.set(m[1], inDegree.get(m[1]) + 1);
  }
}

for (const bSlug of bandSlugs) {
  const bPath = path.join(outDir, 'bands', bSlug, 'index.html');
  if (fs.existsSync(bPath)) {
    const bHtml = fs.readFileSync(bPath, 'utf8');
    const bLinks = [...bHtml.matchAll(/href="(\/calculator\/[^"#]+)"/g)].map(m => m[1]);
    for (const l of bLinks) {
      const m = l.match(/^\/calculator\/([^/]+)\/$/);
      if (m && inDegree.has(m[1])) {
        inDegree.set(m[1], inDegree.get(m[1]) + 1);
      }
    }
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
