/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_CSR}/:path*`,
      },
    ]
  },
  images: {
    domains: ['simg1zen.myclip.vn', 'cdn.vas.vn'],
  },
}

module.exports = nextConfig
