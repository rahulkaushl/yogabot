import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';

/* ─── Progress Dots ─────────────────────────────────────────── */

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 justify-center py-4">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i < current ? 'w-6 bg-gold' : i === current ? 'w-6 bg-gold/50' : 'w-1.5 bg-white/10'
          }`}
          animate={i === current ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      ))}
    </div>
  );
}

/* ─── Progress Bar ──────────────────────────────────────────── */

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(90deg, #F5A623, #FFD93D)' }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

/* ─── Back Button ───────────────────────────────────────────── */

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="flex items-center gap-1 text-textSecondary hover:text-textPrimary transition-colors py-2"
    >
      <ChevronLeft size={18} />
      <span className="text-sm">Back</span>
    </motion.button>
  );
}

/* ─── Buttons ───────────────────────────────────────────────── */

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`w-full h-14 rounded-[14px] font-bold ${
        disabled ? 'opacity-30 cursor-not-allowed' : ''
      } ${className}`}
      style={{
        background: disabled ? '#1A2B47' : 'linear-gradient(135deg, #F5A623, #FFD93D)',
        color: disabled ? '#64748B' : '#0A1628',
      }}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({ children, onClick, className = '' }: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`w-full h-12 rounded-[14px] border border-white/10 text-textSecondary font-semibold hover:bg-white/5 transition-colors ${className}`}
    >
      {children}
    </motion.button>
  );
}

/* ─── Step Transition Wrapper ───────────────────────────────── */

interface StepTransitionProps {
  children: ReactNode;
  direction?: number;
}

export function StepTransition({ children, direction = 1 }: StepTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -40 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

/* ─── Sparkle Effect ────────────────────────────────────────── */

export function SparkleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold rounded-full"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Typing Effect Hook ────────────────────────────────────── */

import { useState, useEffect } from 'react';

export function useTypingEffect(text: string, speed: number = 25, delay: number = 0) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, started]);

  return displayed;
}
