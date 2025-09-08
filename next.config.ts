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
    buildActivity: false,
    buildActivityPosition: 'bottom-left',
  },
  // Disable dev overlay completely
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
