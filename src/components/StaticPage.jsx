import PageTemplate from "@/components/PageTemplate";
import { buildPageMetadata } from "@/lib/metadata";
import { LOCAL_PAGES } from "@/lib/localPages";
import { notFound } from "next/navigation";

export function getLocalPageMetadata(slug) {
  const page = LOCAL_PAGES[slug];
  if (!page) {
    return null;
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/${slug}`,
    type: "article",
  });
}

export default function StaticPage({ slug }) {
  const page = LOCAL_PAGES[slug];

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} jsonLdType="WebPage" canonical={`/${slug}`} />;
}
