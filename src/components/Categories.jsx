import Image from "next/image";
import { urlFor } from "@/sanity/client"; // adjust the path to your client.ts
const Categories = ({ categories }) => {
    return (
        <>

            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <h2 className="text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl">
                    Explore Topics That Inspire Growth and Well-Being
                </h2>
                <p className="mt-2 text-lg/8 text-dark">
                    This section introduces a collection of curated categories or topics designed to offer helpful insights and resources. Whether you're exploring relationships, emotional health, personal development, or mental well-being, each entry here is meant to guide and support your journey.
                </p>

            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {categories?.map((cat) => (
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
                                    <a href={`/${cat.slug?.current}`}>
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
                                    href={`/${cat.slug?.current}`}
                                    className="text-sm text-primary hover:underline px-5"
                                >
                                    citste mai departe
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

        </>
    );
};

export default Categories;
