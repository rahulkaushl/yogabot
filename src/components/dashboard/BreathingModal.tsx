import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASE_CONFIG: Record<Phase, { label: string; duration: number; scale: number; opacity: number }> = {
  inhale: { label: 'Breathe In', duration: 4, scale: 1.5, opacity: 0.3 },
  hold: { label: 'Hold', duration: 4, scale: 1.5, opacity: 0.2 },
  exhale: { label: 'Breathe Out', duration: 6, scale: 1.0, opacity: 0.1 },
  rest: { label: 'Rest', duration: 2, scale: 1.0, opacity: 0.1 },
};

const PHASES: Phase[] = ['inhale', 'hold', 'exhale', 'rest'];

export default function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(1);

  const nextPhase = useCallback(() => {
    setPhase((prev) => {
      const idx = PHASES.indexOf(prev);
      const next = PHASES[(idx + 1) % PHASES.length];
      setCount(PHASE_CONFIG[next].duration);
      if (next === 'inhale') {
        setCycle((c) => c + 1);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setPhase('inhale');
      setCount(4);
      setCycle(1);
      return;
    }

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          nextPhase();
          return PHASE_CONFIG[phase].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, phase, nextPhase]);

  const config = PHASE_CONFIG[phase];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-deepSpace/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-midnight/50 text-textSecondary hover:text-textPrimary transition-colors"
          >
            <X size={24} />
          </button>

          <motion.div
            animate={{ scale: config.scale, opacity: 1 }}
            transition={{ duration: config.duration, ease: 'easeInOut' }}
            className="relative w-64 h-64 flex items-center justify-center"
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{ scale: config.scale * 1.2, opacity: config.opacity }}
              transition={{ duration: config.duration, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border-2 border-calm/30"
            />
            
            {/* Main breathing ring */}
            <motion.div
              animate={{ scale: config.scale }}
              transition={{ duration: config.duration, ease: 'easeInOut' }}
              className="absolute inset-4 rounded-full border-4 border-calm/50 flex items-center justify-center"
              style={{
                boxShadow: `0 0 ${40 * config.scale}px rgba(20, 184, 166, 0.3)`,
              }}
            >
              {/* Inner filled circle */}
              <motion.div
                animate={{ 
                  scale: config.scale * 0.6,
                  opacity: 0.1 + (config.scale - 1) * 0.2 
                }}
                transition={{ duration: config.duration, ease: 'easeInOut' }}
                className="w-full h-full rounded-full bg-calm"
              />
            </motion.div>

            {/* Center content */}
            <div className="relative z-10 text-center">
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-display font-bold text-calm mb-2"
              >
                {config.label}
              </motion.p>
              <motion.p
                key={count}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl font-mono font-medium text-textPrimary"
              >
                {count}
              </motion.p>
            </div>
          </motion.div>

          <p className="mt-8 text-textMuted text-sm">
            Cycle {cycle} of 5
          </p>

          <div className="flex gap-2 mt-4">
            {PHASES.map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full transition-colors ${
                  p === phase ? 'bg-calm' : 'bg-midnight'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
