import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "S Klipning",
  description: "Herrfrisör i Bergshamra, Stockholm.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="sv">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
