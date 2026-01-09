/**
 * Circuit Breaker implementation
 * Block Theory requirement: All external calls must be wrapped
 */

type CircuitState = 'closed' | 'open' | 'half-open';

interface CircuitBreakerConfig {
  timeout: number;        // Request timeout in ms
  errorThreshold: number; // Number of failures before opening
  resetTimeout: number;   // Time before attempting reset (ms)
  name: string;          // For logging/identification
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  timeout: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT || '10000'),
  errorThreshold: 5,
  resetTimeout: 30000,
  name: 'default',
};

class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failures: number = 0;
  private lastFailure: Date | null = null;
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should be open
    if (this.state === 'open') {
      if (this.shouldReset()) {
        this.state = 'half-open';
        console.log(`[CircuitBreaker:${this.config.name}] Transitioning to half-open`);
      } else {
        throw new CircuitBreakerOpenError(
          `Circuit breaker is open for ${this.config.name}`
        );
      }
    }

    try {
      const result = await this.executeWithTimeout(fn);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new TimeoutError(`Request timed out after ${this.config.timeout}ms`));
          });
        }),
      ]);
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.state = 'closed';
      console.log(`[CircuitBreaker:${this.config.name}] Circuit closed`);
    }
  }

  private onFailure(error: unknown): void {
    this.failures++;
    this.lastFailure = new Date();

    console.error(`[CircuitBreaker:${this.config.name}] Failure ${this.failures}/${this.config.errorThreshold}:`, error);

    if (this.failures >= this.config.errorThreshold) {
      this.state = 'open';
      console.log(`[CircuitBreaker:${this.config.name}] Circuit opened`);
    }
  }

  private shouldReset(): boolean {
    if (!this.lastFailure) return true;

    const elapsed = Date.now() - this.lastFailure.getTime();
    return elapsed >= this.config.resetTimeout;
  }

  // For monitoring
  getState(): { state: CircuitState; failures: number; lastFailure: Date | null } {
    return {
      state: this.state,
      failures: this.failures,
      lastFailure: this.lastFailure,
    };
  }
}

// Custom errors
export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Singleton instances for different services
const breakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
  if (!breakers.has(name)) {
    breakers.set(name, new CircuitBreaker({ ...config, name }));
  }
  return breakers.get(name)!;
}

// Convenience wrapper for external API calls
export async function withCircuitBreaker<T>(
  name: string,
  fn: () => Promise<T>,
  config?: Partial<CircuitBreakerConfig>
): Promise<T> {
  const breaker = getCircuitBreaker(name, config);
  return breaker.execute(fn);
}

export { CircuitBreaker };
