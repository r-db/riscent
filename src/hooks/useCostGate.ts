'use client';

/**
 * useCostGate - Cost tracking and verification gate management
 * Shows verification modal when cost threshold is reached
 */

import { useState, useEffect, useCallback } from 'react';

interface CostGateState {
  currentCostCents: number;
  costGateReached: boolean;
  isVerified: boolean;
  verifiedUserId: string | null;
  verifiedUserName: string | null;
  hasExistingUser: boolean;
  isLoading: boolean;
  showGateModal: boolean;
}

interface UseCostGateOptions {
  visitorId: string | null;
  sessionId: string | null;
  threshold?: number; // Default 10 cents
}

export function useCostGate({ visitorId, sessionId, threshold = 10 }: UseCostGateOptions) {
  const [state, setState] = useState<CostGateState>({
    currentCostCents: 0,
    costGateReached: false,
    isVerified: false,
    verifiedUserId: null,
    verifiedUserName: null,
    hasExistingUser: false,
    isLoading: true,
    showGateModal: false,
  });

  // Check session verification status
  const checkSessionStatus = useCallback(async () => {
    if (!visitorId || !sessionId) return;

    try {
      const response = await fetch(
        `/api/verification/session-status?visitorId=${visitorId}&sessionId=${sessionId}`
      );

      if (response.ok) {
        const data = await response.json();

        setState(prev => ({
          ...prev,
          isVerified: data.verified,
          verifiedUserId: data.userId || null,
          verifiedUserName: data.fullName || null,
          hasExistingUser: data.hasExistingUser || false,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('[useCostGate] Session status error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [visitorId, sessionId]);

  // Check cost status
  const checkCostStatus = useCallback(async () => {
    if (!visitorId) return;

    try {
      const response = await fetch(`/api/visitor/cost?visitorId=${visitorId}`);

      if (response.ok) {
        const data = await response.json();

        setState(prev => ({
          ...prev,
          currentCostCents: data.currentCostCents || 0,
          costGateReached: data.costGateReached || false,
        }));
      }
    } catch (error) {
      console.error('[useCostGate] Cost status error:', error);
    }
  }, [visitorId]);

  // Update cost from chat response
  const updateCost = useCallback((newCostCents: number, gateReached: boolean) => {
    setState(prev => {
      const shouldShowGate = gateReached && !prev.isVerified && !prev.showGateModal;

      return {
        ...prev,
        currentCostCents: newCostCents,
        costGateReached: gateReached,
        showGateModal: shouldShowGate ? true : prev.showGateModal,
      };
    });
  }, []);

  // Mark as verified (after successful verification)
  const markVerified = useCallback((userId: string, userName: string) => {
    setState(prev => ({
      ...prev,
      isVerified: true,
      verifiedUserId: userId,
      verifiedUserName: userName,
      showGateModal: false,
    }));
  }, []);

  // Close modal (user dismissed it)
  const closeGateModal = useCallback(() => {
    setState(prev => ({ ...prev, showGateModal: false }));
  }, []);

  // Force show modal (for manual trigger)
  const openGateModal = useCallback(() => {
    setState(prev => ({ ...prev, showGateModal: true }));
  }, []);

  // Determine if gate should be shown
  const shouldShowGate = state.costGateReached && !state.isVerified;

  // Initialize on mount
  useEffect(() => {
    if (visitorId && sessionId) {
      checkSessionStatus();
      checkCostStatus();
    }
  }, [visitorId, sessionId, checkSessionStatus, checkCostStatus]);

  return {
    ...state,
    threshold,
    shouldShowGate,
    updateCost,
    markVerified,
    closeGateModal,
    openGateModal,
    refreshStatus: () => {
      checkSessionStatus();
      checkCostStatus();
    },
  };
}
