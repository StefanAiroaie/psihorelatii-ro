import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";


export const client = createClient({
  projectId: "rb4c8hjj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const builder = imageUrlBuilder(client);

interface SanityImageSource {
  asset: {
    _ref: string;
    _type: string;
    url?: string;
  };
}

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}



