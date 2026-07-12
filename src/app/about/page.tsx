import AboutHero from "~/components/AboutHero";
import { pageMetadata } from "~/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  path: "/about",
});

export default function AboutPage() {
  return <AboutHero />;
}
