import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const SANITY_DOC_TYPE = {
  page: "psihorelatii_ro_page",
  article: "psihorelatii_ro_article",
  category: "psihorelatii_ro_category"
};

export const client = createClient({
  projectId: "rb4c8hjj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

interface SanityImageSource {
  asset: {
    _ref: string;
    _type: string;
    url?: string;
  };
}

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// =============================
// Centralized GROQ + fetch API
// =============================

// Minimal shared types (extend as needed)
export interface SanityPage {
  title?: string;
  description?: string;
  mainImage?: any;
  body?: any;
  faq?: { question: string; answer: any }[];
  _updatedAt?: string;
}

export interface SanityArticleListItem {
  _id: string;
  title: string;
  slug: string; // already resolved to string
  description?: string;
  mainImage?: any;
}

export interface SanityCategory extends SanityPage { }

// GROQ snippets
const PAGE_BY_SLUG_GROQ = `*[_type=="${SANITY_DOC_TYPE.page}" && slug.current==$slug][0]{
  title,
  description,
  mainImage,
  body,
  faq[]{question, answer},
  _updatedAt
}`;

const CATEGORY_BY_SLUG_GROQ = `*[_type=="${SANITY_DOC_TYPE.category}" && slug.current==$slug][0]{
  title,
  description,
  mainImage,
  body,
  faq[]{question, answer}
}`;

const ARTICLES_BY_CATEGORY_SLUG_GROQ = `*[_type=="${SANITY_DOC_TYPE.article}" && $catSlug in categories[]->slug.current]{
  _id,
  title,
  "slug": slug.current,
  description,
  mainImage
}`;

const ALL_CATEGORY_SLUGS_GROQ = `*[_type=="${SANITY_DOC_TYPE.category}"]{ "slug": slug.current }`;
const ALL_PAGE_SLUGS_GROQ = `*[_type=="${SANITY_DOC_TYPE.page}"]{ "slug": slug.current }`;
const ALL_ARTICLE_SLUGS_GROQ = `*[_type=="${SANITY_DOC_TYPE.article}"]{ "slug": slug.current }`;

// Thin wrappers
export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  return client.fetch(PAGE_BY_SLUG_GROQ, { slug });
}

export async function getCategoryBySlug(slug: string): Promise<SanityCategory | null> {
  return client.fetch(CATEGORY_BY_SLUG_GROQ, { slug });
}

export async function getArticlesByCategorySlug(catSlug: string): Promise<SanityArticleListItem[]> {
  return client.fetch(ARTICLES_BY_CATEGORY_SLUG_GROQ, { catSlug });
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const rows: { slug: string }[] = await client.fetch(ALL_CATEGORY_SLUGS_GROQ);
  return rows.map(r => r.slug).filter(Boolean);
}

export async function getAllPageSlugs(): Promise<string[]> {
  const rows: { slug: string }[] = await client.fetch(ALL_PAGE_SLUGS_GROQ);
  return rows.map(r => r.slug).filter(Boolean);
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const rows: { slug: string }[] = await client.fetch(ALL_ARTICLE_SLUGS_GROQ);
  return rows.map(r => r.slug).filter(Boolean);
}



