'use client';

/**
 * Riscent Landing Page
 * Phase 1: The warm, trust-building experience
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Lock, ChevronRight } from 'lucide-react';
import { useVisitor } from '@/hooks/useVisitor';
import { NeuronBackground } from '@/components/NeuronBackground';

// Colors - matching the design
const colors = {
  bgPrimary: '#FFFAF5',
  bgSecondary: '#FFF8F0',
  bgTertiary: '#F5F0E8',
  sageDeep: '#4A7C59',
  sageMid: '#6B9B7A',
  sageLight: '#A8D5BA',
  sagePale: '#E8F0E8',
  trustBlue: '#2C5282',
  trustLight: '#4A90B8',
  warmGold: '#D4A84B',
  warmCoral: '#E07A5F',
  textPrimary: '#1A1A1A',
  textSecondary: '#3D3D3D',
  textMuted: '#6B6B6B',
  textWhisper: '#9B9B9B',
  borderLight: 'rgba(74, 124, 89, 0.15)',
};

const truths = [
  {
    title: "We built one of the hardest AI products in healthcare solo.",
    body: "Voice receptionist. Patient portal. Multi-tenant CRM. HIPAA-compliant. 415 API routes. ~700K lines of code. Five months. Under $10,000 of capital. At our first customer it's handled 1,710 calls with zero missed. English and Spanish. 24/7. That's the portfolio, not the pitch.",
    Icon: Users,
    color: colors.trustBlue,
  },
  {
    title: "We don't do AI strategy decks.",
    body: "We build working systems in regulated verticals and hand them to you. Voice agents, chat agents, memory systems, agent-native infrastructure. If you can explain what winning looks like in one sentence, we can scope it in one week and ship it in weeks, not quarters.",
    Icon: Search,
    color: colors.sageDeep,
  },
  {
    title: "The model is not the moat.",
    body: "Frontier models improve every week — nobody keeps an advantage on raw intelligence. The real edge is the architecture around the model: fact-check critics, HIPAA audit trails, memory that persists, agent-native APIs, fallback logic for when the LLM is wrong. That's what we build, and that's what you own.",
    Icon: Lock,
    color: colors.warmCoral,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const {
    timeOnPage,
    trackEvent,
    isLoading,
  } = useVisitor();

  const [phase, setPhase] = useState(2);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [breathPhase, setBreathPhase] = useState(0);
  const [revealedTruths, setRevealedTruths] = useState<number[]>([]);
  const [mouseIdle, setMouseIdle] = useState(false);
  const [hasEngaged, setHasEngaged] = useState(false);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Breath cycle - 4 second rhythm
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(breathInterval);
  }, []);

  // Phase progression based on time
  useEffect(() => {
    if (timeOnPage >= 0.5 && phase === 0) setPhase(1);
    if (timeOnPage >= 1 && phase === 1) setPhase(2);
    if (timeOnPage >= 1.5 && phase === 2) setPhase(3);
    if (timeOnPage >= 4 && phase === 3) setPhase(4);
    if (hasScrolled && phase >= 2) setPhase(Math.max(phase, 4));
  }, [timeOnPage, hasScrolled, phase]);

  // Cursor and scroll tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setMouseIdle(false);
      setHasEngaged(true);

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setMouseIdle(true), 3000);
    };

    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
        setHasEngaged(true);
        trackEvent('scroll', { depth: Math.round((window.scrollY / document.body.scrollHeight) * 100) });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [hasScrolled, trackEvent]);

  // Reveal a truth
  const revealTruth = (index: number) => {
    if (!revealedTruths.includes(index)) {
      setRevealedTruths([...revealedTruths, index]);
      trackEvent('revelation', { truthIndex: index });
    }
  };

  // Lift the curtain - navigate to behind-the-curtain
  const liftTheCurtain = () => {
    trackEvent('curtain_peek');
    // Small delay for transition feel
    setTimeout(() => {
      router.push('/behind-the-curtain');
    }, 100);
  };

  // Breath values for animation
  const breathOpacity = 0.6 + Math.sin(breathPhase * Math.PI * 2 / 100) * 0.4;
  const breathScale = 1 + Math.sin(breathPhase * Math.PI * 2 / 100) * 0.03;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <div
          className="w-16 h-16 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.sageDeep}30, transparent 70%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-hidden relative"
      style={{
        backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
      }}
    >
      {/* Neuron network background */}
      <NeuronBackground />

      {/* Subtle warm gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 30%, ${colors.sagePale}80, transparent),
            radial-gradient(ellipse 60% 40% at 80% 70%, rgba(212, 168, 75, 0.05), transparent)
          `,
        }}
      />

      {/* Cursor glow */}
      <div
        className="fixed rounded-full pointer-events-none z-10"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          width: mouseIdle ? '300px' : '150px',
          height: mouseIdle ? '300px' : '150px',
          background: `radial-gradient(circle, ${colors.sageDeep}${mouseIdle ? '08' : '12'}, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          transition: mouseIdle ? 'all 1.2s ease-out' : 'all 0.2s ease-out',
        }}
      />

      {/* HERO SECTION */}
      <section className="h-screen flex items-center justify-center relative z-20">
        <div className="relative flex flex-col items-center gap-12">
          {/* Breathing circle */}
          <div
            className="w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              background: `radial-gradient(circle, ${colors.sageDeep}20, transparent 70%)`,
              transform: `scale(${breathScale})`,
              opacity: phase >= 1 ? 1 : 0.4,
            }}
          >
            <div
              className="w-[70px] h-[70px] rounded-full transition-opacity duration-100"
              style={{
                background: `radial-gradient(circle, ${colors.sageDeep}, ${colors.sageDeep}00)`,
                opacity: breathOpacity,
              }}
            />
          </div>

          {/* The question */}
          <div
            className="text-center transition-all duration-300"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <p
              className="text-[13px] tracking-[5px] uppercase mb-7 font-medium"
              style={{ color: colors.textMuted }}
            >
              {phase >= 2 ? 'AI Consulting — Healthcare First' : ''}
            </p>

            <h1 className="text-[clamp(32px,5vw,58px)] font-light tracking-[-1.5px] leading-[1.25] max-w-[820px]">
              We built a HIPAA-compliant AI platform solo.
              <br />
              <span className="font-semibold" style={{ color: colors.sageDeep }}>
                In five months. For under $10,000.
              </span>
            </h1>
          </div>

          {/* The witness statement */}
          <div
            className="text-center max-w-[540px] transition-all duration-500"
            style={{
              opacity: phase >= 3 && hasEngaged ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '0.2s',
            }}
          >
            <p className="text-base leading-[1.7]" style={{ color: colors.textSecondary }}>
              <span className="font-semibold" style={{ color: colors.sageDeep }}>
                1,710 calls handled. Zero missed.
              </span>
              <br />
              <span
                className="transition-opacity duration-1000"
                style={{ opacity: timeOnPage > 3 ? 1 : 0 }}
              >
                <span className="font-medium" style={{ color: colors.textPrimary }}>
                  A voice AI in two languages, a patient portal with 80% adoption, five vendors replaced. We&apos;re available to build yours.
                </span>
              </span>
            </p>
          </div>

          {/* Scroll invitation */}
          <div
            className="absolute -bottom-[100px] text-center transition-opacity duration-1000"
            style={{ opacity: phase >= 4 ? breathOpacity * 0.6 : 0 }}
          >
            <div
              className="w-px h-[50px] mx-auto mb-3"
              style={{ background: `linear-gradient(to bottom, ${colors.sageDeep}, transparent)` }}
            />
            <p className="text-[11px] tracking-[3px] uppercase" style={{ color: colors.textMuted }}>
              Discover
            </p>
          </div>
        </div>
      </section>

      {/* TRUTHS SECTION */}
      <section className="min-h-screen py-[120px] px-6 relative z-20">
        <div className="max-w-[900px] mx-auto">
          <div
            className="text-center mb-[100px] transition-all duration-1000"
            style={{
              opacity: hasScrolled ? 1 : 0,
              transform: hasScrolled ? 'translateY(0)' : 'translateY(40px)',
            }}
          >
            {/* Logo badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
              style={{ background: colors.sagePale }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `radial-gradient(circle, ${colors.sageDeep}30, transparent 70%)` }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full animate-breathe"
                  style={{ background: `radial-gradient(circle, ${colors.sageDeep}, ${colors.sageDeep}00)` }}
                />
              </div>
              <span
                className="text-[13px] font-semibold tracking-[1px] uppercase"
                style={{ color: colors.sageDeep }}
              >
                Riscent
              </span>
            </div>

            <h2 className="text-[clamp(28px,4vw,44px)] font-light leading-[1.35] mb-5">
              Three things about how we build.
              <br />
              <span style={{ color: colors.textMuted }}>
                None of them are the model.
              </span>
            </h2>
          </div>

          {/* Truth cards */}
          <div className="flex flex-col gap-6">
            {truths.map((truth, index) => {
              const isRevealed = revealedTruths.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => revealTruth(index)}
                  className="rounded-[20px] cursor-pointer transition-all duration-400"
                  style={{
                    background: isRevealed ? colors.bgSecondary : colors.bgPrimary,
                    border: `1px solid ${isRevealed ? truth.color + '30' : colors.borderLight}`,
                    padding: isRevealed ? '40px' : '32px',
                    opacity: hasScrolled ? 1 : 0,
                    transform: hasScrolled
                      ? isRevealed ? 'translateY(0) scale(1.01)' : 'translateY(0) scale(1)'
                      : 'translateY(40px) scale(1)',
                    transitionDelay: `${index * 0.15}s`,
                    boxShadow: isRevealed
                      ? '0 20px 60px rgba(74, 124, 89, 0.08)'
                      : '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-400"
                      style={{
                        background: isRevealed ? truth.color : colors.bgTertiary,
                      }}
                    >
                      <truth.Icon
                        size={26}
                        color={isRevealed ? '#fff' : colors.textMuted}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-[21px] font-semibold tracking-[-0.3px] transition-all duration-400"
                        style={{
                          marginBottom: isRevealed ? '16px' : '0',
                          color: isRevealed ? colors.textPrimary : colors.textSecondary,
                        }}
                      >
                        {truth.title}
                      </h3>
                      <div
                        className="overflow-hidden transition-all duration-500"
                        style={{
                          maxHeight: isRevealed ? '200px' : '0',
                          opacity: isRevealed ? 1 : 0,
                        }}
                      >
                        <p className="text-[17px] leading-[1.7]" style={{ color: colors.textSecondary }}>
                          {truth.body}
                        </p>
                      </div>
                      {!isRevealed && (
                        <p
                          className="text-[13px] mt-2 italic"
                          style={{ color: colors.textWhisper }}
                        >
                          Tap to reveal
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* THE CURTAIN - Final CTA */}
      <section className="min-h-screen flex items-center justify-center py-[100px] px-6 relative z-20">
        <div className="max-w-[680px] text-center">
          <div
            className="mb-14 transition-all duration-800"
            style={{
              opacity: hasScrolled ? 1 : 0,
              transform: hasScrolled ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '0.2s',
            }}
          >
            <h2 className="text-[clamp(28px,4vw,42px)] font-light leading-[1.35] mb-7 tracking-[-0.5px]">
              Tell us what you&apos;re trying to ship.
              <br />
              <span className="font-semibold">15 minutes. No pitch deck.</span>
            </h2>
          </div>

          {/* THE BUTTON */}
          <div
            className="transition-all duration-800"
            style={{
              opacity: hasScrolled ? 1 : 0,
              transform: hasScrolled ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '0.4s',
            }}
          >
            <button
              onClick={liftTheCurtain}
              className="px-12 py-6 text-[18px] font-semibold rounded-2xl inline-flex items-center gap-3 relative overflow-hidden transition-all duration-400 hover:-translate-y-0.5"
              style={{
                background: 'transparent',
                border: `2px solid ${colors.sageDeep}`,
                color: colors.sageDeep,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.sageDeep;
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.boxShadow = `0 12px 40px ${colors.sageDeep}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = colors.sageDeep;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Scope a project
              <ChevronRight size={20} />
            </button>

            <p className="mt-6 text-sm" style={{ color: colors.textMuted }}>
              Reply within 24 hours with two specific 15-minute slots. No calendar dance.
            </p>
          </div>

          {/* Time acknowledgment — replaced with how-we-engage */}
          <div
            className="mt-20 transition-opacity duration-1000 text-left max-w-[560px] mx-auto"
            style={{
              opacity: hasScrolled ? 1 : 0,
              transitionDelay: '0.8s',
            }}
          >
            <p className="text-[13px] tracking-[2px] uppercase mb-4 font-semibold" style={{ color: colors.sageDeep }}>
              Three ways to work with us
            </p>
            <ul className="space-y-3 text-[15px] leading-[1.6]" style={{ color: colors.textSecondary }}>
              <li>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>Build + transfer.</span> $15K-$150K fixed scope. We ship it, you own it.
              </li>
              <li>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>Embedded advisory.</span> $5K-$15K/month. Architecture reviews, spec writing, pair coding.
              </li>
              <li>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>Strategic deep dive.</span> $7,500 flat. One week heads-down. You get a ~30-page memo, architecture diagrams, and a working proof-of-concept.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-6 relative z-20"
        style={{
          borderTop: `1px solid ${colors.borderLight}`,
          background: colors.bgSecondary,
        }}
      >
        <div className="max-w-[1100px] mx-auto flex justify-between items-center flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle, ${colors.sageDeep}30, transparent 70%)` }}
            >
              <div
                className="w-[18px] h-[18px] rounded-full animate-breathe"
                style={{ background: `radial-gradient(circle, ${colors.sageDeep}, ${colors.sageDeep}00)` }}
              />
            </div>
            <span className="text-base font-semibold tracking-[-0.3px]">
              RISCENT
            </span>
          </div>

          <div className="flex gap-8">
            <a
              href="/research"
              className="text-sm transition-colors duration-300"
              style={{ color: colors.textMuted }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
            >
              Research
            </a>
            <a
              href="/thoughts"
              className="text-sm transition-colors duration-300"
              style={{ color: colors.textMuted }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
            >
              Thoughts
            </a>
            <a
              href="#"
              className="text-sm transition-colors duration-300"
              style={{ color: colors.textMuted }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
            >
              Privacy
            </a>
          </div>

          <p className="text-[13px]" style={{ color: colors.textMuted }}>
            &copy; 2026 Riscent
          </p>
        </div>
      </footer>
    </div>
  );
}
