
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
        hostname: 'ecohogold.co.za',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async headers() {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' https://placehold.co https://ecohogold.co.za data:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://eth-mainnet.g.alchemy.com https://*.blockchainnodeengine.com wss://*.blockchainnodeengine.com wss://*.googleapis.com", 
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "upgrade-insecure-requests"
    ];

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; '),
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
