'use client';

/**
 * CostGateModal - Phone verification modal when cost threshold is reached
 * Multi-step: info -> phone/name -> code -> success
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Check, AlertCircle, Loader2 } from 'lucide-react';

type Step = 'info' | 'form' | 'code' | 'success';

interface CostGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (userId: string, userName: string) => void;
  visitorId: string;
  sessionId: string;
  hasExistingUser?: boolean;
  existingUserName?: string;
  existingPhone?: string;
}

export function CostGateModal({
  isOpen,
  onClose,
  onVerified,
  visitorId,
  sessionId,
  hasExistingUser = false,
  existingUserName = '',
  existingPhone = '',
}: CostGateModalProps) {
  const [step, setStep] = useState<Step>(hasExistingUser ? 'form' : 'info');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState(existingUserName);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [callConsent, setCallConsent] = useState(false);

  // Code verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  // Send verification code
  const handleSendCode = async () => {
    if (!phoneNumber || !fullName) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/verification/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          visitorId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send code');
        return;
      }

      setStep('code');
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/verification/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode,
          fullName,
          visitorId,
          sessionId,
          smsConsent,
          callConsent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
        setError(data.error || 'Invalid code');
        return;
      }

      setStep('success');
      setTimeout(() => {
        onVerified(data.userId, fullName);
      }, 1500);
    } catch (err) {
      setError('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
            {/* Step: Info */}
            {step === 'info' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#E07A5F]/60 flex items-center justify-center mx-auto">
                  <Phone size={20} className="text-white" />
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl font-light text-[#e8e4df]">
                    Continue this conversation
                  </h2>
                  <p className="text-sm text-[#888] leading-relaxed">
                    To continue our conversation across sessions, I need a way to recognize you.
                    A quick phone verification keeps our connection persistent.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <p className="text-xs text-[#666] text-center">
                    Why phone? It&apos;s secure, unique to you, and helps prevent abuse.
                  </p>
                </div>

                <button
                  onClick={() => setStep('form')}
                  className="w-full py-3 rounded-lg bg-[#E07A5F] text-white font-medium hover:bg-[#d06a4f] transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Step: Form */}
            {step === 'form' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-light text-[#e8e4df]">
                    {hasExistingUser ? 'Verify for this session' : 'Your details'}
                  </h2>
                  {hasExistingUser && (
                    <p className="text-sm text-[#888]">
                      Welcome back! Please verify your phone for this session.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#888] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] text-[#e8e4df] placeholder-[#555] focus:border-[#E07A5F] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#888] mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(555) 555-5555"
                      className="w-full px-4 py-3 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] text-[#e8e4df] placeholder-[#555] focus:border-[#E07A5F] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Consent checkboxes */}
                  <div className="space-y-2 pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsConsent}
                        onChange={(e) => setSmsConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-[#2a2a3a] bg-[#1a1a24] text-[#E07A5F] focus:ring-[#E07A5F] focus:ring-offset-0"
                      />
                      <span className="text-xs text-[#888]">
                        I agree to receive SMS messages for verification and important updates
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={callConsent}
                        onChange={(e) => setCallConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-[#2a2a3a] bg-[#1a1a24] text-[#E07A5F] focus:ring-[#E07A5F] focus:ring-offset-0"
                      />
                      <span className="text-xs text-[#888]">
                        I agree to receive phone calls from Riscent team if needed
                      </span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSendCode}
                  disabled={isLoading || !fullName || !phoneNumber || !smsConsent}
                  className="w-full py-3 rounded-lg bg-[#E07A5F] text-white font-medium hover:bg-[#d06a4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    'Send verification code'
                  )}
                </button>

                <button
                  onClick={() => setStep('info')}
                  className="w-full py-2 text-sm text-[#666] hover:text-[#888] transition-colors"
                >
                  Back
                </button>
              </motion.div>
            )}

            {/* Step: Code */}
            {step === 'code' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-light text-[#e8e4df]">
                    Enter verification code
                  </h2>
                  <p className="text-sm text-[#888]">
                    We sent a 6-digit code to your phone
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-4 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] text-[#e8e4df] text-center text-2xl tracking-[0.5em] font-mono placeholder-[#333] focus:border-[#E07A5F] focus:outline-none transition-colors"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle size={14} />
                    {error}
                    {attemptsRemaining > 0 && attemptsRemaining < 3 && (
                      <span className="text-[#666]">
                        ({attemptsRemaining} attempts remaining)
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full py-3 rounded-lg bg-[#E07A5F] text-white font-medium hover:bg-[#d06a4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep('form')}
                    className="text-sm text-[#666] hover:text-[#888] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setVerificationCode('');
                      setError(null);
                      handleSendCode();
                    }}
                    disabled={isLoading}
                    className="text-sm text-[#E07A5F] hover:text-[#d06a4f] transition-colors disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Check size={32} className="text-green-400" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-light text-[#e8e4df]">
                    Verified
                  </h2>
                  <p className="text-sm text-[#888]">
                    Welcome, {fullName}. Our conversation continues.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
