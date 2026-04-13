/**
 * IP Hash Utility
 *
 * Provides privacy-preserving IP address hashing for visitor tracking.
 * Uses SHA-256 with a salt to prevent rainbow table attacks.
 *
 * Block Theory: Self-contained utility with single responsibility.
 */

import { createHash } from 'crypto';

// Salt for IP hashing - should be set in environment
const IP_SALT = process.env.IP_HASH_SALT || 'riscent-ip-salt-v1-default';

/**
 * Hash an IP address for privacy-preserving storage.
 *
 * @param ip - The raw IP address to hash
 * @returns A 64-character hex string (SHA-256)
 */
export function hashIP(ip: string): string {
  if (!ip || typeof ip !== 'string') {
    return hashIP('0.0.0.0');
  }

  // Normalize IPv6 localhost to IPv4
  const normalizedIP = ip === '::1' ? '127.0.0.1' : ip;

  return createHash('sha256')
    .update(`${IP_SALT}:${normalizedIP}`)
    .digest('hex');
}

/**
 * Extract client IP from request headers.
 *
 * Priority order:
 * 1. CF-Connecting-IP (Cloudflare)
 * 2. X-Real-IP (Nginx/reverse proxy)
 * 3. X-Forwarded-For (first IP in chain)
 * 4. Vercel's x-forwarded-for
 * 5. Fallback to 0.0.0.0
 *
 * @param request - The incoming request
 * @returns The client's IP address
 */
export function getClientIP(request: Request): string {
  const headers = request.headers;

  // Cloudflare
  const cfIP = headers.get('cf-connecting-ip');
  if (cfIP) return cfIP.trim();

  // Nginx/reverse proxy
  const realIP = headers.get('x-real-ip');
  if (realIP) return realIP.trim();

  // X-Forwarded-For (can be comma-separated chain)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP (original client)
    const firstIP = forwardedFor.split(',')[0];
    if (firstIP) return firstIP.trim();
  }

  // Fallback
  return '0.0.0.0';
}

/**
 * Get IP hash from request in a single call.
 *
 * @param request - The incoming request
 * @returns The hashed IP address
 */
export function getIPHash(request: Request): string {
  const ip = getClientIP(request);
  return hashIP(ip);
}
