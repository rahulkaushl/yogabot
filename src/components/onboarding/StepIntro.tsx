import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StepIntroProps {
  onNext: () => void;
  onBack: () => void;
}

const MESSAGES = [
  "Hi! I'm Yog-Bot, your wellness companion.",
  "I'll guide you through yoga, help you reduce screen time, and support your journey to balance.",
  "Even robots need to recharge! Together, we'll find your balance.",
];

export default function StepIntro({ onNext, onBack }: StepIntroProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (currentLine >= MESSAGES.length) return;

    const timer = setInterval(() => {
      if (charIndex <= MESSAGES[currentLine].length) {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[currentLine] = MESSAGES[currentLine].slice(0, charIndex);
          return next;
        });
        setCharIndex((prev) => prev + 1);
      } else {
        setCurrentLine((prev) => prev + 1);
        setCharIndex(0);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [currentLine, charIndex]);

  return (
    <div className="flex flex-col items-center px-6 pt-8">
      {/* Sparkles */}
      <div className="relative w-40 h-40 mb-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: i * 0.3,
            }}
          />
        ))}

        <motion.img
          src="/yogbot-mascot.png"
          alt="Yog-Bot"
          className="w-full h-full object-contain"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          style={{ animation: 'float 3s ease-in-out infinite' }}
        />
      </div>

      {/* Chat bubbles */}
      <div className="w-full space-y-3 mb-8">
        {MESSAGES.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 1.5 }}
            className="bg-navy/50 rounded-2xl rounded-tl-sm px-4 py-3"
          >
            <p className="text-sm text-textSecondary">
              {displayedLines[i] || ''}
              {i === currentLine && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-gold"
                >
                  |
                </motion.span>
              )}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: currentLine >= MESSAGES.length ? 1 : 0.3 }}
        onClick={onNext}
        disabled={currentLine < MESSAGES.length}
        whileTap={{ scale: 0.97 }}
        className="w-full h-14 rounded-[14px] font-bold disabled:opacity-30"
        style={{
          background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
          color: '#0A1628',
        }}
      >
        Let's Do Our First Session!
      </motion.button>
    </div>
  );
}
