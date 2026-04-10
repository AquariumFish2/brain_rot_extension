import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopProvider } from "@/context/ShopContext";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ThinkFirst — Train Your Brain, Then Use AI",
  description:
    "Stop brain rot. ThinkFirst forces you to warm up your brain with fun games before accessing AI tools. Download the extension or the app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", pixelFont.variable, inter.variable)}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ShopProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
