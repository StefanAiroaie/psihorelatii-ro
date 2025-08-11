
import { client } from "@/sanity/client"
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import FAQ from '@/components/FAQ'
import Categories from '@/components/Categories'

export const revalidate = 60  // ISR: Regenerate the page every 60s
export default async function Home() {
  // 1. Fetch data directly in the server component
  const categories = await client.fetch(`
    *[_type=='psihorelatii_ro_category']{
      _id,
      title,
      slug,
      description,
      mainImage
    }
  `)

  const problems = [
    {
      name: "Common Challenge 1",
      description: "A brief explanation of a typical issue users might encounter, such as lack of direction or overwhelming complexity in a certain process."
    },
    {
      name: "Common Challenge 2",
      description: "Another example of a problem area, like inconsistent feedback or difficulty in accessing reliable information."
    }
  ];

  const benefits = [
    {
      name: "User Benefit 1",
      description: "An expanded description of a key advantage users will gain, such as improved clarity and structured support throughout their journey."
    },
    {
      name: "User Benefit 2",
      description: "Another benefit highlighting user empowerment, reduced stress, or enhanced results through guided assistance."
    }
  ];

  const stats = [
    { label: 'Key Metric A', value: 'Sample Value A' },
    { label: 'Key Metric B', value: 'Sample Value B' },
    { label: 'Key Metric C', value: 'Sample Value C' },
  ];

  const faqs = [
    {
      question: "What is the purpose of this section?",
      answer: [{ _type: 'block', style: 'normal', children: [{ text: 'This placeholder answer explains how this section helps address common user questions in a general context.' }] }]
    },
    {
      question: "How can this template be adapted?",
      answer: [{ _type: 'block', style: 'normal', children: [{ text: 'This placeholder answer suggests that each section can be updated with context-specific information depending on project needs.' }] }]
    }
  ];

  return (

    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Psihorelatii',
            url: 'https://psihorelatii.ro'
          })
        }}
      />
      <div className="bg-white">
        <div className="isolate">

          {/* Hero section */}
          <section className="relative isolate -z-10">
            <svg
              aria-hidden="true"
              className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)] stroke-gray-200"
            >
              <defs>
                <pattern
                  x="50%"
                  y={-1}
                  id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={-1} className="overflow-visible fill-light">
                <path
                  d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={0} />
            </svg>
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            >
              <div
                style={{
                  clipPath:
                    'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
                }}
                className="aspect-801/1036 w-[50.0625rem] bg-linear-to-tr from-accent to-primary opacity-30"
              />
            </div>
            <div className="overflow-hidden">
              <div className="mx-auto max-w-7xl px-6 pt-16 pb-32 lg:px-8 lg:pt-2">
                <div className="mx-auto max-w-2xl gap-x-4 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                  <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                    <h1 className="text-5xl font-semibold tracking-tight text-pretty text-primary sm:text-6xl">
                      Customizable Hero Headline for Your Project
                    </h1>
                    <p className="mt-8 text-lg font-medium text-pretty text-muted sm:max-w-md sm:text-xl/8 lg:max-w-none">
                      This section introduces the project or service with a high-level overview. It's meant to quickly communicate the main value proposition and set the tone for the rest of the page. Feel free to adapt this message to suit your audience and goals.
                    </p>
                    <div className="mt-10 flex items-center flex-wrap gap-6">
                      <a
                        href="/#"
                        className="btn btn-accent"
                      >
                        Our Services
                      </a>
                      <a
                        href="/#"
                        className="btn btn-primary"
                      >
                        Get in Touch
                      </a>
                      <a
                        href="/#faq"
                        className="btn btn-accent"
                      >
                        FAQ
                      </a>
                    </div>
                  </div>
                  <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start  lg:mt-0 lg:pl-0">
                    <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                      <div className="relative">
                        <img
                          alt=""
                          src="/assets/img/01.webp"
                          className="aspect-2/3 w-full rounded-xl bg-primary/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/10 ring-inset" />
                      </div>
                    </div>
                    <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                      <div className="relative">
                        <img
                          alt=""
                          src="/assets/img/02.webp"
                          className="aspect-2/3 w-full rounded-xl bg-primary/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/10 ring-inset" />
                      </div>
                      <div className="relative">
                        <img
                          alt=""
                          src="/assets/img/03.webp"
                          className="aspect-2/3 w-full rounded-xl bg-primary/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/10 ring-inset" />
                      </div>
                    </div>
                    <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                      <div className="relative">
                        <img
                          alt=""
                          src="/assets/img/04.webp"
                          className="aspect-2/3 w-full rounded-xl bg-primary/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/10 ring-inset" />
                      </div>
                      <div className="relative">
                        <img
                          alt=""
                          src="/assets/img/05.webp"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/10 ring-inset" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* challenges */}
          <div id="chaleges" className="mx-auto -mt-12 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl">Identifying Common Challenges</h2>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base/7 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              {problems.map((problem) => (
                <div key={problem.name}>
                  <dt className="font-semibold text-primary">{problem.name}</dt>
                  <dd className="mt-1 text-dark">{problem.description}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-12 text-lg font-bold text-accent">
              This section outlines recurring difficulties that users typically face, preparing the ground for further elaboration.
            </p>

            <p className="mt-8 text-lg/8 text-dark">
              Here you can describe how users often try to overcome these challenges on their own, but may struggle without structured guidance or tailored support.
            </p>
          </div>

          {/* about */}
          <div id="aboutus" className="mx-auto mt-24 max-w-7xl px-6 lg:px-8 ">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl">General Overview About Us</h2>
              <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
                <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                  <p className="text-xl/8 text-muted">
                    This section gives a broad explanation of the kind of services or features this project template is built to showcase. You can elaborate on the general approach, values, or methodology used to support users and ensure their success.
                  </p>
                  <p className="mt-6 text-base/7 text-dark">
                    Use this space to outline the typical processes, areas of expertise, or the unique value proposition that sets your offering apart from others.
                  </p>
                  <p className="mt-6 text-base/7 text-dark">
                    You may also include stories or examples that demonstrate how users have benefited from these services in the past, in a generic and reusable way.
                  </p>
                  <p className="mt-6 text-base/7 text-dark">
                    The goal here is to introduce your services in a way that is professional, trustworthy, and adaptable for future projects.
                  </p>
                </div>
                <div className="lg:flex lg:flex-auto lg:justify-center">
                  <dl className="w-64 space-y-8 xl:w-80">
                    {stats.map((stat) => (
                      <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                        <dt className="text-base/7 text-accent font-bold">{stat.label}</dt>
                        <dd className="text-5xl font-semibold tracking-tight text-primary">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Motivation Photo */}
          <div className="m-16 md:mx-auto md:max-w-7xl xl:px-8">
            <img
              alt=""
              src="/hero01.webp"
              className="object-contain w-full md:aspect-5/2 md:w-full md:object-cover"
            />
          </div>

          {/* categories services section */}
          <section id="services" className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
            <Categories categories={categories} />
          </section>


          {/* Advantages section */}
          <div id="advantages" className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl">Why This Matters: Key Benefits</h2>
              <p className="mt-6 text-lg/8 text-dark">
                Here you can communicate the most compelling reasons why users benefit from engaging with your offering.
              </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base/7 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              {benefits.map((value) => (
                <div key={value.name}>
                  <dt className="font-semibold text-primary">{value.name}</dt>
                  <dd className="mt-1 text-dark">{value.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl">Introductory Overview</h2>
              <p className="mt-6 text-lg/8 text-dark">
                This section serves to introduce the topic at a high level and guide users into the rest of the page.
              </p>
            </div>
          </div>
          <FAQ faqs={faqs} />

        </div >
      </div >



    </>
  )
};




