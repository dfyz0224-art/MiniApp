/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      // Если у тебя видео/картинки ещё с CDN, добавь сюда
      // { protocol: 'https', hostname: 'cdn.example.com' }
    ],
  },
};
export default nextConfig;
