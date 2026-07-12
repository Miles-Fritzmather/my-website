import { PERSON } from "~/lib/site";
import { pageMetadata } from "~/lib/seo";

export const metadata = pageMetadata({
  title: "Resume",
  description: `Download the resume of ${PERSON.name}, Computer Science and Mathematics student at the University of Texas at Austin.`,
  path: "/resume",
});

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
