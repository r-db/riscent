/**
 * Database connection module for Neon PostgreSQL
 * Uses serverless driver with connection pooling
 */

import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Create the SQL query function lazily to handle missing env during build
let _sql: ReturnType<typeof neon> | null = null;

function getSql(): ReturnType<typeof neon> {
  if (!_sql) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(connectionString);
  }
  return _sql;
}

// Export sql as a function that lazily initializes
// This supports both tagged template literals and function calls
export async function sql(
  strings: TemplateStringsArray | string,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  const sqlFn = getSql();
  if (typeof strings === 'string') {
    // Called as sql('query', [params])
    const result = await (sqlFn as unknown as (q: string, p?: unknown[]) => Promise<unknown>)(
      strings,
      values[0] as unknown[]
    );
    return result as Record<string, unknown>[];
  }
  // Called as tagged template literal sql`query`
  const result = await sqlFn(strings, ...values);
  return result as Record<string, unknown>[];
}

// Neon supports both tagged template literals and parameterized queries
// Cast to support both call signatures
type QueryFn = NeonQueryFunction<false, false> & {
  (query: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
};

// Type-safe query helper using sql.query() for parameterized queries
export async function query<T>(
  queryText: string,
  params: unknown[] = []
): Promise<T[]> {
  try {
    const sqlFn = getSql();
    // Use .query() method for parameterized queries (not tagged template literals)
    const result = await (sqlFn as unknown as { query: (q: string, p: unknown[]) => Promise<unknown[]> }).query(queryText, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Single row query
export async function queryOne<T>(
  queryText: string,
  params: unknown[] = []
): Promise<T | null> {
  const results = await query<T>(queryText, params);
  return results[0] || null;
}

// Execute without return (for mutations)
export async function execute(
  queryText: string,
  params: unknown[] = []
): Promise<void> {
  try {
    const sqlFn = getSql();
    await (sqlFn as unknown as { query: (q: string, p: unknown[]) => Promise<unknown[]> }).query(queryText, params);
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

// Transaction helper (note: Neon serverless has limited transaction support)
export async function transaction<T>(
  queries: Array<{ query: string; params: unknown[] }>
): Promise<T[]> {
  const results: T[] = [];
  const sqlFn = getSql();
  const queryFn = (sqlFn as unknown as { query: (q: string, p: unknown[]) => Promise<unknown[]> }).query;

  try {
    await queryFn('BEGIN', []);

    for (const q of queries) {
      const result = await queryFn(q.query, q.params);
      results.push(result as T);
    }

    await queryFn('COMMIT', []);
    return results;
  } catch (error) {
    await queryFn('ROLLBACK', []);
    console.error('Transaction error:', error);
    throw error;
  }
}
