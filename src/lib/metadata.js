import { urlFor } from "@/sanity/client";

// Centralize these two so you don't repeat them anywhere else
export const SITE_NAME = "Psihologia relatiilor";
export const DOMAIN = "https://psihorelatii.ro";

// Helper if you use Sanity images for OG
export function fromSanityImage(img) {
    return img ? urlFor(img).width(1200).height(630).url() : undefined;
}

/**
 * Tiny, universal builder for Next.js metadata.
 * Call it with raw pieces, NOT with the whole page object.
 *
 * Example:
 *   const image = fromSanityImage(page?.mainImage);
 *   return buildPageMetadata({
 *     title: page?.title,
 *     description: page?.description,
 *     image,
 *     path: `/${slug}`
 *   });
 */
export function buildPageMetadata({ title, description, image, path = "/" } = {}) {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description || "Pagini informative.";
    const canonical = `${DOMAIN}${path}`;

    return {
        title: fullTitle,
        description: desc,
        alternates: { canonical: canonical },
        openGraph: {
            title: fullTitle,
            description: desc,
            url: canonical,
            type: "website",
            images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
        },
        twitter: {
            card: image ? "summary_large_image" : "summary",
            title: fullTitle,
            description: desc,
            images: image ? [image] : undefined,
        },
        robots: { index: true, follow: true },
    };
}