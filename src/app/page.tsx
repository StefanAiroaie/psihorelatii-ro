// src/app/page.tsx  (fără "use client")
import { urlFor, client } from "@/sanity/client"
import Image from "next/image"
import Categories from "@/components/Categories"

export const revalidate = 60  // ISR: regenerează pagina la fiecare 60s

export default async function Home() {
  // 1. Fetch-ezi datele direct în componenta de server
  const categories: Array<{ title: string; slug: { current: string } }> =
    await client.fetch(`*[_type=='category']{title, slug}`)



  // 3. Le treci ca props componetei
  return (

    <>
      <Categories data={categories} />

    </>
  )
};