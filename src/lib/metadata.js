import { urlFor } from "@/sanity/client";
import { DOMAIN, SITE_NAME } from "@/lib/siteConfig";

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
export function buildPageMetadata(input) {
    const { title, description, image, path = "/", type = "website" } = input || {};
    const fullTitle = title ? title : SITE_NAME;
    const desc =
        description ||
        "Ghiduri clare despre relatii, atasament, gestionarea emotiilor si dezvoltare personala.";
    const canonical = `${DOMAIN}${path}`;

    return {
        title: fullTitle,
        description: desc,
        alternates: { canonical: canonical },
        openGraph: {
            title: fullTitle,
            description: desc,
            url: canonical,
            type,
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
