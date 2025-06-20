
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
        hostname: 'kamaincprofile.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async headers() {
    const cspDirectives = [
      "default-src 'self'",
      // Next.js often requires 'unsafe-inline' for styles and 'unsafe-eval' for scripts in dev.
      // For production, consider using nonces with Next.js's CSP support for stricter policies.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' https://placehold.co https://kamaincprofile.com data:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://eth-mainnet.g.alchemy.com", // For Alchemy API
      "frame-src 'self'",
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
          // Consider adding these in the future for even tighter security,
          // but they require careful testing:
          // { key: 'X-Content-Type-Options', value: 'nosniff' },
          // { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // or DENY
          // { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
```