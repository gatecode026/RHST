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
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}


