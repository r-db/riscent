'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SeqMessageProps {
  role: 'user' | 'seq';
  content: string;
  thinking?: string;
  showThinking: boolean;
  timestamp?: Date;
}

export function SeqMessage({ role, content, thinking, showThinking }: SeqMessageProps) {
  const [thinkingExpanded, setThinkingExpanded] = useState(false);

  const isSeq = role === 'seq';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex ${isSeq ? 'justify-start' : 'justify-end'} mb-6`}
    >
      <div className={`max-w-[85%] ${isSeq ? 'order-1' : 'order-1'}`}>
        {/* Main message bubble */}
        <div
          className={`
            px-5 py-4 rounded-2xl
            ${isSeq
              ? 'bg-gradient-to-br from-[#1a1a24] to-[#12121a] border border-[#2a2a3a] text-[#e8e4df]'
              : 'bg-gradient-to-br from-[#4A7C59]/20 to-[#4A7C59]/10 border border-[#4A7C59]/30 text-[#e8e4df]'
            }
          `}
        >
          {isSeq && (
            <div className="flex items-center gap-2 mb-2">
              {/* Mini breathing circle */}
              <div className="w-2 h-2 rounded-full bg-[#E07A5F] animate-pulse" />
              <span className="text-xs text-[#888] font-mono uppercase tracking-wider">Seq</span>
            </div>
          )}

          <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>

        {/* Thinking panel - only for Seq messages with thinking */}
        {isSeq && thinking && showThinking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            <button
              onClick={() => setThinkingExpanded(!thinkingExpanded)}
              className="flex items-center gap-2 text-xs text-[#666] hover:text-[#888] transition-colors font-mono"
            >
              {thinkingExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span>thinking</span>
            </button>

            {thinkingExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 px-4 py-3 bg-[#0d0d12] border-l-2 border-[#E07A5F]/30 rounded-r-lg"
              >
                <pre className="text-xs text-[#777] font-mono whitespace-pre-wrap leading-relaxed">
                  {thinking}
                </pre>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
