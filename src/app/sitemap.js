// src/app/sitemap.js
import { client, SANITY_DOC_TYPE } from "@/sanity/client";
import { DOMAIN } from "@/lib/metadata";

const baseUrl = DOMAIN; // folosește domeniul din metadata centralizată
export const revalidate = 60; // ISR pentru sitemap

export default async function sitemap() {
    // 1) Categorii (tip Sanity: "category" – asigură-te că acesta este tipul corect în schema ta)
    const categories = await client.fetch(`
        *[_type == "${SANITY_DOC_TYPE.category}" && defined(slug.current)]{
            "slug": slug.current,
            _updatedAt
        }
    `);

    // 2) Articole (tip Sanity real: "article" – ajustează dacă ai alt nume în dataset-ul tău)
    //    avem nevoie și de slug-ul categoriei părinte
    const articles = await client.fetch(`
        *[_type == "${SANITY_DOC_TYPE.article}" && defined(slug.current) && defined(categories[0]->slug.current) && _createdAt <= now()]{
            "slug": slug.current,
            "cat": categories[0]->slug.current,
            _updatedAt
        }
    `);

    // 3) Rute statice reale (fără #ancore)
    const staticRoutes = [
        { path: "/", changeFrequency: "weekly", priority: 1.0 },
        { path: "/politica-confidentialitate", changeFrequency: "yearly", priority: 0.2 },
        { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
    ];

    const nowIso = new Date().toISOString();

    const staticEntries = staticRoutes.map(({ path, changeFrequency, priority }) => ({
        url: `${baseUrl}${path}`,
        lastModified: nowIso,
        changeFrequency,
        priority,
    }));

    const categoryEntries = categories.map((c) => ({
        url: `${baseUrl}/${c.slug}`,
        lastModified: c._updatedAt ? new Date(c._updatedAt).toISOString() : nowIso,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    const articleEntries = articles.map((a) => ({
        url: `${baseUrl}/${a.cat}/${a.slug}`,
        lastModified: a._updatedAt ? new Date(a._updatedAt).toISOString() : nowIso,
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [...staticEntries, ...categoryEntries, ...articleEntries];
}