import { getArticleBySlugPublic, getFirstArticleImageByCategorySlug, getAllArticlePaths } from "@/sanity/client";
import { buildPageMetadata, DOMAIN, fromSanityImage } from "@/lib/metadata";
import FAQ from '@/components/FAQ'
import PageTemplate from "@/components/PageTemplate";
import { notFound } from "next/navigation";

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
    path: `/${categories}/${articles}`
  });
}

export default async function PageArticle({ params }) {
  const { categories, articles } = await params;
  const article = await getArticleBySlugPublic(articles);

  if (!article) return notFound();

  return (
    <>
      <PageTemplate page={article} jsonLdType="Article" canonical={`/${categories}/${articles}`} />

      {Array.isArray(article?.faq) && article.faq.length > 0 && (
        <FAQ FAQ={article.faq} />
      )}
    </>
  );
}