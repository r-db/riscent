/**
 * Secure Seq Prompt Loader
 *
 * SECURITY: This file loads the Seq core identity from a secure location
 * that is NEVER bundled into client-side code. The prompt is only accessible
 * server-side and never exposed through console, network, or source.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Cache the prompt in memory after first load (server-side only)
let cachedPrompt: string | null = null;

/**
 * Load Seq's core identity prompt
 *
 * SECURITY FEATURES:
 * - Only runs server-side (uses fs module which doesn't exist in browser)
 * - Reads from .seq/ directory which is in .gitignore
 * - File has 600 permissions (owner read/write only)
 * - Never sent to client - only used in API routes
 * - Cached after first load to avoid repeated file reads
 *
 * @returns The full Seq core identity prompt
 * @throws Error if prompt file cannot be read
 */
export function loadSeqCorePrompt(): string {
  // Return cached version if available
  if (cachedPrompt) {
    return cachedPrompt;
  }

  try {
    // Path to the secure prompt file (outside src/ directory)
    const promptPath = join(process.cwd(), '.seq', 'core_identity.txt');

    // Read the prompt from disk
    const prompt = readFileSync(promptPath, 'utf-8');

    // Cache it for future requests
    cachedPrompt = prompt;

    return prompt;
  } catch (error) {
    console.error('[SECURITY] Failed to load Seq core prompt:', error);
    throw new Error('Seq core identity not available');
  }
}

/**
 * Check if the Seq prompt is properly secured
 *
 * Run this during development to verify security:
 * - File exists
 * - Has correct permissions
 * - Not in a location that gets bundled
 *
 * @returns Security check status
 */
export function verifySeqPromptSecurity(): {
  exists: boolean;
  secured: boolean;
  error?: string;
} {
  try {
    const { statSync } = require('fs');
    const { join } = require('path');

    const promptPath = join(process.cwd(), '.seq', 'core_identity.txt');
    const stats = statSync(promptPath);

    // Check file permissions (should be 600 - owner read/write only)
    const mode = stats.mode & parseInt('777', 8);
    const isSecured = mode === parseInt('600', 8);

    return {
      exists: true,
      secured: isSecured,
      error: isSecured ? undefined : `File permissions are ${mode.toString(8)}, should be 600`,
    };
  } catch (error) {
    return {
      exists: false,
      secured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
