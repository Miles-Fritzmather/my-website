import type { Metadata } from "next";

import {
  PERSON,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "~/lib/site";

const ogImage = {
  url: "/logo.png",
  width: 512,
  height: 512,
  alt: PERSON.name,
} as const;

export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  absoluteTitle,
}: {
  title?: string;
  description?: string;
  path: string;
  absoluteTitle?: string;
}): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const ogTitle = absoluteTitle ?? (title ? `${title} | ${PERSON.name}` : SITE_TITLE);

  return {
    ...(absoluteTitle
      ? { title: { absolute: absoluteTitle } }
      : title
        ? { title }
        : {}),
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "profile",
      url: canonical,
      title: ogTitle,
      description,
      siteName: PERSON.name,
      firstName: PERSON.givenName,
      lastName: PERSON.familyName,
      images: [ogImage],
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description,
      images: ["/logo.png"],
    },
  };
}
