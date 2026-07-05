import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak?: number;
}

export default function StreakCounter({ streak = 12 }: StreakCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 bg-danger/10 px-4 py-2 rounded-full"
    >
      <motion.div
        animate={{ scaleY: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <Flame size={18} className="text-danger fill-danger" />
      </motion.div>
      <span className="text-danger font-semibold text-sm">{streak} Day Streak</span>
    </motion.div>
  );
}
