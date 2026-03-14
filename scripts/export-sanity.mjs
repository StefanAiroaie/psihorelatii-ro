import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "rb4c8hjj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

function imageUrl(source) {
  if (!source) return null;
  return builder.image(source).url();
}

async function main() {
  const query = `{
    "pages": *[_type == "psihorelatii_ro_page"] | order(title asc){
      _id,
      _type,
      title,
      description,
      _updatedAt,
      "slug": slug.current,
      mainImage,
      body,
      faq
    },
    "categories": *[_type == "psihorelatii_ro_category"] | order(title asc){
      _id,
      _type,
      title,
      description,
      _updatedAt,
      "slug": slug.current,
      mainImage,
      body,
      faq
    },
    "articles": *[_type == "psihorelatii_ro_article" && defined(slug.current)] | order(_createdAt asc){
      _id,
      _type,
      title,
      description,
      _createdAt,
      _updatedAt,
      "slug": slug.current,
      categories[]->{title, "slug": slug.current},
      mainImage,
      body,
      faq
    }
  }`;

  const data = await client.fetch(query);
  const withImageUrls = {
    pages: (data.pages || []).map((item) => ({ ...item, mainImageUrl: imageUrl(item.mainImage) })),
    categories: (data.categories || []).map((item) => ({ ...item, mainImageUrl: imageUrl(item.mainImage) })),
    articles: (data.articles || []).map((item) => ({ ...item, mainImageUrl: imageUrl(item.mainImage) })),
  };

  const outDir = path.join(process.cwd(), "tmp");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "sanity-export.json"), JSON.stringify(withImageUrls, null, 2));
  console.log(`Exported ${withImageUrls.pages.length} pages, ${withImageUrls.categories.length} categories, ${withImageUrls.articles.length} articles.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
