/**
 * Cloudflare Pages Edge Middleware
 * 1. Consolidates www.netpayscale.uk -> https://netpayscale.uk/ via single-hop 301 Permanent Redirect
 *    (eliminating split canonicals and 300+ duplicate www URLs in Google Search Console).
 * 2. Protects *.pages.dev preview hosts from search engine indexation with X-Robots-Tag: noindex, nofollow.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();

  // Enforce apex domain over www subdomain (single-hop 301, preserving trailing-slash parity)
  if (host === "www.netpayscale.uk") {
    let targetPath = url.pathname;
    const hasExtension = /\.[a-z0-9]{1,8}$/i.test(targetPath);
    if (!hasExtension && !targetPath.endsWith("/")) {
      targetPath += "/";
    }
    const destination = `https://netpayscale.uk${targetPath}${url.search}`;
    return Response.redirect(destination, 301);
  }

  // Pass through to static asset / Next.js export
  const response = await context.next();

  // Prevent search indexation of *.pages.dev staging/preview mirrors
  if (host.endsWith(".pages.dev")) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    return newResponse;
  }

  return response;
}
