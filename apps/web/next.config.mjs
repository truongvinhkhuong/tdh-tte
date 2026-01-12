/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'toanthang.vn',
      },
      {
        protocol: 'https',
        hostname: 'cms.toanthang.vn',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // SEO optimizations
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  // Environment variables for SEO
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://toanthang.vn',
  },
}

export default nextConfig

