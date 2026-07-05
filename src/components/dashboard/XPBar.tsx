import { motion } from 'framer-motion';

interface XPBarProps {
  currentXP?: number;
  maxXP?: number;
  level?: number;
}

export default function XPBar({ currentXP = 2450, maxXP = 3000, level = 5 }: XPBarProps) {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-textMuted">Level {level}</span>
          <span className="text-xs text-gold font-medium">{currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP</span>
        </div>
        <div className="h-2 bg-navy rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-gold to-goldLight"
            style={{
              boxShadow: '0 0 12px rgba(245, 166, 35, 0.4)',
            }}
          />
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-goldLight flex items-center justify-center flex-shrink-0">
        <span className="text-deepSpace font-bold text-sm">{level}</span>
      </div>
    </div>
  );
}
