import fs from 'fs';
import path from 'path';

const API_KEY = process.env.STITCH_API_KEY || "";
const outDir = path.resolve('stitch_artifacts');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const screens = [
  {
    name: 'screen_1_agenda_calculator',
    title: 'NetPayScale UK — NHS Agenda for Change Pay Calculator',
    codeUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTdkODVlMDM5YjkwNzc5OWMxMmMzMTY0ZmEwEgsSBxCEpqqZpwcYAZIBJAoKcHJvamVjdF9pZBIWQhQxODQ0MDIyMDgxNDY2Njc5MDM5OQ&filename=&opi=89354086',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WUEKK5tPoGiopEomNjtNzzIvhrPTovYdDBwYML_aeXFjVgV9hf-W_8QxnmPIijJU4DotRTbfH1kyGMyNkGDW_y00x88XFPJLUJOZpTr07i-Zcaxweg9Kt5km3FVBdNAviZc_YBUyVzIom2ZefLYhZ2QvfzzXYBaG2UYqWPJJZGUvYsidQ9lx1IET8_AtKs21NMg-sD9pS_KkLkS1SFWaYe2LZTpgZbmNNbgOsed6yIPn0mLNq6hu7n945x'
  },
  {
    name: 'screen_2_interactive_animated',
    title: 'NetPayScale UK — Interactive Animated NHS Pay Calculator',
    codeUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTdkOTdmOWY2MDkwMzM4NWJmMDZlMjA2YjIzEgsSBxCEpqqZpwcYAZIBJAoKcHJvamVjdF9pZBIWQhQxODQ0MDIyMDgxNDY2Njc5MDM5OQ&filename=&opi=89354086',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1Xku53bn8PGqEFmfyQWnSWqrjCzQJxqrgu_MDuMaK6UOf5RsCaKrg7p9TrEiUMOmTJuYKNkx4BqvuEs4hzEA4obmv6Mr8RdE5oI60fCMMhPnSpRt5FLRhXZ0daQLLY57WZav3aSt0oW1bf7N3r14y79hnwQss7HcaWMWtrPL51aq6WCQ-2YTyEgorfyMwVuhVKiE_U4hLreN5GWx_SJ6wzmiKBm5jdNGk-FK3dyIXq7xSZjidZABzV8WWA'
  },
  {
    name: 'screen_3_responsive_calculator',
    title: 'NetPayScale UK — NHS Agenda for Change Pay Calculator (Fully Responsive)',
    codeUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTdkODYzNWU0NzYwNWMyZmI3NDFmMThiNTAxEgsSBxCEpqqZpwcYAZIBJAoKcHJvamVjdF9pZBIWQhQxODQ0MDIyMDgxNDY2Njc5MDM5OQ&filename=&opi=89354086`',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XBqiwbmsNEMCBopTFOaEoRCgSSFoMpTriskVsMbwOUGtg1sPZJJBxS-kpEPPmWbYih-Wk3RCcuvCKHklT0BQlSsEYHx-fzgx4kN5ZSYV51Yqj1i3WzOHGMCXrYq9xzsXnAInW2Iv7cKgNdR8j1wEonebGyvKbHBVkNMhKSeHW5y0oD57miFFyh0Ewd4HuJA1tXakV84fh_jCqNVQnCIozEu215GM-wUr8P3OwtwZ5WrPHz61ogkCq_Vva9'
  }
];

// Clean codeUrl of screen 3 (remove extra backtick if any)
screens[2].codeUrl = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTdkODYzNWU0NzYwNWMyZmI3NDFmMThiNTAxEgsSBxCEpqqZpwcYAZIBJAoKcHJvamVjdF9pZBIWQhQxODQ0MDIyMDgxNDY2Njc5MDM5OQ&filename=&opi=89354086';

async function download(url, filePath, headers = {}) {
  console.log(`Downloading: ${url} -> ${filePath}`);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error(`Failed ${res.status}: ${res.statusText}`);
    const text = await res.text();
    console.error(`Response snippet: ${text.slice(0, 300)}`);
    return false;
  }
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
  console.log(`Saved ${filePath} (${arrayBuffer.byteLength} bytes)`);
  return true;
}

async function main() {
  for (const screen of screens) {
    console.log(`\n=== Processing: ${screen.title} ===`);
    
    // Download HTML
    const htmlPath = path.join(outDir, `${screen.name}.html`);
    // Try with and without X-Goog-Api-Key
    let success = await download(screen.codeUrl, htmlPath, { 'X-Goog-Api-Key': API_KEY });
    if (!success) {
      console.log('Retrying without header...');
      await download(screen.codeUrl, htmlPath);
    }
    
    // Download Image
    const imgPath = path.join(outDir, `${screen.name}.png`);
    let imgSuccess = await download(screen.imageUrl, imgPath, { 'X-Goog-Api-Key': API_KEY });
    if (!imgSuccess) {
      console.log('Retrying image without header...');
      await download(screen.imageUrl, imgPath);
    }
  }
  console.log('\nAll downloads attempted.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
