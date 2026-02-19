import "~/styles/globals.css";

import { type Metadata } from "next";
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
  title: "Miles Fritzmather",
  description: "Miles Fritzmather's personal website",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${karla.className} no-scrollbar`}>
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
