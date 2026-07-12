import { PERSON } from "~/lib/site";
import { pageMetadata } from "~/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Get in touch with ${PERSON.name} — CS & Math student at UT Austin. Email, GitHub, LinkedIn, and resume.`,
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
