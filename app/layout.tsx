import type { Metadata } from "next";
import "./globals.css";
import SearchCommandBar from "@/components/SearchCommandBar";

export const metadata: Metadata = {
  title: "SUIIT | E-Learning Platform",
  description: "Engineering College Resource Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full bg-[var(--background)] flex overflow-hidden">
        {children}
        <SearchCommandBar />
      </body>
    </html>
  );
}
