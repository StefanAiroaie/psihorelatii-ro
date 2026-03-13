import { getArticleBySlugPublic, getFirstArticleImageByCategorySlug, getAllArticlePaths, getArticlesByCategorySlug } from "@/sanity/client";
import { buildPageMetadata, fromSanityImage } from "@/lib/metadata";
import FAQ from '@/components/FAQ'
import PageTemplate from "@/components/PageTemplate";
import { notFound } from "next/navigation";
import Articles from "@/components/Articles";
import { DOMAIN } from "@/lib/siteConfig";

function ptToPlain(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map(block => Array.isArray(block.children) ? block.children.map(ch => ch.text || '').join('') : '')
    .join('\n\n')
    .trim();
}
export const revalidate = 60;

export async function generateStaticParams() {
  const paths = await getAllArticlePaths();
  return paths.map(p => ({ categories: p.categories, articles: p.articles }));
}

export async function generateMetadata({ params }) {
  const { categories, articles } = await params;
  const data = await getArticleBySlugPublic(articles);

  // Prefer the article image; fall back to first article in category
  let image = fromSanityImage(data?.mainImage);
  if (!image) {
    const first = await getFirstArticleImageByCategorySlug(categories);
    image = fromSanityImage(first?.mainImage);
  }

  return buildPageMetadata({
    title: data?.title || 'Articol',
    description: data?.description,
    image,
    path: `/${categories}/${articles}`,
    type: "article",
  });
}

export default async function PageArticle({ params }) {
  const { categories, articles } = await params;
  const article = await getArticleBySlugPublic(articles);

  if (!article) return notFound();

  const relatedArticlesRaw = await getArticlesByCategorySlug(categories);
  const relatedArticles = (relatedArticlesRaw || [])
    .filter((item) => item.slug !== articles)
    .slice(0, 3);

  return (
    <>
      <PageTemplate page={article} jsonLdType="Article" canonical={`/${categories}/${articles}`} />

      {relatedArticles.length > 0 && (
        <Articles
          articles={relatedArticles}
          categorySlug={categories}
          title="Citeste si"
          intro="Articole din aceeasi categorie, utile pentru aprofundare."
        />
      )}

      {Array.isArray(article?.faq) && article.faq.length > 0 && (
        <FAQ FAQ={article.faq} />
      )}
    </>
  );
}
