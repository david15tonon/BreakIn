/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration de base
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  distDir: '.next',
  trailingSlash: true,
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  
  // Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        // Applique ces en-têtes à toutes les routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Configuration CORS pour les requêtes API
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  },

  // Configuration des redirections
  async redirects() {
    return [
      {
        source: '/',
        destination: '/developer-dashboard',
        permanent: false,
      },
    ]
  },

  // Configuration des réécritures
  async rewrites() {
    return {
      beforeFiles: [
        // Réécriture pour l'API
        {
          source: '/api/:path*',
          has: [
            {
              type: 'host',
              value: 'api.breakin.vercel.app',
            },
          ],
          destination: 'https://breakin-r2eq.onrender.com/api/:path*',
        },
      ],
    }
  },

  // Configuration des images
  images: {
    domains: ['breakin-r2eq.onrender.com', 'localhost'],
    unoptimized: true,
  },

  // Configuration de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuration pour le déploiement standalone
  experimental: {
    outputFileTracingRoot: '../',
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/*',
        '**/node_modules/**/*',
        '.git/**/*',
        '.next/**/*',
        'public/**/*',
      ]
    }
  }
}

module.exports = nextConfig
