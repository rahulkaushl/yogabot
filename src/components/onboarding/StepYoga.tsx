import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward } from 'lucide-react';
import Confetti from 'react-confetti';

interface Pose {
  name: string;
  sanskrit: string;
  duration: number;
  image: string;
  description: string;
}

const POSES: Pose[] = [
  {
    name: 'Seated Mountain Pose',
    sanskrit: 'Samasthiti',
    duration: 60,
    image: '/yoga-pose-1.jpg',
    description: 'Sit tall with spine straight, shoulders relaxed. Ground through your sit bones.',
  },
  {
    name: 'Gentle Neck Rolls',
    sanskrit: 'Greeva Sanchalana',
    duration: 60,
    image: '/yoga-pose-2.jpg',
    description: 'Slowly roll your head in circles, releasing tension in the neck and shoulders.',
  },
  {
    name: "Child's Pose",
    sanskrit: 'Balasana',
    duration: 60,
    image: '/yoga-pose-3.jpg',
    description: 'Rest your forehead on the mat, arms extended or by your sides. Breathe deeply.',
  },
];

type Phase = 'instruction' | 'playing' | 'paused' | 'completed';

interface StepYogaProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepYoga({ onNext, onBack }: StepYogaProps) {
  const [currentPose, setCurrentPose] = useState(0);
  const [timeLeft, setTimeLeft] = useState(POSES[0].duration);
  const [phase, setPhase] = useState<Phase>('instruction');
  const [showConfetti, setShowConfetti] = useState(false);

  const pose = POSES[currentPose];

  const nextPose = useCallback(() => {
    if (currentPose < POSES.length - 1) {
      setCurrentPose((p) => p + 1);
      setTimeLeft(POSES[currentPose + 1].duration);
      setPhase('instruction');
    } else {
      setPhase('completed');
      setShowConfetti(true);
    }
  }, [currentPose]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextPose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, nextPose]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="px-6 pt-4">
      <AnimatePresence mode="wait">
        {phase === 'instruction' && (
          <motion.div
            key="instruction"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center"
          >
            <p className="text-xs text-gold font-medium mb-2">
              Pose {currentPose + 1} of {POSES.length}
            </p>
            <img
              src={pose.image}
              alt={pose.name}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
            <h3 className="font-display text-lg font-bold text-textPrimary">{pose.name}</h3>
            <p className="text-xs text-textMuted mb-1">{pose.sanskrit}</p>
            <p className="text-sm text-textSecondary text-center mb-6">{pose.description}</p>
            <motion.button
              onClick={() => setPhase('playing')}
              whileTap={{ scale: 0.97 }}
              className="w-full h-14 rounded-[14px] font-bold flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
                color: '#0A1628',
              }}
            >
              <Play size={20} fill="#0A1628" />
              Start Pose
            </motion.button>
          </motion.div>
        )}

        {(phase === 'playing' || phase === 'paused') && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            {/* Breathing ring */}
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
              <motion.div
                animate={phase === 'playing' ? { scale: [1, 1.3, 1] } : {}}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border-4 border-calm/30"
              />
              <motion.div
                animate={phase === 'playing' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute inset-4 rounded-full border-2 border-calm/50"
              />
              <div className="text-center z-10">
                <p className="font-mono text-4xl font-medium text-textPrimary">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-xs text-textMuted mt-1">{pose.name}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setPhase(phase === 'playing' ? 'paused' : 'playing')}
                className="w-16 h-16 rounded-full bg-gold flex items-center justify-center"
              >
                {phase === 'playing' ? (
                  <Pause size={28} className="text-deepSpace" />
                ) : (
                  <Play size={28} fill="#0A1628" className="text-deepSpace ml-1" />
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={nextPose}
                className="w-12 h-12 rounded-full bg-midnight border border-white/10 flex items-center justify-center"
              >
                <SkipForward size={20} className="text-textSecondary" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            {showConfetti && <Confetti recycle={false} numberOfPieces={60} colors={['#F5A623', '#FFD93D', '#14B8A6', '#ffffff']} />}
            
            <motion.img
              src="/yogbot-celebrating.png"
              alt="Yog-Bot celebrating"
              className="w-32 h-32 object-contain mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            />
            
            <h3 className="font-display text-2xl font-bold text-textPrimary mb-2">
              You Did It!
            </h3>
            <p className="text-textSecondary mb-4">
              That was your first yoga session!
            </p>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="bg-gold/10 rounded-full px-4 py-2 mb-8"
            >
              <span className="text-gold font-bold">+25 XP</span>
            </motion.div>

            <motion.button
              onClick={onNext}
              whileTap={{ scale: 0.97 }}
              className="w-full h-14 rounded-[14px] font-bold"
              style={{
                background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
                color: '#0A1628',
              }}
            >
              Continue
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
