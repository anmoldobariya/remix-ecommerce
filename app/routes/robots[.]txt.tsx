import type { LoaderFunction } from "@remix-run/node";
import { SITE_CONFIG } from "~/utils/seo";

export const loader: LoaderFunction = async () => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /logout
Disallow: /login
Disallow: /register

# Allow search engines to crawl product images
Allow: /uploads/

# Sitemap location
Sitemap: ${SITE_CONFIG.url}/sitemap.xml

# Crawl delay (optional - helps prevent server overload)
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  });
};
