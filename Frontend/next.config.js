/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuration pour le déploiement sur Vercel
  output: 'standalone',
  distDir: '.next',
  trailingSlash: true,
  
  // Désactive le cache pour le débogage
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  
  // Configuration de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Configuration pour le déploiement standalone
  experimental: {
    outputFileTracingRoot: '../',
    // Désactive le cache du système de fichiers pour le déploiement
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/*',
        '**/node_modules/**/*'
      ]
    }
  }
}

module.exports = nextConfig
