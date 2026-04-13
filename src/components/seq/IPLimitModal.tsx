'use client';

/**
 * IPLimitModal - Shown when anonymous user hits $0.30 trial limit
 * Prompts user to sign in or create account to continue
 */

import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { AlertCircle, LogIn, UserPlus, X } from 'lucide-react';

interface IPLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCostCents: number;
  limitCents: number;
}

export function IPLimitModal({
  isOpen,
  onClose,
  currentCostCents,
  limitCents,
}: IPLimitModalProps) {
  if (!isOpen) return null;

  const costDollars = (currentCostCents / 100).toFixed(2);
  const limitDollars = (limitCents / 100).toFixed(2);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-[#0f0f14] border border-[#2a2a3a] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#666] hover:text-[#999] transition-colors"
          >
            <X size={18} />
          </button>

          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-[#E07A5F]/20 flex items-center justify-center mx-auto">
                <AlertCircle size={32} className="text-[#E07A5F]" />
              </div>

              {/* Header */}
              <div className="text-center space-y-3">
                <h2 className="text-xl font-light text-[#e8e4df]">
                  Your IP has visited before
                </h2>
                <p className="text-sm text-[#888] leading-relaxed">
                  You&apos;ve used <span className="text-[#E07A5F] font-medium">${costDollars}</span> of
                  your <span className="text-[#e8e4df]">${limitDollars}</span> trial limit.
                  Sign in or create an account to continue exploring with Seq.
                </p>
              </div>

              {/* Buttons */}
              <div className="pt-2 space-y-3">
                <SignInButton mode="modal">
                  <button className="w-full py-3 rounded-lg bg-[#E07A5F] text-white font-medium hover:bg-[#d06a4f] transition-colors flex items-center justify-center gap-2">
                    <LogIn size={18} />
                    Sign in to continue
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="w-full py-3 rounded-lg bg-[#1a1a24] text-[#e8e4df] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors flex items-center justify-center gap-2">
                    <UserPlus size={18} />
                    Create an account
                  </button>
                </SignUpButton>
              </div>

              {/* Benefits note */}
              <div className="pt-2 text-center">
                <p className="text-xs text-[#666] leading-relaxed">
                  Logged-in users get <span className="text-[#E07A5F]">$1.00+</span> to explore with Seq,
                  plus conversation history, saved preferences, and more.
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-px bg-[#2a2a3a]" />
                <span className="text-xs text-[#555]">Why sign in?</span>
                <div className="flex-1 h-px bg-[#2a2a3a]" />
              </div>

              {/* Benefits list */}
              <ul className="text-xs text-[#777] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#4A7C59] mt-0.5">•</span>
                  <span>Higher token allowance ($1.00+ vs $0.30)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4A7C59] mt-0.5">•</span>
                  <span>Seq remembers your conversations across sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4A7C59] mt-0.5">•</span>
                  <span>Access to research and exclusive content</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
