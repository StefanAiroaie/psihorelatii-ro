import StaticPage, { getLocalPageMetadata } from "@/components/StaticPage";

export function generateMetadata() {
  return getLocalPageMetadata("despre-noi");
}

export default function Page() {
  return <StaticPage slug="despre-noi" />;
}
