/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Disinfection left the catalogue with the story redesign — the page was
      // indexed, so it points at the services hub instead of 404-ing.
      { source: '/uslugi/dezinfekciya', destination: '/uslugi', permanent: true },
      // One canonical host: the apex. Everything else is a permanent redirect
      // so link equity and crawl budget land in one place.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vent-clean.ru' }],
        destination: 'https://vent-clean.ru/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vent-final.vercel.app' }],
        destination: 'https://vent-clean.ru/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
