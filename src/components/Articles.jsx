import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client"; // adjust the path to your client.ts
const Articles = ({ articles, categorySlug }) => {
    return (
        <>
            <section className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                    <h2 className="text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl">
                        Explorează Articole complete care inspiră creștere și stare ta de bine
                    </h2>
                    <p className="mt-2 text-lg/8 text-dark">
                        Aici găsești o selecție de articole atent alese, relevante pentru tine.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {articles?.map((art) => {
                        // Ensure slugStr is a string, supporting both object and string
                        const slugStr = art.slug?.current || art.slug || "";
                        const href = art.href || `/${categorySlug ? `${categorySlug}/` : ''}${slugStr}`;
                        return (
                            <article key={art._id} className="flex flex-col items-start justify-between">
                                <div className="relative w-full">
                                    {art.mainImage && (
                                        <Image
                                            src={urlFor(art.mainImage).width(600).url()}
                                            alt={art.title}
                                            width={600}
                                            height={400}
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                            loading="lazy"
                                            className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2"
                                        />
                                    )}

                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                                </div>
                                <div className="max-w-xl">
                                    <div className="group relative">
                                        <h3 className="mt-3 text-lg/6 font-semibold text-primary group-hover:text-gray-600 ">
                                            <Link href={href}>
                                                <span className="absolute inset-0" />
                                                {art.title}
                                            </Link>
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-sm/6 text-dark">
                                            {art.description?.slice(0, 160)}{art.description?.length > 160 && '...'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-1 flex w-full justify-between items-center text-xs italic">
                                    <div>
                                    </div>
                                    <div>
                                        <Link
                                            href={href}
                                            className="text-sm text-primary hover:underline px-5"
                                        >
                                            citește mai departe
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>
        </>
    );
};

export default Articles;
