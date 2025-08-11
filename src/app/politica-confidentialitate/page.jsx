import PageTemplate from "@/components/PageTemplate";
import { buildPageMetadata, DOMAIN } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { client, SANITY_DOC_TYPE } from "@/sanity/client";

const slug = "politica-confidentialitate"; //EDIT HERE THE PAGE NAME
const url = `${DOMAIN}/${slug}`;

export async function generateMetadata() {
  const page = await client.fetch(`*[_type=="${SANITY_DOC_TYPE.page}" && slug.current=="${slug}"][0]{
    title, description, mainImage, _updatedAt
  }`);
  return buildPageMetadata(page, { url });
}

export const revalidate = 60;

export default async function Page() {
  const page = await client.fetch(`*[_type=="${SANITY_DOC_TYPE.page}" && slug.current=="${slug}"][0]{
    title, description, mainImage, body, faq[]{question, answer}
  }`);
  if (!page) return notFound();
  return <PageTemplate page={page} jsonLdType="WebPage" canonical={`/${slug}`} />;
}


