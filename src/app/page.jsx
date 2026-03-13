import PageTemplate from "@/components/PageTemplate";
import { buildPageMetadata, fromSanityImage } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/sanity/client";
import { client, SANITY_DOC_TYPE } from "@/sanity/client";
import FAQ from "@/components/FAQ";
import Categories from '@/components/Categories'
import Articles from '@/components/Articles'
import { DOMAIN } from "@/lib/siteConfig";

// SINGLE SOURCE OF TRUTH for this static page
const PAGE_SLUG = "/"; // the Sanity slug used to fetch homepage content

export async function generateMetadata() {
  const page = await getPageBySlug(PAGE_SLUG);
  return buildPageMetadata({
    title: page?.title,
    description: page?.description,
    image: fromSanityImage(page?.mainImage),
    path: "/"
  });
}

export const revalidate = 60;

export default async function Page() {
  const page = await getPageBySlug(PAGE_SLUG);
  if (!page) return notFound();

  const categories = await client.fetch(`
    *[_type=="${SANITY_DOC_TYPE.category}"]{
      _id,
      title,
      "slug": slug.current,
      description,
      mainImage
    }
  `);

  const latestArticles = await client.fetch(
    `*[_type=="${SANITY_DOC_TYPE.article}" && _createdAt <= now()] | order(_createdAt desc)[0...6]{
      _id,
      title,
      "slug": slug.current,
      description,
      mainImage,
      "cat": categories[0]->slug.current
    }`
  );

  const articlesWithHref = latestArticles.map(a => ({ ...a, href: `/${a.cat}/${a.slug}` }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Psihorelatii',
            url: DOMAIN
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: articlesWithHref.map((art, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `${DOMAIN}${art.href}`,
              name: art.title,
              description: art.description || undefined
            }))
          })
        }}
      />

      <PageTemplate
        page={page}
        jsonLdType="WebPage"
        canonical={`/`}
      />
      {/* categories services section */}
      <section id="categorii" className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
        <Categories categories={categories} />
      </section>
      <section id="articole" className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
        <Articles
          articles={articlesWithHref}
          title="Articole recente"
          intro="Cele mai noi articole publicate pe site."
        />
      </section>

      {Array.isArray(page?.faq) && page.faq.length > 0 && <FAQ FAQ={page.faq} />}
    </>
  );
}
