// src/app/robots.js
import { DOMAIN } from "@/lib/siteConfig";

const baseUrl = DOMAIN; // sincron cu sitemap.js

export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
