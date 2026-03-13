import StaticPage, { getLocalPageMetadata } from "@/components/StaticPage";

export function generateMetadata() {
  return getLocalPageMetadata("politica-afiliere");
}

export default function Page() {
  return <StaticPage slug="politica-afiliere" />;
}
