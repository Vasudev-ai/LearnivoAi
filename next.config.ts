
import type {NextConfig} from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        // Firebase Auth sends verification/reset links to /_/auth/action
        // Next.js ignores _ prefixed folders, so rewrite to /auth/action
        source: '/_/auth/action',
        destination: '/auth/action',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ["@grpc/grpc-js", "@opentelemetry/instrumentation"],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default withBundleAnalyzer(nextConfig);
