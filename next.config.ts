import type { NextConfig } from "next";

/**
 * Static security headers — applied to every response via Next.js config.
 *
 * CSP is NOT here — it's generated per-request in middleware.ts with a
 * unique nonce so we can use nonce-based script-src instead of unsafe-inline.
 *
 * X-XSS-Protection is set to 0 (disabled) because the legacy 1;mode=block
 * behavior can introduce vulnerabilities in older browsers (selective script
 * execution attacks). CSP nonce handles XSS prevention now.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
