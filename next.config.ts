/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_FLASK_API_URL: process.env.FLASK_API_URL,
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
