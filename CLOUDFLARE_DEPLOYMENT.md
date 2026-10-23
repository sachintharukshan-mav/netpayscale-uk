# Cloudflare Pages Free Tier Deployment Guide

This project is configured for **Static HTML Export (`output: 'export'`)**, which is the optimal architecture for **Cloudflare Pages (Free Tier)**.

### Why this setup is optimal for Cloudflare Pages Free Tier:
- **Cost:** **£0 / $0 forever** (unlimited free bandwidth & unlimited requests on Cloudflare's global edge network).
- **Speed:** **0ms cold boots** — every page is pre-rendered static HTML served from 300+ edge locations worldwide.
- **Security:** Automatic HTTP Strict Transport Security (`HSTS`), `X-Frame-Options`, and immutable chunk caching configured via `public/_headers` (automatically copied into `out/_headers`).
- **SEO:** Pre-renders all 490+ programmatic landing pages, `sitemap.xml`, and `robots.txt`.

---

## Method 1: Git Integration (Recommended for Continuous Deployment)

Whenever you push to your GitHub / GitLab repository, Cloudflare will automatically build and deploy the site in under 60 seconds.

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure Cloudflare Pages static export"
   git push origin main
   ```

2. **In the Cloudflare Dashboard:**
   - Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
   - Go to **Workers & Pages** in the left sidebar.
   - Click **Create application** $\rightarrow$ select the **Pages** tab $\rightarrow$ click **Connect to Git**.
   - Select your GitHub repository.

3. **Configure the Build Settings:**
   - **Framework preset:** `Next.js (Static HTML Export)` *(or None)*
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** `/` *(leave default)*
   - **Node.js version (Environment Variable):**
     - Add variable: `NODE_VERSION` = `20.18.0`

4. Click **Save and Deploy**.
   - Cloudflare will build all 496 static pages and provide your live `*.pages.dev` URL.

---

## Method 2: Instant 15-Second CLI Deploy (No Git required)

If you have Cloudflare's Wrangler CLI installed, you can publish the existing `out/` build immediately from your command line:

```bash
# 1. Build the production static export
npm run build

# 2. Deploy directly to Cloudflare Pages
npx wrangler pages deploy out --project-name=netpayscale-uk
```

---

## Connecting Your Custom Domain (`netpayscale.co.uk`)

1. In your Cloudflare Pages project dashboard, click the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter your domain: `netpayscale.co.uk` (or `www.netpayscale.co.uk`).
4. If your domain's DNS is already on Cloudflare, it will automatically configure the CNAME and DNSSEC records in 1 click.
5. Cloudflare automatically issues and renews a free **Universal SSL/TLS certificate** with HTTP/3 and 0-RTT enabled.

---

## Edge Headers & Caching Included

The [`public/_headers`](file:///c:/Users/Admin/Documents/anti%20gravity%20projects/UK%20NHS%20sal%20cal/public/_headers) file is automatically applied by Cloudflare Pages to provide:
- **`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`**
- **`X-Content-Type-Options: nosniff`**
- **`X-Frame-Options: SAMEORIGIN`**
- **`Referrer-Policy: strict-origin-when-cross-origin`**
- **1-Year Immutable Caching** on all `/_next/static/*` chunks.
- **Daily revalidation** on `sitemap.xml` and `robots.txt`.
