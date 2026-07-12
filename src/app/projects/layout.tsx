import { PERSON } from "~/lib/site";
import { pageMetadata } from "~/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description: `Software projects by ${PERSON.name}, including Longhorn Developers, Accutime, and other work in web development and machine learning.`,
  path: "/projects",
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
