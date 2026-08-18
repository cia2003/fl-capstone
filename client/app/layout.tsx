import React from "react";
import localFont from 'next/font/local'
import './globals.css'
import Link from "next/link";

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
        <header className="mx-5 border-b border-primary/20 py-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
          <nav className="mx-auto flex max-w-[1280px] items-center justify-between gap-4" aria-label="Main navigation">
            <Link href="/" className="font-heading text-h3 font-semibold no-underline">Ghibli Compass</Link>
            <Link href="/find-my-film" className="rounded-button border-[1.5px] border-primary px-button-x py-button-y text-sm font-semibold no-underline">Find my film</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
