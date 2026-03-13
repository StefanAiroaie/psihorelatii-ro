export const SITE_NAME = "Psihologia relatiilor";
export const DOMAIN = "https://psihorelatii.ro";

export const CATEGORY_NAV = [
  { title: "Relatii", slug: "relatii" },
  { title: "Despartiri si refacere", slug: "despartiri-refacere" },
  { title: "Atasament", slug: "atasament-stiluri-afective" },
  { title: "Gestionarea emotiilor", slug: "gestionarea-emotiilor" },
  { title: "Psihologie practica", slug: "psihologie-practica" },
  { title: "Dezvoltare personala", slug: "dezvoltare-personala" },
];

export const STATIC_ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/despre-noi", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/politica-confidentialitate", changeFrequency: "yearly", priority: 0.3 },
  { path: "/politica-cookie", changeFrequency: "yearly", priority: 0.3 },
  { path: "/politica-afiliere", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
  { path: "/termeni-conditii", changeFrequency: "yearly", priority: 0.3 },
];
