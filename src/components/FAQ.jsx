import { PortableText } from '@portabletext/react';
const FAQ = ({ FAQ }) => {

    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ?.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
                    ?.map((block) =>
                        block.children?.map((child) => child.text).join(' ')
                    )
                    .join(' ')
            }
        }))
    };
    return (
        <>
            {/* FAQ section */}
            <section className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">

                <div className="bg-white mt-32 py-4 ">
                    <div id="faq" className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                            <h2 className="text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl">
                                Întrebări frecvente
                            </h2>
                            <p className="mt-2 text-lg/8 text-dark">
                                În această secțiune găsești răspunsuri clare și concise la cele mai comune întrebări.
                                Scopul este să îți oferim informațiile de care ai nevoie rapid și ușor, pentru a-ți sprijini
                                procesul de înțelegere și luare a deciziilor.
                            </p>

                        </div>
                        <dl className="mt-20 divide-y divide-gray-900/10">
                            {FAQ?.map((faq, index) => (
                                <div key={index} className="py-8 first:pt-0 last:pb-0 lg:grid lg:grid-cols-12 lg:gap-8">
                                    <dt className="text-base/7 font-semibold text-accent lg:col-span-5">{faq.question}</dt>
                                    <dd className="mt-4 lg:col-span-7 lg:mt-0">
                                        <PortableText
                                            value={faq.answer}
                                            components={{
                                                block: {
                                                    h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-primary">{children}</h1>,
                                                    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-5 mb-3 text-primary">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2 text-primary" >{children}</h3>,
                                                    normal: ({ children }) => <p className="mb-4 text-dark">{children}</p>,
                                                    blockquote: ({ children }) => (
                                                        <blockquote className="border-l-4 border-accent pl-4 italic text-accent my-4">
                                                            {children}
                                                        </blockquote>
                                                    ),
                                                },
                                                list: {
                                                    bullet: ({ children }) => <ul className="text-accent list-disc pl-5 mb-4">{children}</ul>,
                                                    number: ({ children }) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
                                                },
                                                listItem: {
                                                    bullet: ({ children }) => <li className="mb-1">{children}</li>,
                                                    number: ({ children }) => <li className="mb-1">{children}</li>,
                                                },
                                                types: {
                                                    image: ({ value }) => (
                                                        <img
                                                            src={urlFor(value).width(800).url()}
                                                            alt={value.alt || 'Bild'}
                                                            className="my-4 rounded-lg shadow-md"
                                                        />
                                                    ),
                                                },
                                                marks: {
                                                    link: ({ value, children }) => {
                                                        const href = value?.href || '#';
                                                        const isExternal = href.startsWith('http');
                                                        return (
                                                            <a
                                                                href={href}
                                                                target={isExternal ? '_blank' : undefined}
                                                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                                                className="text-accent underline hover:text-primary"
                                                            >
                                                                {children}
                                                            </a>
                                                        );
                                                    },
                                                },
                                            }}
                                        />
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div >
            </section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
            />
        </>
    );
};

export default FAQ;
