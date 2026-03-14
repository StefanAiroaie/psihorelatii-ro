import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { LOCAL_PAGES } from "../src/lib/localPages.js";

const client = createClient({
  projectId: "rb4c8hjj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
const root = process.cwd();
const contentRoot = path.join(root, "src", "content");
const publicRoot = path.join(root, "public", "content");

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function toKebab(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inlineMarks(text, marks = [], markDefs = []) {
  if (!text) return "";
  let output = text.replace(/\n/g, " ").replace(/\*/g, "\\*");

  for (const mark of marks) {
    if (mark === "strong") {
      output = `**${output}**`;
      continue;
    }

    if (mark === "em") {
      output = `*${output}*`;
      continue;
    }

    const def = markDefs.find((item) => item._key === mark && item._type === "link");
    if (def?.href) {
      output = `[${output}](${def.href})`;
    }
  }

  return output;
}

function blockText(block) {
  return ensureArray(block?.children)
    .map((child) => inlineMarks(child.text || "", child.marks || [], block.markDefs || []))
    .join("");
}

function portableTextToMarkdown(blocks, options = {}) {
  const items = ensureArray(blocks);
  const lines = [];

  for (let index = 0; index < items.length; index += 1) {
    const block = items[index];
    if (!block) continue;

    if (block._type === "image") {
      if (options.imageMap?.[block._key]) {
        lines.push(`![${block.alt || options.title || "Imagine"}](${options.imageMap[block._key]})`);
        lines.push("");
      }
      continue;
    }

    if (block.listItem) {
      const listType = block.listItem === "number" ? "number" : "bullet";
      const buffer = [];

      while (index < items.length && items[index]?.listItem === block.listItem) {
        const current = items[index];
        const prefix = listType === "number" ? "1. " : "- ";
        buffer.push(`${prefix}${blockText(current)}`);
        index += 1;
      }

      index -= 1;
      lines.push(...buffer, "");
      continue;
    }

    const text = blockText(block).trim();
    if (!text) continue;

    if (block.style === "h1") {
      lines.push(`# ${text}`, "");
      continue;
    }

    if (block.style === "h2") {
      lines.push(`## ${text}`, "");
      continue;
    }

    if (block.style === "h3") {
      lines.push(`### ${text}`, "");
      continue;
    }

    if (block.style === "blockquote") {
      lines.push(`> ${text}`, "");
      continue;
    }

    lines.push(text, "");
  }

  return lines.join("\n").trim();
}

function faqToFrontmatter(faq) {
  return ensureArray(faq)
    .map((item) => ({
      question: item.question,
      answer: portableTextToMarkdown(item.answer || []).replace(/\n+/g, " ").trim(),
    }))
    .filter((item) => item.question && item.answer);
}

function extractPageTitle(doc) {
  const body = ensureArray(doc.body);
  const first = body[0];
  if (first?.style === "h1") {
    return {
      pageTitle: blockText(first).trim(),
      body: body.slice(1),
    };
  }

  return {
    pageTitle: doc.title,
    body,
  };
}

function sanityImageUrl(source) {
  if (!source) return null;
  return builder.image(source).width(1600).fit("max").quality(82).auto("format").url();
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, buffer);
}

async function prepareImage(doc, folder) {
  if (!doc?.mainImage) {
    return null;
  }

  const sourceUrl = sanityImageUrl(doc.mainImage);
  if (!sourceUrl) {
    return null;
  }

  const fileName = `${folder}-${toKebab(doc.slug || doc.title)}.webp`;
  const relativePath = `/content/images/${folder}/${fileName}`;
  const fullPath = path.join(publicRoot, "images", folder, fileName);
  await download(sourceUrl, fullPath);
  return relativePath;
}

async function writeMdx(collection, fileName, frontmatter, body) {
  const dir = path.join(contentRoot, collection);
  await fs.mkdir(dir, { recursive: true });
  const content = `---\n${yaml.dump(frontmatter, { lineWidth: 1000 }).trim()}\n---\n\n${body.trim()}\n`;
  await fs.writeFile(path.join(dir, fileName), content);
}

async function buildDataset() {
  const data = JSON.parse(await fs.readFile(path.join(root, "tmp", "sanity-export.json"), "utf8"));
  const pageOverrides = ["contact", "despre-noi", "disclaimer", "politica-afiliere"];

  const pages = data.pages.map((page) => {
    if (!pageOverrides.includes(page.slug)) {
      return page;
    }

    const localPage = LOCAL_PAGES[page.slug];
    return {
      ...page,
      ...localPage,
      slug: page.slug,
      mainImage: null,
    };
  });

  return {
    pages,
    categories: data.categories,
    articles: data.articles,
  };
}

async function main() {
  const data = await buildDataset();

  await fs.rm(contentRoot, { recursive: true, force: true });
  await fs.mkdir(contentRoot, { recursive: true });

  for (const page of data.pages) {
    const image = await prepareImage(page, "pages");
    const { pageTitle, body } = extractPageTitle(page);
    const slug = page.slug === "/" ? "home" : page.slug;

    await writeMdx(
      "pages",
      `${slug}.mdx`,
      {
        title: page.title,
        pageTitle,
        metaTitle: page.title,
        description: page.description,
        slug: page.slug,
        image,
        imageAlt: page.title,
        updatedAt: page._updatedAt,
        faq: faqToFrontmatter(page.faq),
      },
      portableTextToMarkdown(body, { title: pageTitle })
    );
  }

  for (const category of data.categories) {
    const image = await prepareImage(category, "categories");
    const { pageTitle, body } = extractPageTitle(category);

    await writeMdx(
      "categories",
      `${category.slug}.mdx`,
      {
        title: category.title,
        pageTitle,
        metaTitle: category.title,
        description: category.description,
        slug: category.slug,
        image,
        imageAlt: category.title,
        updatedAt: category._updatedAt,
        faq: faqToFrontmatter(category.faq),
      },
      portableTextToMarkdown(body, { title: pageTitle })
    );
  }

  for (const article of data.articles) {
    const image = await prepareImage(article, "articles");
    const { pageTitle, body } = extractPageTitle(article);
    const primaryCategory = ensureArray(article.categories)[0];

    await writeMdx(
      "articles",
      `${primaryCategory?.slug || "general"}--${article.slug}.mdx`,
      {
        title: article.title,
        pageTitle,
        metaTitle: article.title,
        description: article.description,
        slug: article.slug,
        category: primaryCategory?.slug || "general",
        categoryTitle: primaryCategory?.title || "General",
        image,
        imageAlt: article.title,
        publishedAt: article._createdAt,
        updatedAt: article._updatedAt,
        faq: faqToFrontmatter(article.faq),
      },
      portableTextToMarkdown(body, { title: pageTitle })
    );
  }

  console.log(`Migrated ${data.pages.length} pages, ${data.categories.length} categories and ${data.articles.length} articles to MDX.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
