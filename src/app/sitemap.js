// src/app/sitemap.js
import { client } from "@/sanity/client";

// -------- CONFIG --------
const baseUrl = "https://psihorelatii.ro"; // <- domeniul live
const CATEGORY_ROUTE_PREFIX = "/categorie"; // <- ex: /categorie/[slug]
const ARTICLE_ROUTE_PREFIX = "/articole";  // <- ex: /articole/[slug]

// Numele tipurilor din Sanity (schimbă dacă sunt altele)
const CATEGORY_TYPE = "psihorelatii_ro_category";
const ARTICLE_TYPE = "psihorelatii_ro_article";
// ------------------------

export const revalidate = 60; // regenerează sitemap-ul periodic

export default async function sitemap() {
    // 1) Fetch categorii
    const categories = await client.fetch(
        `*[_type == $type && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`,
        { type: CATEGORY_TYPE }
    );

    // 2) Fetch articole
    const articles = await client.fetch(
        `*[_type == $type && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`,
        { type: ARTICLE_TYPE }
    );

    // 3) Rute statice reale (fără #ancore)
    const staticRoutes = [
        { path: "/", changeFrequency: "weekly", priority: 1.0 },
        // adaugă aici pagini reale, ex:
        // { path: "/despre",  changeFrequency: "monthly", priority: 0.6 },
        // { path: "/contact", changeFrequency: "yearly",  priority: 0.5 },
    ];

    const nowIso = new Date().toISOString();

    const staticEntries = staticRoutes.map(({ path, changeFrequency, priority }) => ({
        url: `${baseUrl}${path}`,
        lastModified: nowIso,
        changeFrequency,
        priority,
    }));

    const categoryEntries = categories.map((c) => ({
        url: `${baseUrl}${CATEGORY_ROUTE_PREFIX}/${c.slug}`,
        lastModified: c._updatedAt ? new Date(c._updatedAt).toISOString() : nowIso,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    const articleEntries = articles.map((a) => ({
        url: `${baseUrl}${ARTICLE_ROUTE_PREFIX}/${a.slug}`,
        lastModified: a._updatedAt ? new Date(a._updatedAt).toISOString() : nowIso,
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [...staticEntries, ...categoryEntries, ...articleEntries];
}