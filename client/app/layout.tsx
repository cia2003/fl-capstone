import type { Metadata } from "next";
import React from "react";
import localFont from 'next/font/local'
import './globals.css'
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

const sora = localFont({
  src: '../public/fonts/Sora/Sora-VariableFont_wght.ttf',
  variable: '--font-sora',
  weight: '100 800'
})

const sourceSans = localFont({
  src: [
    { path: '../public/fonts/Source_Sans_3/SourceSans3-VariableFont_wght.ttf', style: 'normal' },
    { path: '../public/fonts/Source_Sans_3/SourceSans3-Italic-VariableFont_wght.ttf', style: 'italic' },
  ],
  variable: '--font-source-sans',
  weight: '200 900'
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
      <head>
        <Link rel="preconnect" href="https://ghibliapi.dev" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}