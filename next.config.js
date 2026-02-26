/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'tzsgkspjfiozkqqjlaeo.supabase.co',
      },
      {
        // AWS S3 — pattern covers any bucket/region
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
