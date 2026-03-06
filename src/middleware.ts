import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security middleware — generates a per-request CSP nonce.
 *
 * Why nonces instead of static CSP?
 * A static CSP with 'unsafe-inline' + 'unsafe-eval' is effectively no CSP
 * for XSS prevention. Nonce-based CSP means only scripts carrying the
 * one-time token execute — injected payloads are blocked.
 *
 * Next.js reads the nonce from the `x-nonce` request header and applies it
 * to its own inline hydration scripts automatically.
 *
 * 'strict-dynamic' tells modern browsers: "trust any script loaded by a
 * nonced script" — so dynamic Next.js chunk loading still works without
 * allowlisting every CDN path.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'", // Tailwind injects <style> tags at build
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "object-src 'none'",       // Block Flash/Java plugins (OWASP)
    "child-src 'none'",        // Block nested browsing contexts (iframes/workers)
    "frame-src 'none'",        // Explicit iframe blocking (fallback-independent)
    "manifest-src 'self'",     // Only allow same-origin web manifests
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "worker-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  // Forward nonce to Next.js via request header so it can apply to inline scripts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", csp);
  // Prevent cross-origin reads of site resources (Spectre mitigation)
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return response;
}

/** Apply to all routes except static assets and image optimization */
export const config = {
  matcher: [
    { source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)" },
  ],
};
