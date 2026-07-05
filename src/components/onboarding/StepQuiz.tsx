import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const OPTIONS = [
  { emoji: '😰', label: 'Anxious or stressed' },
  { emoji: '😴', label: 'Tired or can\'t sleep' },
  { emoji: '🎯', label: 'Distracted, can\'t focus' },
  { emoji: '😔', label: 'Comparing myself to others' },
  { emoji: '😤', label: 'Addicted to scrolling' },
  { emoji: '😵', label: 'Overwhelmed by news' },
];

interface StepQuizProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepQuiz({ onNext, onBack }: StepQuizProps) {
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
        className="font-display text-xl font-bold text-textPrimary mb-2"
      >
        How does media make you feel?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-textSecondary text-sm mb-6"
      >
        Select all that apply. This helps us personalize your experience.
      </motion.p>

      <div className="space-y-3 mb-8">
        {OPTIONS.map((option, i) => {
          const isSelected = selected.includes(i);
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => toggle(i)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-gold bg-gold/10'
                  : 'border-white/5 bg-midnight/30 hover:border-white/10'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="flex-1 text-textPrimary font-medium">{option.label}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-gold bg-gold' : 'border-textMuted'
                }`}
              >
                {isSelected && <Check size={14} className="text-deepSpace" />}
              </div>
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
            selected.length > 0
              ? 'opacity-100'
              : 'opacity-40 cursor-not-allowed'
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
