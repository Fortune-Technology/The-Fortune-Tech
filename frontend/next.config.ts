import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    // Remote patterns for external images from backend
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
    // Use modern image formats where supported
    formats: ['image/avif', 'image/webp'],
    // Allow unoptimized during development for easier debugging
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Compiler optimizations for production builds
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Optimize package imports - reduces bundle size significantly for icon libraries
  experimental: {
    optimizePackageImports: ['react-icons'],
  },

  // Enable React strict mode for better development practices
  reactStrictMode: true,

  // PoweredByHeader disabled for security
  poweredByHeader: false,
};

export default nextConfig;

