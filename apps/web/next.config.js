/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@syntech/types', '@syntech/ui'],
  experimental: {
    optimizePackageImports: ['@syntech/ui'],
  },
}

module.exports = nextConfig
