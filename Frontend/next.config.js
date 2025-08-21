/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: '../'
  },
  // Désactive le cache pour le débogage
  generateEtags: false,
  poweredByHeader: false,
  compress: false,
  // Active les logs de débogage
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuration pour le déploiement sur Vercel
  output: 'export',
  distDir: '.next',
  trailingSlash: true
}

module.exports = nextConfig
