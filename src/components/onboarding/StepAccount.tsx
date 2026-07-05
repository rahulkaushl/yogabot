import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import confetti from 'canvas-confetti';
import Confetti from 'react-confetti';

const AGE_RANGES = ['13-15', '16-17', '18-19', '20+'];

interface StepAccountProps {
  onBack: () => void;
}

export default function StepAccount({ onBack }: StepAccountProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);

  const handleComplete = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F5A623', '#FFD93D', '#14B8A6', '#ffffff'],
    });
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center px-6 pt-8 text-center">
      {showConfetti && <Confetti recycle={false} numberOfPieces={80} colors={['#F5A623', '#FFD93D', '#14B8A6', '#ffffff']} />}

      <motion.img
        src="/yogbot-celebrating.png"
        alt="Yog-Bot celebrating"
        className="w-28 h-28 object-contain mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-bold text-textPrimary mb-2"
      >
        You're All Set!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-textSecondary mb-6"
      >
        Welcome to the journey! Remember: even robots take time to find balance.
      </motion.p>

      {/* Username input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full mb-4"
      >
        <label className="text-sm text-textSecondary mb-2 block text-left">
          Choose a username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="YogiTeen_42"
          className="w-full h-14 bg-navy rounded-xl border border-white/10 px-4 text-textPrimary placeholder-textMuted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
        />
      </motion.div>

      {/* Age selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full mb-6"
      >
        <label className="text-sm text-textSecondary mb-2 block text-left">
          How old are you?
        </label>
        <div className="grid grid-cols-4 gap-2">
          {AGE_RANGES.map((age) => (
            <button
              key={age}
              onClick={() => setAgeRange(age)}
              className={`h-12 rounded-xl border-2 font-semibold text-sm transition-all ${
                ageRange === age
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/5 bg-midnight/30 text-textSecondary hover:border-white/10'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={handleComplete}
        whileTap={{ scale: 0.97 }}
        className="w-full h-14 rounded-[14px] font-bold mb-3"
        style={{
          background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
          color: '#0A1628',
        }}
      >
        Get Started
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/dashboard')}
        className="text-sm text-textMuted hover:text-textSecondary transition-colors"
      >
        Or explore the app first →
      </motion.button>
    </div>
  );
}
