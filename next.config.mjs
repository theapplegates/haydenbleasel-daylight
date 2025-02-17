import { createSecureHeaders } from 'next-secure-headers';
import redirects from './redirects.json' assert { type: 'json' };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    typedRoutes: true,
    turbo: {
      '.svg': ['@svgr/webpack'],
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...createSecureHeaders(),
          // HSTS Preload: https://hstspreload.org/
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  redirects() {
    return redirects;
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/iu,
      issuer: /\.tsx?$/u,
      use: ['@svgr/webpack'],
    });

    config.infrastructureLogging = {
      level: 'error',
    };

    return config;
  },
};

export default nextConfig;
