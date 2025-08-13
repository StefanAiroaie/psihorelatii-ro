'use client';
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/client";
import { DOMAIN, SITE_NAME } from "@/lib/metadata";

export default function PageTemplate({ page, jsonLdType = "WebPage", canonical }) {
    const path = canonical?.startsWith('/') ? canonical : `/${canonical ?? ''}`;
    const absUrl = `${DOMAIN}${path}`;

    const ogImage = page?.mainImage ? urlFor(page.mainImage).width(1200).height(630).url() : undefined;
    const isArticle = jsonLdType === "Article";
    const ld = isArticle
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: page?.title,
            description: page?.description,
            image: ogImage ? [ogImage] : undefined,
            datePublished: page?._createdAt || undefined,
            dateModified: page?._updatedAt || undefined,
            author: page?.author?.name
                ? { "@type": "Person", name: page.author.name, url: page?.author?.url || undefined }
                : { "@type": "Organization", name: SITE_NAME, url: DOMAIN },
            publisher: { "@type": "Organization", name: SITE_NAME, url: DOMAIN },

            mainEntityOfPage: { "@type": "WebPage", "@id": absUrl }
        }
        : {
            "@context": "https://schema.org",
            "@type": jsonLdType,
            name: page?.title,
            description: page?.description,
            mainEntityOfPage: { "@type": "WebPage", "@id": absUrl }
        };

    // Build dynamic breadcrumbs from canonical path
    const segments = path.split('/').filter(Boolean);
    let acc = '';
    const dynamicCrumbs = segments.map((seg) => {
        acc += `/${seg}`;
        return {
            name: decodeURIComponent(seg)
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (ch) => ch.toUpperCase()),
            href: `${DOMAIN}${acc}`
        };
    });

    let crumbs = [{ name: 'Acasă', href: `${DOMAIN}/` }, ...dynamicCrumbs];
    if (page?.title && crumbs.length > 1) {
        crumbs[crumbs.length - 1] = { name: page.title, href: absUrl };
    }

    return (
        <>
            {/* Page JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(ld)
                }}
            />
            {/* Breadcrumbs */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: crumbs.map((c, i) => ({
                            "@type": "ListItem",
                            position: i + 1,
                            name: c.name,
                            item: c.href
                        }))
                    })
                }}
            />
            <section className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
                <article className="relative isolate overflow-hidden bg-white px-6 lg:overflow-visible lg:px-0">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                            <div className="lg:pr-4">
                                <div className="lg:max-w-lg">
                                    {/* Breadcrumbs */}
                                    <p className="text-sm font-semibold text-accent">
                                        {crumbs.map((crumb, index) => (
                                            <span key={crumb.href}>
                                                <a href={crumb.href}>{crumb.name}</a>
                                                {index < crumbs.length - 1 && ' / '}
                                            </span>
                                        ))}
                                    </p>
                                    {/* Article */}
                                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl">
                                        {page?.title}
                                    </h1>
                                    {page?.description && <p className="mt-4 text-dark">{page.description}</p>}
                                </div>
                            </div>
                        </div>

                        {page?.mainImage && (
                            <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                                <Image
                                    alt={page?.title || `${DOMAIN}${path}`}
                                    src={urlFor(page.mainImage).width(1200).height(800).url()}
                                    width={1200}
                                    height={800}
                                    className="w-3xl max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228"
                                />
                            </div>
                        )}

                        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                            <div className="lg:pr-4">
                                <div className="max-w-xl text-base/7 text-dark lg:max-w-lg text-justify">
                                    <PortableText
                                        value={page?.body}
                                        components={{
                                            block: {
                                                h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-primary">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-2xl font-semibold mt-5 mb-3 text-primary">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2 text-primary">{children}</h3>,
                                                normal: ({ children }) => <p className="mb-4 text-dark">{children}</p>,
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-accent pl-4 italic text-accent my-4">{children}</blockquote>
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
                                                        src={urlFor(value).width(800).url()}
                                                        alt={value.alt || "Imagine"}
                                                        width={800}
                                                        height={533}
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
                </article>
            </section>
        </>
    );
}