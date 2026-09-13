import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Codespaces forwards the app through a *.app.github.dev URL that
      // differs from what the dev server itself sees as its origin —
      // without this, every Server Action call is rejected as a possible
      // CSRF attempt ("Invalid Server Actions request").
      allowedOrigins: ['*.app.github.dev', 'localhost:3000'],
    },
  },
};

export default nextConfig;