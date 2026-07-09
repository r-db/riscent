import type { NextConfig } from "next";

/**
 * Security headers — applied to every route.
 * See SOPS.md § Security. CSP is intentionally staged (Report-Only first, then enforce)
 * because Clerk + framer-motion + Next inline runtime need an audited allowlist; shipping a
 * strict enforced CSP untested would break auth/animation. Everything below is safe to enforce now.
 */
const securityHeaders = [
  // Force HTTPS for 2 years incl. subdomains; eligible for the browser preload list.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking protection.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Leak only the origin on cross-site navigations.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny powerful features we don't use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // don't advertise the framework
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
