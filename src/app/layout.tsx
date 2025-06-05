// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Portfolio Generator",
  description: "Generate and export AI-powered portfolios with Gemini.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <header className="p-4 flex items-center justify-between border-b">
            <Link href="/upload" className="text-lg font-bold">
              AI Portfolio Generator
            </Link>
            <Link
              href="/auth/signin"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Get Started
            </Link>
          </header>

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
