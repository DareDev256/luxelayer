import type { NextConfig } from "next";

/**
 * Static security headers — applied to every response via Next.js config.
 *
 * script-src still uses 'unsafe-inline' because Next.js hydration injects
 * inline scripts. 'unsafe-eval' has been removed — eval()/Function()/
 * setTimeout('string') are blocked. Nonce-based CSP is the ideal next step
 * but requires middleware that doesn't break React 19 hydration.
 *
 * X-XSS-Protection is set to 0 (disabled) because the legacy 1;mode=block
 * behavior can introduce vulnerabilities in older browsers (selective script
 * execution attacks). CSP provides XSS prevention now.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
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
