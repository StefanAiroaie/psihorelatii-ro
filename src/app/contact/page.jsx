import StaticPage, { getLocalPageMetadata } from "@/components/StaticPage";

export function generateMetadata() {
  return getLocalPageMetadata("contact");
}

export default function Page() {
  return <StaticPage slug="contact" />;
}
