'use client';

/**
 * useVisitor - Visitor state management and tracking
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface VisitorState {
  visitorId: string | null;
  cookieId: string | null;
  sessionId: string | null;
  phase: string;
  truthsRevealed: number;
  curtainPeeked: boolean;
  curtainEntered: boolean;
  isReturning: boolean;
  totalVisits: number;
  timeOnPage: number;
  isLoading: boolean;
  error: string | null;
}

const COOKIE_NAME = 'riscent_visitor';

export function useVisitor() {
  const [state, setState] = useState<VisitorState>({
    visitorId: null,
    cookieId: null,
    sessionId: null,
    phase: 'curious',
    truthsRevealed: 0,
    curtainPeeked: false,
    curtainEntered: false,
    isReturning: false,
    totalVisits: 1,
    timeOnPage: 0,
    isLoading: true,
    error: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialized = useRef(false);

  // Get or create cookie ID
  const getCookieId = useCallback((): string => {
    if (typeof window === 'undefined') return '';

    const cookies = document.cookie.split(';');
    const visitorCookie = cookies.find(c => c.trim().startsWith(`${COOKIE_NAME}=`));

    if (visitorCookie) {
      return visitorCookie.split('=')[1].trim();
    }

    const newCookieId = uuidv4();
    // Set cookie for 1 year
    document.cookie = `${COOKIE_NAME}=${newCookieId}; max-age=${365 * 24 * 60 * 60}; path=/; SameSite=Lax`;
    return newCookieId;
  }, []);

  // Identify visitor
  const identify = useCallback(async (cookieId: string) => {
    try {
      const response = await fetch('/api/visitor/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookieId }),
      });

      if (!response.ok) {
        throw new Error('Failed to identify visitor');
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        visitorId: data.visitorId,
        cookieId: data.cookieId,
        phase: data.phase,
        truthsRevealed: data.truthsRevealed,
        curtainPeeked: data.curtainPeeked,
        curtainEntered: data.curtainEntered,
        isReturning: data.isReturning,
        totalVisits: data.totalVisits,
        isLoading: false,
      }));

      return data.visitorId;
    } catch (error) {
      console.error('[useVisitor] Identify error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return null;
    }
  }, []);

  // Start session
  const startSession = useCallback(async (visitorId: string) => {
    try {
      const response = await fetch('/api/visitor/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          action: 'start',
          entryPage: window.location.pathname,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setState(prev => ({ ...prev, sessionId: data.sessionId }));
        return data.sessionId;
      }
    } catch (error) {
      console.error('[useVisitor] Session start error:', error);
    }
    return null;
  }, []);

  // Track event
  const trackEvent = useCallback(
    async (
      type: 'scroll' | 'interaction' | 'revelation' | 'curtain_peek' | 'curtain_enter' | 'breathing_circle',
      data?: Record<string, unknown>
    ) => {
      if (!state.visitorId) return;

      // Update local state immediately for some events
      if (type === 'revelation') {
        setState(prev => ({ ...prev, truthsRevealed: prev.truthsRevealed + 1 }));
      } else if (type === 'curtain_peek') {
        setState(prev => ({ ...prev, curtainPeeked: true }));
      } else if (type === 'curtain_enter') {
        setState(prev => ({ ...prev, curtainEntered: true, phase: 'engaged' }));
      }

      try {
        await fetch('/api/visitor/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: state.visitorId,
            sessionId: state.sessionId,
            event: {
              type,
              data,
              timestamp: new Date().toISOString(),
            },
          }),
        });
      } catch (error) {
        console.error('[useVisitor] Track event error:', error);
      }
    },
    [state.visitorId, state.sessionId]
  );

  // Initialize on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const cookieId = getCookieId();
      const visitorId = await identify(cookieId);

      if (visitorId) {
        await startSession(visitorId);
      }
    };

    init();
  }, [getCookieId, identify, startSession]);

  // Time tracking
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setState(prev => ({ ...prev, timeOnPage: prev.timeOnPage + 1 }));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // End session on unmount/page leave
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (state.visitorId && state.sessionId) {
        // Use sendBeacon for reliability
        navigator.sendBeacon(
          '/api/visitor/session',
          JSON.stringify({
            visitorId: state.visitorId,
            action: 'end',
            sessionId: state.sessionId,
            exitPage: window.location.pathname,
            temporalState: {
              timeOnPage: state.timeOnPage,
              truthsRevealed: state.truthsRevealed,
              phase: state.phase,
            },
          })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.visitorId, state.sessionId, state.timeOnPage, state.truthsRevealed, state.phase]);

  return {
    ...state,
    trackEvent,
  };
}
