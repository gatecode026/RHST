import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "VALNQIX | B2B IT Hardware, Suppliers & Marketplace Directory",
  description: "Connect directly with verified IT hardware manufacturers, wholesalers, and distributors across India. Post buy requirements, request lowest quotations, and source IT equipment directly from suppliers.",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/images/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}


