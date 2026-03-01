/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  async redirects() {
    return [
      { source: '/imprint', destination: '/impressum', permanent: true },
      { source: '/privacy', destination: '/datenschutz', permanent: true },
      { source: '/terms', destination: '/nutzungsbedingungen', permanent: true },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
