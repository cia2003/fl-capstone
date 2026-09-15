const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // konfigurasi Next.js lainnya bisa ditambah di sini nanti
}

module.exports = withBundleAnalyzer(nextConfig)