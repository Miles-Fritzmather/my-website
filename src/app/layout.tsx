import type { Metadata } from "next";

import { PersonJsonLd } from "~/components/seo/JsonLd";
import {
  PERSON,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "~/lib/site";
import "~/styles/globals.css";

import { Karla } from "next/font/google";
import BlobBackground from "~/components/BlobBackground";
import { BackgroundProvider } from "~/providers/BackgroundProvider";
import { PreferencesProvider } from "~/providers/Preferences-Provider";
import Navbar from "../components/Navbar";
import Footer from "./footer";

const karla = Karla({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${PERSON.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Miles Fritzmather",
    "UT Austin",
    "University of Texas at Austin",
    "Computer Science",
    "Mathematics",
    "Longhorn Developers",
    "Accutime",
    "software engineer",
    "software developer",
  ],
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: SITE_URL,
    siteName: PERSON.name,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    firstName: PERSON.givenName,
    lastName: PERSON.familyName,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: PERSON.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${karla.className} no-scrollbar`}>
        <PersonJsonLd />
        <PreferencesProvider>
          <BackgroundProvider>
            <BlobBackground />
            <Navbar />
            <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-content flex-col">
              <div className="flex-1">{children}</div>
            </main>
            <Footer />
          </BackgroundProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
