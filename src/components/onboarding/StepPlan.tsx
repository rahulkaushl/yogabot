import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface StepPlanProps {
  onNext: () => void;
}

const PLAN_DAYS = [
  { day: 'Day 1-2', phase: 'Awareness', tasks: ['Track screen time', '1 yoga session', 'Mood check-in'] },
  { day: 'Day 3-4', phase: 'Building Habits', tasks: ['2 yoga sessions', '1 detox challenge', 'Set goals'] },
  { day: 'Day 5-6', phase: 'Going Deeper', tasks: ['Morning yoga', 'Media literacy module', 'Community join'] },
  { day: 'Day 7', phase: 'Reflection', tasks: ['Progress review', 'Weekly challenge', 'Plan next week'] },
];

export default function StepPlan({ onNext }: StepPlanProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center px-6 pt-8">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-12 h-12 rounded-full border-4 border-gold/20 border-t-gold mb-4"
            />
            <motion.img
              src="/yogbot-speaking.png"
              alt="Yog-Bot"
              className="w-16 h-16 object-contain mb-3"
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <p className="text-textSecondary">Creating your personalized plan...</p>
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-gold" />
              <h2 className="font-display text-xl font-bold text-textPrimary">
                Your 7-Day Starter Plan
              </h2>
            </div>

            <p className="text-textSecondary text-sm mb-6">
              Tailored based on your goals. Take it one day at a time!
            </p>

            <div className="space-y-3 mb-8">
              {PLAN_DAYS.map((item, i) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-midnight/50 rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                      {item.day}
                    </span>
                    <span className="font-semibold text-textPrimary">{item.phase}</span>
                  </div>
                  <ul className="space-y-1">
                    {item.tasks.map((task) => (
                      <li key={task} className="text-xs text-textSecondary flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-calm flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={onNext}
              whileTap={{ scale: 0.97 }}
              className="w-full h-14 rounded-[14px] font-bold"
              style={{
                background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
                color: '#0A1628',
              }}
            >
              Looks Great!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
