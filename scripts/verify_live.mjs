async function verify() {
  console.log('Testing live Cloudflare Pages URL: https://netpayscale-uk.pages.dev/\n');
  const res = await fetch('https://netpayscale-uk.pages.dev/');
  console.log('Status:', res.status, res.statusText);
  console.log('CF-Ray:', res.headers.get('cf-ray'));
  console.log('Server:', res.headers.get('server'));
  console.log('HSTS:', res.headers.get('strict-transport-security'));
  console.log('X-Frame-Options:', res.headers.get('x-frame-options'));
  
  const text = await res.text();
  console.log('Contains NHS Pay Calculator:', text.includes('NHS Pay Calculator'));
  console.log('Contains Quick Select Strip:', text.includes('Quick Select:'));
  console.log('Contains ESR Payslip Replica:', text.includes('ELECTRONIC STAFF RECORD'));
  
  const pSeoRes = await fetch('https://netpayscale-uk.pages.dev/calculator/band-5-nurse-salary-inner-london/');
  console.log('\npSEO Route Status:', pSeoRes.status, pSeoRes.statusText);
  const pSeoText = await pSeoRes.text();
  console.log('Contains AEO Direct Answer Block:', pSeoText.includes('Direct Answer · 2026/27 Official Benchmark'));
  console.log('Contains Breadcrumb Schema:', pSeoText.includes('"@type":"BreadcrumbList"'));
}

verify().catch(console.error);
