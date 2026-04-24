# _drafts — articole pregătite, NEPUBLICATE

## Cum funcționează

Folderul acesta conține articole scrise înainte de data lor de publicare. Sunt **invizibile pe site** pentru că glob-ul din `src/lib/content.ts` este non-recursiv:

```ts
const articleModules = import.meta.glob("../content/articles/*.mdx");
```

`*.mdx` scanează DOAR nivelul direct din `articles/`, nu subfoldere. Astro nu știe că aceste fișiere există.

## Cum publici un articol din _drafts

1. Deschide proiectul în VS Code
2. **Mută** fișierul `.mdx` din `_drafts/` în părintele `articles/`
   (sau, pentru OPTIMIZĂRI, **suprascrie** fișierul existent din `articles/` cu versiunea din `_drafts/`)
3. Rulează `npm run dev` și verifică articolul local
4. `git add . && git commit -m "Publish: {slug}" && git push`
5. Cloudflare Pages face rebuild automat → articol live în ~2 minute

## Regula de linking intern

Fiecare articol din `_drafts/` leagă DOAR la articole care vor fi **deja publicate** la data lui de publicare. Nu se fac linkuri spre articole viitoare (ar fi 404 și penalizare SEO).

## Imaginile

Imaginile pentru articolele din `_drafts/` pot fi deja în `/public/content/images/articles/`. Google nu le indexează atâta timp cât nu sunt linkate dintr-un HTML public (articol în `articles/`, sitemap etc.).
