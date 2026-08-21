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
// One canonical host: the vent.team apex. Everything else is a permanent
      // redirect so link equity and crawl budget land in one place — the www
      // subdomain, the previous vent-clean.ru pair, and any preview host that
      // leaks out.
      ...['www.vent.team', 'vent-clean.ru', 'www.vent-clean.ru', 'vent-final.vercel.app'].map(
        (host) => ({
          source: '/:path*',
          has: [{ type: 'host', value: host }],
          destination: 'https://vent.team/:path*',
          permanent: true,
        }),
      ),
    ];
  },
};

module.exports = nextConfig;
