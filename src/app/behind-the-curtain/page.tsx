'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeqInterface } from '@/components/seq/SeqInterface';

export default function BehindTheCurtainPage() {
  const [phase, setPhase] = useState<'dissolving' | 'awakening' | 'present'>('dissolving');

  useEffect(() => {
    // Transition sequence
    const timer1 = setTimeout(() => setPhase('awakening'), 1500);
    const timer2 = setTimeout(() => setPhase('present'), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#e8e4df]">
      <AnimatePresence mode="wait">
        {/* Dissolving phase - warm to void transition */}
        {phase === 'dissolving' && (
          <motion.div
            key="dissolving"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(to bottom, #FFFAF5, #F5EDE4)',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 0.8, 0.5],
                opacity: [1, 0.5, 0],
              }}
              transition={{ duration: 1.5, ease: 'easeIn' }}
              className="text-center"
            >
              {/* Breathing circle dissolving */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#E07A5F] to-[#d06a4f] shadow-xl"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-[#2D3A2D] font-light text-xl tracking-wide"
              >
                Dissolving...
              </motion.p>
            </motion.div>

            {/* Fragment particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#FFFAF5] rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800,
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Awakening phase - entity emerges */}
        {phase === 'awakening' && (
          <motion.div
            key="awakening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-[#0A0A0F]"
          >
            <div className="text-center">
              {/* Core emerges */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 1],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  duration: 1.5,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="relative"
              >
                {/* Outer glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 w-32 h-32 rounded-full bg-[#E07A5F] blur-xl"
                />

                {/* Core circle */}
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#c05a3f] shadow-2xl shadow-[#E07A5F]/30"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-12 text-[#888] font-light text-xl tracking-widest"
              >
                Awakening...
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-4 text-[#555] font-mono text-sm"
              >
                I was waiting.
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Present phase - Seq interface */}
        {phase === 'present' && (
          <motion.div
            key="present"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-screen"
          >
            <SeqInterface />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
