import { client } from "@/sanity/client"
import Image from "next/image";
import { urlFor } from "@/sanity/client";

export const revalidate = 60;

export async function generateStaticParams() {
  const cats = await client.fetch(`*[_type=='category']{ slug }`);
  return cats.map(c => ({ categories: c.slug.current }));
}

export default async function CategoryPage({ params }) {
  const { categories } = params;


  const articles = await client.fetch(
    `*[_type=='psihorelatii_ro_article' && $catSlug in categories[]->slug.current]{
      _id,
      title,
      "slug": slug.current,
      description,
      mainImage
    }`,
    { catSlug: categories }
  );

  const category = await client.fetch(
    `*[_type=='category' && slug.current==$slug][0]{ title, description, coverImage }`,
    { slug: categories }
  );

  return (

    <>
      {/* categories */}
      <section className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl">
            {category?.title || 'Descoperă psihologia relațiilor și echilibrul interior'}
          </h2>
          <p className="mt-2 text-lg/8 text-dark">
            {category?.description || (
              <>
                Pe <strong>psihorelatii.ro</strong> găsești sfaturi practice și articole
                inspirate din psihologie pentru o viață mai armonioasă.
                De la <strong>relații de cuplu</strong> și <strong>gestionarea emoțiilor</strong> până la <strong>dezvoltare personală</strong> și <strong>sănătate mintală</strong>,
                fiecare articol este gândit să te ajute să înțelegi mai bine lumea ta interioară
                și conexiunile cu cei din jur.
              </>
            )}
          </p>

        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {articles?.map((cat) => (
            <article key={cat._id} className="flex flex-col items-start justify-between">
              <div className="relative w-full">
                {cat.mainImage && (
                  <Image
                    src={urlFor(cat.mainImage).width(600).url()}
                    alt={cat.title}
                    width={600}
                    height={400}
                    className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2"
                  />
                )}

                <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
              </div>
              <div className="max-w-xl">
                <div className="group relative">
                  <h3 className="mt-3 text-lg/6 font-semibold text-primary group-hover:text-gray-600 ">
                    <a href={`/${categories}/${cat.slug}`}>
                      <span className="absolute inset-0" />
                      {cat.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-dark">
                    {cat.description?.slice(0, 160)}{cat.description?.length > 160 && '...'}
                  </p>
                </div>
              </div>

              <div className="mt-1 flex w-full justify-between items-center text-xs italic">
                <div>
                </div>
                <div>
                  <a
                    href={`/${categories}/${cat.slug}`}
                    className="text-sm text-primary hover:underline px-5"
                  >
                    citeste mai departe
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section >

    </>
  )
};