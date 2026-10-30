import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "VALNQIX | B2B IT Hardware, Suppliers & Marketplace Directory",
  description: "Connect directly with verified IT hardware manufacturers, wholesalers, and distributors across India. Post buy requirements, request lowest quotations, and source IT equipment directly from suppliers.",
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


