import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOODS = [
  { emoji: '😫', label: 'Overwhelmed', value: 1 },
  { emoji: '😔', label: 'Down', value: 2 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😄', label: 'Great', value: 5 },
];

const YOG_BOT_RESPONSES: Record<number, string> = {
  1: "I hear you. Let's take this one breath at a time. Try a calming yoga session?",
  2: "It's okay to not be okay. How about a quick meditation to lift your spirits?",
  3: "A balanced day! Want to maintain it with a short yoga flow?",
  4: "Wonderful! Your positive energy is glowing. Keep it up!",
  5: "Amazing! You're radiating good vibes. Share your secret with the community?",
};

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-midnight to-[#0D1A2D] rounded-2xl border border-white/[0.06] p-5"
    >
      <h3 className="font-display font-bold text-textPrimary mb-4">How are you feeling?</h3>
      
      <div className="flex justify-between items-center">
        {MOODS.map((mood, i) => (
          <motion.button
            key={mood.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood.value)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              selectedMood === mood.value
                ? 'bg-gold/20 ring-2 ring-gold'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[10px] text-textMuted">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="flex items-start gap-3 bg-navy/50 rounded-xl p-3">
              <img
                src="/yogbot-speaking.png"
                alt="Yog-Bot"
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <p className="text-sm text-textSecondary leading-relaxed">
                {YOG_BOT_RESPONSES[selectedMood]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
