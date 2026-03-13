import { getCategoryBySlug, getArticlesByCategorySlug, getAllCategorySlugs } from "@/sanity/client"
import { buildPageMetadata, fromSanityImage } from "@/lib/metadata";
import PageTemplate from "@/components/PageTemplate";
import Articles from "@/components/Articles";
import FAQ from "@/components/FAQ";
import { notFound } from "next/navigation";
import { DOMAIN } from "@/lib/siteConfig";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { categories } = params;
  const data = await getCategoryBySlug(categories);

  return buildPageMetadata({
    title: data?.title,
    description: data?.description,
    image: fromSanityImage(data?.mainImage),
    path: `/${categories}`
  });
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((categories) => ({ categories }));
}

export default async function CategoryPage({ params }) {
  const { categories } = params;

  const category = await getCategoryBySlug(categories);
  if (!category) return notFound();

  const articles = await getArticlesByCategorySlug(categories);

  return (

    <>
      <PageTemplate page={category} jsonLdType="CollectionPage" canonical={`/${categories}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: (articles || []).map((art, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `${DOMAIN}/${categories}/${art.slug}`,
              name: art.title,
              description: art.description || undefined,
            })),
          }),
        }}
      />
      <Articles
        articles={articles}
        title={category?.title}
        intro={category?.description}
        categorySlug={categories}
      />
      <FAQ FAQ={category?.faq} />
    </>
  )
};
