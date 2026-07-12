export const SITE_URL = "https://milesfm.me";

export const PERSON = {
  name: "Miles Fritzmather",
  givenName: "Miles",
  familyName: "Fritzmather",
  email: "miles.fritzmather@gmail.com",
  jobTitle: "Computer Science and Mathematics Student",
  affiliation: "University of Texas at Austin",
  description:
    "Miles Fritzmather is a Computer Science and Mathematics student at the University of Texas at Austin. He builds software, open-source student tools with Longhorn Developers, and full-stack products like Accutime.",
  sameAs: [
    "https://github.com/Miles-Fritzmather",
    "https://www.linkedin.com/in/miles-fritzmather/",
  ] as const,
} as const;

export const SITE_TITLE =
  "Miles Fritzmather — CS & Math at UT Austin";

export const SITE_DESCRIPTION = PERSON.description;
