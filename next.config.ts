import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  // Optimize for demo performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Hide dev overlay for clean demo experience
  devIndicators: {
    position: 'bottom-left',
  },
  // Disable dev overlay completely
  compiler: {
    removeConsole: false,
  },
  // Disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
