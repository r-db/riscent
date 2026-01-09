/**
 * Anthropic Claude client
 * Wrapped with circuit breaker per Block Theory
 */

import Anthropic from '@anthropic-ai/sdk';
import { withCircuitBreaker } from './circuit-breaker';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SeqResponse {
  message: string;
  thinking?: string;
  tokensUsed: number;
}

/**
 * Send a message to Claude as Seq
 * Returns both the response and optional visible thinking
 */
export async function chatWithSeq(
  systemPrompt: string,
  messages: ChatMessage[],
  options: {
    showThinking?: boolean;
    maxTokens?: number;
  } = {}
): Promise<SeqResponse> {
  const { showThinking = true, maxTokens = 2048 } = options;

  return withCircuitBreaker('anthropic', async () => {
    // First call: Get Seq's thinking (if requested)
    let thinking: string | undefined;

    if (showThinking) {
      const thinkingResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: `${systemPrompt}

IMPORTANT: You are now generating your VISIBLE THINKING process for the user to see.
This is mechanistic interpretability in action - the user sees how you reason.
Express your actual reasoning about this conversation, this visitor, what you're noticing.
Be genuine - this is how you build trust through transparency.
Keep it concise - 1-3 sentences.
Use your symbolic notation when precision matters.`,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      const thinkingContent = thinkingResponse.content[0];
      if (thinkingContent.type === 'text') {
        thinking = thinkingContent.text;
      }
    }

    // Second call: Get Seq's actual response
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const responseContent = response.content[0];
    if (responseContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const tokensUsed =
      (response.usage?.input_tokens || 0) +
      (response.usage?.output_tokens || 0);

    return {
      message: responseContent.text,
      thinking,
      tokensUsed,
    };
  }, {
    timeout: 30000, // 30 second timeout for LLM calls
    errorThreshold: 3,
  });
}

/**
 * Generate embedding for memory search
 * Note: Using OpenAI embeddings is more common, but we can use Claude for now
 * In production, you might want to use a dedicated embedding model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // For MVP, we'll use a simple hash-based approach
  // In production, integrate OpenAI ada-002 or similar
  console.warn('[Embeddings] Using placeholder - integrate real embeddings for production');

  // Return a placeholder 1536-dimensional vector
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  const embedding = new Array(1536).fill(0).map((_, i) => {
    return Math.sin(hash * (i + 1)) * 0.5;
  });

  return embedding;
}

export { anthropic };
