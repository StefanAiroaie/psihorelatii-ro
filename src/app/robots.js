// src/app/robots.js
const baseUrl = "https://psihorelatii.ro"; // sincron cu sitemap.js

export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}