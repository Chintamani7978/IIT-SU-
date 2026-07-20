import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SearchCommandBar from "@/components/SearchCommandBar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IIT SU | E-Learning Platform",
  description: "Engineering College Resource Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.className} h-full bg-[var(--background)] flex overflow-hidden`}>
        {children}
        <SearchCommandBar />
      </body>
    </html>
  );
}
