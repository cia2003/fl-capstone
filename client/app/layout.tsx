import React from "react";
import localFont from 'next/font/local'
import './globals.css'
import Link from "next/link";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const sora = localFont({
  src: '../public/fonts/Sora/Sora-VariableFont_wght.ttf',
  variable: '--font-sora',
  weight: '100 800'
})

const sourceSans = localFont({
  src: [
    {
      path: '../public/fonts/Source_Sans_3/SourceSans3-VariableFont_wght.ttf',
      style: 'normal'
    }, 
    {
      path: '../public/fonts/Source_Sans_3/SourceSans3-Italic-VariableFont_wght.ttf', 
      style: 'italic'
    }
    
  ], 
  variable: '--font-source-sans', 
  weight: '200 900'
})

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
