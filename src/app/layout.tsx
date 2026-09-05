import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteUrl, siteName, siteDescription } from "@/lib/site";
import ServiceWorkerRegister from "./sw-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Incluye — Inclusión laboral que se mide y se hace realidad",
    template: "%s · Incluye",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Ley 21.015",
    "inclusión laboral",
    "comunidad sorda",
    "Lengua de Señas Chilena",
    "LSCh",
    "accesibilidad",
    "empleo inclusivo",
    "discapacidad",
    "Chile",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    siteName,
    title: "Incluye — Inclusión laboral que se mide y se hace realidad",
    description: siteDescription,
    // La imagen la provee src/app/opengraph-image.tsx automáticamente.
  },
  twitter: {
    card: "summary_large_image",
    title: "Incluye — Inclusión laboral que se mide y se hace realidad",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png?v=2",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060814" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CL"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
