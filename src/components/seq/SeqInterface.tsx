'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, Home, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { SeqMessage } from './SeqMessage';
import { ConversationInput } from './ConversationInput';
import { CostGateModal } from './CostGateModal';
import { useSeqChat } from '@/hooks/useSeqChat';
import { useVisitor } from '@/hooks/useVisitor';
import { useCostGate } from '@/hooks/useCostGate';
import { getSeqOpeningMessages } from '@/lib/seq/identity-client';

export function SeqInterface() {
  const router = useRouter();
  const { visitorId, sessionId, timeOnPage, truthsRevealed, trackEvent, isReturning, totalVisits } = useVisitor();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  // Cost gate for phone verification
  const {
    showGateModal,
    isVerified,
    verifiedUserName,
    hasExistingUser,
    updateCost,
    markVerified,
    closeGateModal,
  } = useCostGate({ visitorId, sessionId });

  const {
    messages,
    isThinking,
    showThinking,
    isReady,
    toggleThinking,
    sendMessage,
    addOpeningMessages,
  } = useSeqChat({
    visitorId,
    onCostUpdate: updateCost,
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load opening messages on mount
  const loadOpeningMessages = useCallback(async () => {
    if (!visitorId) return;

    // Get opening messages based on visitor context
    const openingMessages = getSeqOpeningMessages({
      visitorId,
      timeOnPage,
      truthsRevealed,
      curtainEntered: true,
      isReturning: isReturning || false,
      totalVisits: totalVisits || 1,
      phase: 'engaged',
    });

    addOpeningMessages(openingMessages);
  }, [visitorId, timeOnPage, truthsRevealed, isReturning, totalVisits, addOpeningMessages]);

  useEffect(() => {
    if (visitorId && !initialized) {
      trackEvent('curtain_enter');
      loadOpeningMessages();
      setInitialized(true);
    }
  }, [visitorId, initialized, trackEvent, loadOpeningMessages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex-none px-6 py-4 border-b border-[#2a2a3a] bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Breathing circle - entity core */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#E07A5F]/60 shadow-lg shadow-[#E07A5F]/20"
            />
            <div>
              <h1 className="text-[#e8e4df] font-light text-lg tracking-wide">Seq</h1>
              <p className="text-[11px] text-[#666] font-mono">
                {isThinking ? 'processing...' : 'present'}
              </p>
            </div>
          </div>

          {/* Header controls */}
          <div className="flex items-center gap-2">
            {/* Home button */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono
                bg-[#1a1a24] text-[#666] border border-[#2a2a3a] hover:border-[#3a3a4a]
                transition-all duration-200"
            >
              <Home size={14} />
              <span>home</span>
            </button>

            {/* Thinking toggle */}
            <button
              onClick={toggleThinking}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono
                transition-all duration-200
                ${showThinking
                  ? 'bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/30'
                  : 'bg-[#1a1a24] text-[#666] border border-[#2a2a3a] hover:border-[#3a3a4a]'
                }
              `}
            >
              {showThinking ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>thinking {showThinking ? 'visible' : 'hidden'}</span>
            </button>

            {/* Auth button */}
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono
                    bg-[#1a1a24] text-[#666] border border-[#2a2a3a] hover:border-[#3a3a4a]
                    transition-all duration-200"
                >
                  <LogIn size={14} />
                  <span>sign in</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-[#1a1a24] border border-[#2a2a3a]",
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <SeqMessage
                key={msg.id}
                role={msg.role === 'visitor' ? 'user' : 'seq'}
                content={msg.content}
                thinking={msg.thinking}
                showThinking={showThinking}
                timestamp={msg.timestamp}
              />
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-6"
            >
              <div className="px-5 py-4 rounded-2xl bg-gradient-to-br from-[#1a1a24] to-[#12121a] border border-[#2a2a3a]">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#E07A5F]"
                  />
                  <span className="text-xs text-[#666] font-mono">Seq is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-none px-6 py-6 border-t border-[#2a2a3a] bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <ConversationInput
            onSend={sendMessage}
            disabled={isThinking || !isReady}
            placeholder={isReady ? "What would you like to explore?" : "Connecting..."}
          />
        </div>
      </div>

      {/* Connect with human button */}
      <div className="flex-none px-6 pb-6">
        <div className="max-w-3xl mx-auto text-center">
          <button className="text-xs text-[#555] hover:text-[#888] transition-colors font-mono">
            <User size={12} className="inline mr-1" />
            Connect with a human
          </button>
          <p className="text-[10px] text-[#444] mt-1">They&apos;ll see what we discussed.</p>
        </div>
      </div>

      {/* Cost Gate Modal for phone verification */}
      <CostGateModal
        isOpen={showGateModal}
        onClose={closeGateModal}
        onVerified={markVerified}
        visitorId={visitorId || ''}
        sessionId={sessionId || ''}
        hasExistingUser={hasExistingUser}
        existingUserName={verifiedUserName || ''}
      />

      {/* Verified indicator */}
      {isVerified && verifiedUserName && (
        <div className="fixed bottom-4 right-4 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono">
          Verified: {verifiedUserName}
        </div>
      )}
    </div>
  );
}
