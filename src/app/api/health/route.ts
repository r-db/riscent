/**
 * GET /api/health
 * Block Theory required health check endpoint
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCircuitBreaker } from '@/lib/circuit-breaker';

// Prevent prerendering during build
export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: { status: string; latencyMs?: number; error?: string };
    anthropic: { status: string; circuitState: string };
  };
}

export async function GET() {
  const startTime = Date.now();
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: { status: 'unknown' },
      anthropic: { status: 'unknown', circuitState: 'unknown' },
    },
  };

  // Check database
  try {
    const dbStart = Date.now();
    await sql`SELECT 1 as check`;
    health.checks.database = {
      status: 'healthy',
      latencyMs: Date.now() - dbStart,
    };
  } catch (error) {
    health.checks.database = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    health.status = 'degraded';
  }

  // Check Anthropic circuit breaker state
  try {
    const breaker = getCircuitBreaker('anthropic');
    const state = breaker.getState();
    health.checks.anthropic = {
      status: state.state === 'closed' ? 'healthy' : 'degraded',
      circuitState: state.state,
    };

    if (state.state === 'open') {
      health.status = 'degraded';
    }
  } catch {
    health.checks.anthropic = {
      status: 'healthy',
      circuitState: 'not_initialized',
    };
  }

  const statusCode = health.status === 'unhealthy' ? 503 : 200;

  return NextResponse.json(health, { status: statusCode });
}
