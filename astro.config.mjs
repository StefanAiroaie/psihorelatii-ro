import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import fs from "node:fs";

// ── `lastmod` în sitemap (25 sep 2026) ──────────────────────────────────────
// @astrojs/sitemap NU emite `lastmod` implicit. Datele vin din frontmatter
// (updatedAt ?? publishedAt), NU din `git log`: Cloudflare Pages clonează shallow.
// Rutarea e după `category` + `slug` din frontmatter, nu după numele fișierului.
const articleRoot = new URL("./src/content/articles/", import.meta.url);
const camp = (text, nume) => {
  const m = text.match(new RegExp(`^${nume}:\\s*["']?([^"'\\n]+)`, "m"));
  return m ? m[1].trim() : null;
};
const dataArticol = new Map();
const dataCategorie = new Map();
for (const f of fs.readdirSync(articleRoot).filter((f) => f.endsWith(".mdx"))) {
  const text = fs.readFileSync(new URL(f, articleRoot), "utf-8");
  const zi = (camp(text, "updatedAt") ?? camp(text, "publishedAt") ?? "").slice(0, 10);
  const cat = camp(text, "category");
  const slug = camp(text, "slug");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(zi) || !cat || !slug) continue;
  dataArticol.set(`/${cat}/${slug}`, zi);
  if (!dataCategorie.has(`/${cat}`) || dataCategorie.get(`/${cat}`) < zi) dataCategorie.set(`/${cat}`, zi);
}
const dataHomepage = [...dataArticol.values()].sort().at(-1);
const lastmodPentru = (cale) =>
  dataArticol.get(cale) ?? dataCategorie.get(cale) ?? (cale === "/" || cale === "/toate-articolele" ? dataHomepage : null);

export default defineConfig({
  site: "https://psihorelatii.ro",
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [
    mdx(),
    sitemap({
      serialize: (item) => {
        const cale = new URL(item.url).pathname.replace(/\/$/, "") || "/";
        const zi = lastmodPentru(cale);
        if (zi) item.lastmod = `${zi}T00:00:00+00:00`;
        return item;
      },
    }),
  ],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append", properties: { className: ["heading-anchor"] } }],
    ],
  },
  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
