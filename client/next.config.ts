const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // konfigurasi Next.js lainnya bisa ditambah di sini nanti
  images: {
    minimumCacheTTL: 2592000,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "www.themoviedb.org",
        pathname: "/t/p/**",
      },
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)