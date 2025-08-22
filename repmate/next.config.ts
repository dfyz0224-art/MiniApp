/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true }, // временно
  eslint: { ignoreDuringBuilds: false },
}
module.exports = nextConfig
