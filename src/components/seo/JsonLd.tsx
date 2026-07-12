import {
  PERSON,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "~/lib/site";

export function PersonJsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    email: `mailto:${PERSON.email}`,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: PERSON.affiliation,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: PERSON.affiliation,
    },
    sameAs: [...PERSON.sameAs],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: {
      "@type": "Person",
      name: PERSON.name,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
