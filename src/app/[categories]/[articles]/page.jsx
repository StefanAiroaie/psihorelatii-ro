import { client } from "@/sanity/client";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import { buildPageMetadata, DOMAIN, fromSanityImage } from "@/lib/metadata";
import FAQ from '@/components/FAQ'

function ptToPlain(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map(block => Array.isArray(block.children) ? block.children.map(ch => ch.text || '').join('') : '')
    .join('\n\n')
    .trim();
}
export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await client.fetch(`*[
    _type=="psihorelatii_ro_article" &&
    defined(categories[0]->slug.current) &&
    defined(slug.current)
  ]{
    "categories": categories[0]->slug.current,
    "articles": slug.current
  }`);
  return articles.map(a => ({
    categories: a.categories,
    articles: a.articles
  }));
}

export async function generateMetadata({ params }) {
  const { categories, articles } = await params;
  const data = await client.fetch(
    `*[_type=="psihorelatii_ro_article" && slug.current==$slug][0]{
      title,
      description,
      mainImage,
      publishedAt,
      _updatedAt
    }`,
    { slug: articles }
  );

  // Prefer the article image; fall back to first article in category
  let image = fromSanityImage(data?.mainImage);
  if (!image) {
    const first = await client.fetch(
      `*[_type=='psihorelatii_ro_article' && $slug in categories[]->slug.current][0]{ mainImage }`,
      { slug: categories }
    );
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
  const article = await client.fetch(
    `*[_type=="psihorelatii_ro_article" && slug.current==$slug][0]{
      title,
      description,
      mainImage,
      body,
      publishedAt,
      _updatedAt,
      faq[]{
        question,
        answer
      }
    }`,
    { slug: articles }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article?.title,
            description: article?.description,
            image: article?.mainImage ? [fromSanityImage(article.mainImage)] : undefined,
            articleSection: categories,
            datePublished: article?.publishedAt || undefined,
            dateModified: article?._updatedAt || undefined,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${DOMAIN}/${categories}/${articles}`
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Acasă', item: `${DOMAIN}/` },
              { '@type': 'ListItem', position: 2, name: categories, item: `${DOMAIN}/${categories}` },
              { '@type': 'ListItem', position: 3, name: article?.title, item: `${DOMAIN}/${categories}/${articles}` }
            ]
          })
        }}
      />
      {Array.isArray(article?.faq) && article.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: article.faq.map((item) => ({
                '@type': 'Question',
                name: item?.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: ptToPlain(item?.answer)
                }
              }))
            })
          }}
        />
      )}
      <section className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
        <article className="relative isolate overflow-hidden bg-white px-6 lg:overflow-visible lg:px-0">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="lg:max-w-lg">
                  <p className="text-base/7 font-semibold text-accent">Einsdasdasd</p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl">
                    {article?.title}
                  </h1>
                </div>
              </div>
            </div>
            <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
              <img
                alt={article?.title}
                src={urlFor(article?.mainImage)?.url()}
                className="w-3xl max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228"
              />
            </div>
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="max-w-xl text-base/7 text-dark lg:max-w-lg text-justify">
                  <div>
                    <PortableText
                      value={article?.body}
                      components={{
                        block: {
                          h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-primary">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-2xl font-semibold mt-5 mb-3 text-primary">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2 text-primary" >{children}</h3>,
                          normal: ({ children }) => <p className="mb-4 text-dark">{children}</p>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent pl-4 italic text-accent my-4">
                              {children}
                            </blockquote>
                          ),
                        },
                        list: {
                          bullet: ({ children }) => <ul className="text-accent list-disc pl-5 mb-4">{children}</ul>,
                          number: ({ children }) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
                        },
                        listItem: {
                          bullet: ({ children }) => <li className="mb-1">{children}</li>,
                          number: ({ children }) => <li className="mb-1">{children}</li>,
                        },
                        types: {
                          image: ({ value }) => (
                            <Image
                              src={urlFor(value)?.width(800).url()}
                              alt={value?.alt || 'Bild'}
                              className="my-4 rounded-lg shadow-md"
                            />
                          ),
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
      <FAQ faqs={article?.faq} />
    </>
  );
}