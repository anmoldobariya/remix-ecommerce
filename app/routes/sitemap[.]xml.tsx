import type { LoaderFunction } from "@remix-run/node";
import { getDb } from "~/utils/db.server";
import { getActiveCategories } from "~/utils/categories.server";
import { SITE_CONFIG } from "~/utils/seo";
import type { Product } from "~/models";

export const loader: LoaderFunction = async () => {
  const db = await getDb();
  const productsCollection = db.collection<Product>('products');

  // Get all active products and categories
  const [products, { genderCategories, productCategories }] = await Promise.all([
    productsCollection
      .find({ isActive: true })
      .project({ _id: 1, updatedAt: 1 })
      .toArray(),
    getActiveCategories()
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${SITE_CONFIG.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Products listing page -->
  <url>
    <loc>${SITE_CONFIG.url}/products</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- About page -->
  <url>
    <loc>${SITE_CONFIG.url}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Product pages -->
  ${products.map(product => `
  <url>
    <loc>${SITE_CONFIG.url}/products/${product._id}</loc>
    <lastmod>${(product.updatedAt || new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Category pages -->
  ${productCategories.map(category => `
  <url>
    <loc>${SITE_CONFIG.url}/products?type=${category.value}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Gender category pages -->
  ${genderCategories.map(category => `
  <url>
    <loc>${SITE_CONFIG.url}/products?gender=${category.value}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
};
