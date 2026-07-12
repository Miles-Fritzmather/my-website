import AboutHero from "~/components/AboutHero";
import { pageMetadata } from "~/lib/seo";
import { SITE_TITLE } from "~/lib/site";

export const metadata = pageMetadata({
  absoluteTitle: SITE_TITLE,
  path: "/",
});

export default function HomePage() {
  return <AboutHero />;
}
