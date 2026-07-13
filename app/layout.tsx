import type { Metadata } from "next";
import {
  Fraunces,
  Pixelify_Sans,
  Silkscreen,
  IBM_Plex_Mono,
} from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { AutoTheme } from "@/components/theme/AutoTheme";
import { CookieConsent } from "@/components/CookieConsent";
import { SplashScreen } from "@/components/SplashScreen";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://my-portfolio-kashkiji.vercel.app"),
  title: {
    default: "status207 — kashi kweyu",
    template: "%s · status207",
  },
  description:
    "the cozy, lightly gamified portfolio of kashi kweyu — a full-stack developer building soft, warm things on the web.",
  keywords: [
    "kashi kweyu",
    "full-stack developer",
    "portfolio",
    "next.js",
    "typescript",
    "web developer",
  ],
  authors: [{ name: "kashi kweyu" }],
  creator: "kashi kweyu",
  openGraph: {
    title: "status207 — kashi kweyu",
    description: "a cozy, lightly gamified portfolio.",
    url: "/",
    siteName: "status207",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "status207 — kashi kweyu",
    description: "a cozy, lightly gamified portfolio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="morning"
      className={`
        ${fraunces.variable}
        ${pixelify.variable}
        ${silkscreen.variable}
        ${ibmPlexMono.variable}
        h-full
      `}
    >
      <body className="flex min-h-full flex-col bg-bg-page font-mono text-ink">
        <AutoTheme />
        <SplashScreen>
          <Header />
          <main className="flex-1 pt-14">{children}</main>
          <Footer />
          <CookieConsent />
        </SplashScreen>
      </body>
    </html>
  );
}
