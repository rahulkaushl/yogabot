import { motion } from 'framer-motion';
import { Smartphone, MessageCircle, Play, Instagram } from 'lucide-react';

const STATS = [
  { value: '7-9', label: 'hours/day on screens', icon: Smartphone },
  { value: '67%', label: 'feel anxious without phone', icon: MessageCircle },
  { value: '3.5 hrs', label: 'average social media use', icon: Instagram },
];

interface StepWelcomeProps {
  onNext: () => void;
}

export default function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-8">
      {/* Floating social icons */}
      <div className="relative w-48 h-48 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="absolute inset-0"
        >
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{ transform: `rotate(${angle}deg) translateY(-60px)` }}
            >
              <div className="w-10 h-10 rounded-full bg-midnight border border-white/10 flex items-center justify-center">
                {i === 0 && <Instagram size={18} className="text-textSecondary" />}
                {i === 1 && <MessageCircle size={18} className="text-textSecondary" />}
                {i === 2 && <Play size={18} className="text-textSecondary" />}
                {i === 3 && <Smartphone size={18} className="text-textSecondary" />}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Center mascot */}
        <motion.img
          src="/yogbot-mascot.png"
          alt="Yog-Bot"
          className="absolute inset-0 m-auto w-24 h-24 object-contain"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
          style={{ animation: 'float 3s ease-in-out infinite' }}
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display text-2xl font-bold text-textPrimary mb-3"
      >
        Feeling overwhelmed by your phone?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-textSecondary mb-6"
      >
        You're not alone. Let's take back control together.
      </motion.p>

      {/* Stats */}
      <div className="w-full space-y-3 mb-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-center gap-3 bg-midnight/50 rounded-xl p-3"
          >
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
              <stat.icon size={18} className="text-gold" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-textPrimary">{stat.value}</p>
              <p className="text-xs text-textMuted">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={onNext}
        whileTap={{ scale: 0.97 }}
        className="w-full h-14 rounded-[14px] font-bold text-base"
        style={{
          background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
          color: '#0A1628',
        }}
      >
        Let's Get Started
      </motion.button>
    </div>
  );
}
