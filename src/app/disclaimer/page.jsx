import StaticPage, { getLocalPageMetadata } from "@/components/StaticPage";

export function generateMetadata() {
  return getLocalPageMetadata("disclaimer");
}

export default function Page() {
  return <StaticPage slug="disclaimer" />;
}
