import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Atharva Ajmera - Full Stack Developer & Tech Enthusiast at IIT Jodhpur",
  description: "Full-stack developer skilled in modern web technologies, GenAI, and building scalable applications. Explore my projects and get in touch.",
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "GenAI",
    "Tech Enthusiast",
    "Software Engineer",
    "Portfolio",
  ],
  authors: [{ name: "Atharva Ajmera" }],
  creator: "Atharva Ajmera",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Atharva - Full Stack Developer & Tech Enthusiast",
    description: "Full-stack developer skilled in modern web technologies, GenAI, and building scalable applications.",
    siteName: "Atharva's Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atharva - Full Stack Developer & Tech Enthusiast",
    description: "Full-stack developer skilled in modern web technologies, GenAI, and building scalable applications.",
    creator: "@atharvaajmera",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans relative min-h-screen bg-zinc-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}