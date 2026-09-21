import type { Metadata } from "next";
import React from "react";
import localFont from 'next/font/local'
import './globals.css'
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const sora = localFont({
  src: '../public/fonts/Sora/Sora-VariableFont_wght.ttf',
  variable: '--font-sora',
  weight: '100 800',
  display: 'swap',
})

const sourceSans = localFont({
  src: '../public/fonts/Source_Sans_3/SourceSans3-VariableFont_wght.ttf',
  variable: '--font-source-sans',
  weight: '200 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Ghibli Compass",
    template: "%s | Ghibli Compass",
  },
  description: "Discover the Studio Ghibli film that fits your mood.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${sourceSans.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
