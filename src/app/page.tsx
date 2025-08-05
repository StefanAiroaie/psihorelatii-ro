import { client, urlFor } from "@/sanity/client"; // adjust the path to your client.ts
import Image from "next/image";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
  publishedAt?: string;
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  posts: Post[];
}

export default async function Home() {
  const categories: Category[] = await client.fetch(`
    *[_type == "psihorelatii_ro_category"]{
      _id,
      title,
      slug,
      "posts": *[_type == "psihorelatii_ro_post" && references(^._id)] | order(publishedAt desc){
        _id,
        title,
        slug,
        mainImage,
        publishedAt
      }
    }
  `);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-16">
      {categories.map((cat) => (
        <section key={cat._id} id={cat.slug.current} className="space-y-4">
          <h2 className="text-3xl font-bold">{cat.title}</h2>

          {cat.posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {cat.posts.map((post) => (
                <article key={post._id} className="border rounded p-4">
                  <a href={`/articol/${post.slug.current}`}>
                    {post.mainImage && (
                      <Image
                        src={urlFor(post.mainImage).width(600).url()}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="mb-2 rounded"
                      />
                    )}
                    <h3 className="font-semibold">{post.title}</h3>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nu există articole încă în această categorie.</p>
          )}
        </section>
      ))}
    </main>
  );
}
