// src/app/page.tsx  (fără "use client")
import { client } from "@/sanity/client"
import Categories from "@/components/Categories"

export const revalidate = 60  // ISR: regenerează pagina la fiecare 60s

export default async function Home() {
  // 1. Fetch-ezi datele direct în componenta de server
  const categories = await client.fetch(`
    *[_type=='psihorelatii_ro_category']{
      _id,
      title,
      "slug": slug.current,
      description,
      mainImage
    }
  `)



  // 3. Le treci ca props componetei
  return (

    <>
      <Categories categories={categories} />


    </>
  )
};