/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.b-cdn.net' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'firebase-admin'],
  },
}

export default nextConfig
