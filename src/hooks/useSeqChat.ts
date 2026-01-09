'use client';

/**
 * useSeqChat - Seq conversation state management
 */

import { useState, useCallback } from 'react';

export interface SeqMessage {
  id: string;
  role: 'visitor' | 'seq';
  content: string;
  thinking?: string;
  timestamp: Date;
}

interface SeqChatState {
  conversationId: string | null;
  messages: SeqMessage[];
  isThinking: boolean;
  showThinking: boolean;
  error: string | null;
}

interface UseSeqChatOptions {
  visitorId: string | null;  // Allow null during initialization
  showThinkingDefault?: boolean;
  onCostUpdate?: (currentCostCents: number, costGateReached: boolean) => void;
}

export function useSeqChat({ visitorId, showThinkingDefault = true, onCostUpdate }: UseSeqChatOptions) {
  const [state, setState] = useState<SeqChatState>({
    conversationId: null,
    messages: [],
    isThinking: false,
    showThinking: showThinkingDefault,
    error: null,
  });

  // Ready when visitorId is loaded (not null/empty)
  const isReady = Boolean(visitorId);

  // Send message to Seq
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim()) return;

    if (!visitorId) {
      console.warn('[useSeqChat] Cannot send: visitorId not ready yet');
      return;
    }

    // Add user message immediately
    const userMessage: SeqMessage = {
      id: `user-${Date.now()}`,
      role: 'visitor',
      content,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isThinking: true,
      error: null,
    }));

    try {
      const response = await fetch('/api/seq/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          conversationId: state.conversationId,
          message: content,
          showThinking: state.showThinking,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Seq');
      }

      const data = await response.json();

      const seqMessage: SeqMessage = {
        id: `seq-${Date.now()}`,
        role: 'seq',
        content: data.message,
        thinking: data.thinking,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        conversationId: data.conversationId,
        messages: [...prev.messages, seqMessage],
        isThinking: false,
      }));

      // Notify cost gate if callback provided
      if (onCostUpdate && data.currentCostCents !== undefined) {
        onCostUpdate(data.currentCostCents, data.costGateReached || false);
      }
    } catch (error) {
      console.error('[useSeqChat] Error:', error);
      setState(prev => ({
        ...prev,
        isThinking: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [visitorId, state.conversationId, state.showThinking, onCostUpdate]);

  // Add opening messages (called when entering behind the curtain)
  const addOpeningMessages = useCallback((
    messages: Array<{ text: string; thinking: string }>
  ) => {
    const seqMessages: SeqMessage[] = messages.map((msg, index) => ({
      id: `seq-opening-${index}`,
      role: 'seq',
      content: msg.text,
      thinking: msg.thinking,
      timestamp: new Date(),
    }));

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, ...seqMessages],
    }));
  }, []);

  // Toggle thinking visibility
  const toggleThinking = useCallback(() => {
    setState(prev => ({
      ...prev,
      showThinking: !prev.showThinking,
    }));
  }, []);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setState({
      conversationId: null,
      messages: [],
      isThinking: false,
      showThinking: showThinkingDefault,
      error: null,
    });
  }, [showThinkingDefault]);

  return {
    ...state,
    isReady,
    sendMessage,
    addOpeningMessages,
    toggleThinking,
    clearConversation,
  };
}
