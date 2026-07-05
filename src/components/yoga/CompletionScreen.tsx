import { motion } from 'framer-motion';
import { Star, Share2, RotateCcw, Home } from 'lucide-react';
import Confetti from 'react-confetti';

interface CompletionScreenProps {
  sessionName: string;
  duration: number;
  xpEarned: number;
  onShare: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export default function CompletionScreen({
  sessionName,
  duration,
  xpEarned,
  onShare,
  onRestart,
  onHome,
}: CompletionScreenProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      <Confetti recycle={false} numberOfPieces={60} colors={['#F5A623', '#FFD93D', '#14B8A6', '#ffffff']} />

      <motion.img
        src="/yogbot-celebrating.png"
        alt="Yog-Bot celebrating"
        className="w-28 h-28 object-contain mb-4"
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display text-2xl font-bold text-textPrimary mb-2"
      >
        Session Complete!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-textSecondary mb-4"
      >
        {sessionName} · {duration} min
      </motion.p>

      {/* Star rating */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="flex gap-1 mb-6"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.4 + star * 0.1 }}
          >
            <Star size={28} className="text-gold fill-gold" />
          </motion.div>
        ))}
      </motion.div>

      {/* XP earned */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="bg-gradient-to-r from-gold/20 to-goldLight/20 rounded-2xl px-6 py-4 mb-8 border border-gold/20"
      >
        <p className="text-3xl font-display font-bold text-gold mb-1">+{xpEarned} XP</p>
        <p className="text-sm text-textSecondary">Great work! Keep it up!</p>
      </motion.div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={onRestart}
          whileTap={{ scale: 0.97 }}
          className="w-full h-14 rounded-[14px] font-bold flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
            color: '#0A1628',
          }}
        >
          <RotateCcw size={18} />
          Practice Again
        </motion.button>

        <div className="flex gap-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={onShare}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-12 rounded-[14px] border border-white/10 text-textSecondary font-semibold flex items-center justify-center gap-2 hover:bg-white/5"
          >
            <Share2 size={16} />
            Share
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            onClick={onHome}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-12 rounded-[14px] border border-white/10 text-textSecondary font-semibold flex items-center justify-center gap-2 hover:bg-white/5"
          >
            <Home size={16} />
            Dashboard
          </motion.button>
        </div>
      </div>
    </div>
  );
}
