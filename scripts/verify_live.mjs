const urls = [
  'https://c90f1e75.netpayscale-uk.pages.dev/promotion-calculator/',
  'https://netpayscale.uk/promotion-calculator/',
  'https://netpayscale.uk/promotion-calculator.md'
];

async function run() {
  console.log('=== VERIFYING LIVE PROMOTION & PENSION TRAP TOOL ===\n');
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log(`URL: ${url}`);
      console.log(`  HTTP Status: ${res.status}`);
      console.log(`  Content Length: ${text.length} bytes`);
      console.log(`  Has Title / Heading: ${text.includes('NHS Band Promotion')}`);
      console.log(`  Has £50/Month Trap Preset: ${text.includes('The £50/Month Trap')}`);
      console.log(`  Has Shift Loss Reality Preset: ${text.includes('The Shift Loss Reality')}`);
      console.log(`  Has Direct Answer Box: ${text.includes('AEO Direct Answer')}`);
      console.log(`  Has FAQPage Schema: ${text.includes('"@type":"FAQPage"')}`);
      console.log(`  Has WhatsApp Share Widget: ${text.includes('data-share-widget="whatsapp-copy-breakdown"')}`);
      console.log('--------------------------------------------------\n');
    } catch (e) {
      console.error(`Error fetching ${url}:`, e.message);
    }
  }
}

run();
