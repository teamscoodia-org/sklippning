import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sbarbershop.se"),
  title: "S Barbershop - Herrklippning i Bergshamra",
  description:
    "S Barbershop erbjuder herr- och damklippning i Solna nära Bergshamra. Besök oss på Rådjursstigen 7, 170 76 Solna.",
  keywords: [
    "S Barbershop",
    "herrklippning Bergshamra",
    "frisör Solna",
    "barbershop Solna",
    "damklippning Solna",
    "trådning Solna",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://www.sbarbershop.se",
    siteName: "S Barbershop",
    title: "S Barbershop - Herrklippning i Bergshamra",
    description:
      "Herr- och damklippning, trådning och behandlingar i Solna nära Bergshamra.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "S Barbershop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "S Barbershop - Herrklippning i Bergshamra",
    description:
      "Herr- och damklippning, trådning och behandlingar i Solna nära Bergshamra.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "S Barbershop",
    image: "https://www.sbarbershop.se/logo.svg",
    url: "https://www.sbarbershop.se",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rådjursstigen 7",
      postalCode: "170 76",
      addressLocality: "Solna",
      addressCountry: "SE",
    },
    areaServed: ["Solna", "Bergshamra", "Stockholm"],
    priceRange: "$$",
  };

  return (
    <html lang="sv">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
