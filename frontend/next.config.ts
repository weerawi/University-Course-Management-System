import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  },
  eslint: {
     
    ignoreDuringBuilds: true,
  },
  typescript: {
     
    ignoreBuildErrors: true,
  },
   
  experimental: {
    telemetry: false,
  },
};

export default nextConfig;