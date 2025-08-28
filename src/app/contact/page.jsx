import PageTemplate from "@/components/PageTemplate";
import { buildPageMetadata, DOMAIN } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/sanity/client";
import { fromSanityImage } from "@/lib/metadata";


// SINGLE SOURCE OF TRUTH for this static page
const PAGE_SLUG = "contact"; // change only here
const PAGE_URL = `${DOMAIN}/${PAGE_SLUG}`;


export async function generateMetadata() {
  const page = await getPageBySlug(PAGE_SLUG);

  return buildPageMetadata({
    title: page?.title,
    description: page?.description,
    image: page?.mainImage ? fromSanityImage(page.mainImage) : undefined,
    path: `/${PAGE_SLUG}`,
  });
}



export const revalidate = 60;

export default async function Page() {
  const page = await getPageBySlug(PAGE_SLUG);
  if (!page) return notFound();
  return (
    <PageTemplate
      page={page}
      jsonLdType="WebPage"
      canonical={`/${PAGE_SLUG}`}
    />
  );
}
