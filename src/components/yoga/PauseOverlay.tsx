import { motion } from 'framer-motion';
import { Play, RotateCcw, X } from 'lucide-react';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onEnd: () => void;
}

export default function PauseOverlay({ onResume, onRestart, onEnd }: PauseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-deepSpace/90 backdrop-blur-xl flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-midnight rounded-3xl p-8 w-full max-w-sm border border-white/5"
      >
        <h3 className="font-display text-xl font-bold text-textPrimary text-center mb-6">
          Paused
        </h3>

        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onResume}
            className="w-full h-14 rounded-[14px] font-bold flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
              color: '#0A1628',
            }}
          >
            <Play size={20} fill="#0A1628" />
            Resume
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            className="w-full h-12 rounded-[14px] border border-white/10 text-textSecondary font-semibold flex items-center justify-center gap-2 hover:bg-white/5"
          >
            <RotateCcw size={16} />
            Restart Session
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onEnd}
            className="w-full h-12 rounded-[14px] border border-danger/30 text-danger font-semibold flex items-center justify-center gap-2 hover:bg-danger/10"
          >
            <X size={16} />
            End Session
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
