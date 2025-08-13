import PageTemplate from "@/components/PageTemplate";
import { buildPageMetadata, DOMAIN, fromSanityImage } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/sanity/client";
import { client, SANITY_DOC_TYPE } from "@/sanity/client";
import FAQ from "@/components/FAQ";
import Categories from '@/components/Categories'
import Articles from '@/components/Articles'

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

export const revalidate = 0;

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

  // Fetch latest 100 then pick 10 random in JS (GROQ has no random() on your dataset)
  const latestArticles = await client.fetch(
    `*[_type=="${SANITY_DOC_TYPE.article}" && _createdAt <= now()] | order(_createdAt desc)[0...100]{
      _id,
      title,
      "slug": slug.current,
      description,
      mainImage,
      "cat": categories[0]->slug.current
    }`
  );

  function pickRandom(arr, n) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  const randomArticles = pickRandom(latestArticles, 10);
  const articlesWithHref = randomArticles.map(a => ({ ...a, href: `/${a.cat}/${a.slug}` }));

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

      <PageTemplate
        page={page}
        jsonLdType="WebPage"
        canonical={`/`}
      />
      {/* categories services section */}
      <section id="categorii" className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
        <Categories categories={categories} />
      </section>
      <section className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
        <Articles
          id="articole"
          articles={articlesWithHref}
          title="Articole la întâmplare"
          intro="O selecție aleatorie la fiecare refresh."
        />
      </section>

      {Array.isArray(page?.faq) && page.faq.length > 0 && <FAQ FAQ={page.faq} />}
    </>
  );
}
