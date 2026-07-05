import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Moon, Sparkles, Dumbbell } from 'lucide-react';

const GOALS = [
  { icon: Brain, label: 'Better Focus', desc: 'Reduce distractions and improve concentration', color: '#3B82F6' },
  { icon: Moon, label: 'Better Sleep', desc: 'Fall asleep faster, wake up refreshed', color: '#A855F7' },
  { icon: Sparkles, label: 'Inner Calm', desc: 'Manage anxiety and find peace', color: '#14B8A6' },
  { icon: Dumbbell, label: 'Confidence', desc: 'Feel good about yourself, body positivity', color: '#F5A623' },
];

interface StepGoalsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepGoals({ onNext, onBack }: StepGoalsProps) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="px-6 pt-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-xl font-bold text-textPrimary mb-6"
      >
        What do you want to achieve?
      </motion.h2>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {GOALS.map((goal, i) => {
          const isSelected = selected.includes(i);
          const Icon = goal.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => toggle(i)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all text-center gap-2 ${
                isSelected
                  ? 'border-gold bg-gold/10'
                  : 'border-white/5 bg-midnight/30 hover:border-white/10'
              }`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${goal.color}20` }}
              >
                <Icon size={24} style={{ color: goal.color }} />
              </div>
              <p className="font-semibold text-textPrimary text-sm">{goal.label}</p>
              <p className="text-[10px] text-textMuted leading-tight">{goal.desc}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.97 }}
          className="flex-1 h-12 rounded-[14px] border border-white/10 text-textSecondary font-semibold"
        >
          Back
        </motion.button>
        <motion.button
          onClick={onNext}
          disabled={selected.length === 0}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 h-14 rounded-[14px] font-bold ${
            selected.length > 0 ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
          }`}
          style={{
            background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
            color: '#0A1628',
          }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}
