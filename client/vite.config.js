import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Build-time SEO helpers driven by VITE_SITE_URL (the public https origin,
// e.g. https://www.example.com):
//  - absolute og:image / twitter:image URLs in index.html (crawlers need them)
//  - sitemap.xml and robots.txt generated with absolute URLs
// With VITE_SITE_URL unset the build still succeeds, but emits a robots.txt
// without a Sitemap line, no sitemap, and prints a warning.
function seoFiles(siteUrl) {
  const pages = ["/", "/catalogue", "/about", "/contact"];
  return {
    name: "works-seo-files",
    transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
    generateBundle() {
      if (!siteUrl) {
        this.warn("VITE_SITE_URL is not set: sitemap.xml was not generated and og:image URLs are relative.");
      }
      const robots = ["User-agent: *", "Allow: /", "Disallow: /admin", ...(siteUrl ? ["", `Sitemap: ${siteUrl}/sitemap.xml`] : [])].join("\n") + "\n";
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
      if (siteUrl) {
        const urls = pages.map((p) => `  <url><loc>${siteUrl}${p === "/" ? "/" : p}</loc></url>`).join("\n");
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = (env.VITE_SITE_URL || "").trim().replace(/\/+$/, "");
  return {
    plugins: [react(), seoFiles(siteUrl)],
    server: { port: 5173 },
  };
});
