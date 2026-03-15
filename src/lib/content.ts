import readingTime from "reading-time";

export const site = {
  name: "Psihorelatii.ro",
  legalName: "Psihologia relatiilor",
  url: "https://psihorelatii.ro",
  description:
    "Ghiduri clare despre relatii, atasament, gestionarea emotiilor si dezvoltare personala.",
  defaultImage: "/content/images/pages/pages-.webp",
  editorial: {
    authorName: "Stefan",
    authorRole: "Fondator Psihorelatii.ro",
    authorBio:
      "Pasionat de psihologie aplicata, relatii si reglare emotionala. Scriu despre ideile care m-au ajutat personal sa inteleg mai bine comportamentul uman si transformarile prin care trecem in viata reala.",
    disclaimer:
      "Materialele au rol informativ si educational si nu inlocuiesc sprijinul oferit de un specialist acreditat.",
    contactPath: "/contact",
  },
} as const;

type FaqItem = { question: string; answer: string };

type SharedData = {
  title: string;
  pageTitle: string;
  metaTitle: string;
  description: string;
  slug: string;
  image?: string | null;
  imageAlt?: string;
  updatedAt?: string;
  faq?: FaqItem[];
};

export type PageData = SharedData;
export type CategoryData = SharedData;
export type ArticleData = SharedData & {
  category: string;
  categoryTitle: string;
  publishedAt: string;
};

type Heading = { depth: number; slug: string; text: string };

type ModuleShape<T> = {
  frontmatter: T;
  default: unknown;
  getHeadings?: () => Promise<Heading[]> | Heading[];
};

export type LoadedEntry<T> = {
  id: string;
  data: T;
  Content: unknown;
  getHeadings: () => Promise<Heading[]>;
  readingMinutes?: number;
};

const pageModules = import.meta.glob<ModuleShape<PageData>>("../content/pages/*.mdx");
const categoryModules = import.meta.glob<ModuleShape<CategoryData>>("../content/categories/*.mdx");
const articleModules = import.meta.glob<ModuleShape<ArticleData>>("../content/articles/*.mdx");
const pageRawModules = import.meta.glob("../content/pages/*.mdx", { query: "?raw", import: "default" });
const categoryRawModules = import.meta.glob("../content/categories/*.mdx", { query: "?raw", import: "default" });
const articleRawModules = import.meta.glob("../content/articles/*.mdx", { query: "?raw", import: "default" });

async function loadEntries<T>(
  modules: Record<string, () => Promise<ModuleShape<T>>>,
  rawModules: Record<string, () => Promise<unknown>>
): Promise<LoadedEntry<T>[]> {
  return Promise.all(
    Object.entries(modules).map(async ([id, loader]) => {
      const mod = await loader();
      const rawLoader = rawModules[id];
      const source = rawLoader ? String(await rawLoader()) : "";
      const stats = readingTime(source);
      return {
        id,
        data: mod.frontmatter,
        Content: mod.default,
        readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
        getHeadings: async () => {
          if (!mod.getHeadings) return [];
          return (await mod.getHeadings()) || [];
        },
      };
    })
  );
}

type DatedEntry = {
  updatedAt?: string;
  publishedAt?: string;
};

function sortByUpdated<T extends DatedEntry>(items: LoadedEntry<T>[]) {
  return items.sort((a, b) => {
    const left = new Date(a.data.updatedAt || a.data.publishedAt || 0).getTime();
    const right = new Date(b.data.updatedAt || b.data.publishedAt || 0).getTime();
    return right - left;
  });
}

export async function getAllArticles() {
  return sortByUpdated(await loadEntries<ArticleData>(articleModules, articleRawModules));
}

export async function getAllCategories() {
  return sortByUpdated(await loadEntries<CategoryData>(categoryModules, categoryRawModules));
}

export async function getAllPages() {
  return await loadEntries<PageData>(pageModules, pageRawModules);
}

export async function getHomePage() {
  const pages = await getAllPages();
  return pages.find((entry) => entry.data.slug === "/");
}

export async function getStaticPages() {
  const pages = await getAllPages();
  return pages.filter((entry) => entry.data.slug !== "/");
}

export async function getArticlesByCategory(category: string) {
  const articles = await getAllArticles();
  return articles.filter((entry) => entry.data.category === category);
}

export async function getRelatedArticles(category: string, currentSlug: string, limit = 3) {
  const articles = await getArticlesByCategory(category);
  const others = articles.filter((entry) => entry.data.slug !== currentSlug);
  if (others.length <= limit) return others;
  let hash = 0;
  for (let i = 0; i < currentSlug.length; i++) {
    hash = ((hash << 5) - hash + currentSlug.charCodeAt(i)) | 0;
  }
  const offset = Math.abs(hash) % Math.max(1, others.length - limit);
  return others.slice(offset, offset + limit);
}

export async function getCrossCategoryArticles(category: string, currentSlug: string, limit = 3) {
  const articles = await getAllArticles();
  const others = articles.filter(
    (entry) => entry.data.category !== category && entry.data.slug !== currentSlug
  );
  // Use a simple hash of the slug to pick a deterministic but varied offset
  let hash = 0;
  for (let i = 0; i < currentSlug.length; i++) {
    hash = ((hash << 5) - hash + currentSlug.charCodeAt(i)) | 0;
  }
  const offset = Math.abs(hash) % Math.max(1, others.length - limit);
  return others.slice(offset, offset + limit);
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, site.url).toString();
}

export function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
