import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QUOTES = [
  "Even robots take time to find balance. You've got this!",
  "Disconnect to reconnect. Your mind deserves a break.",
  "Every breath is a fresh start. Let's make today count.",
  "Control the media, or it will control you. Stay mindful!",
  "Progress, not perfection. You're doing great!",
  "A 5-minute stretch can change your whole day.",
];

export default function YogBotQuote() {
  const [displayedText, setDisplayedText] = useState('');
  const [quoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const fullQuote = QUOTES[quoteIndex];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullQuote.length) {
        setDisplayedText(fullQuote.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [fullQuote]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <motion.img
        src="/yogbot-speaking.png"
        alt="Yog-Bot"
        className="w-10 h-10 object-contain flex-shrink-0"
        animate={{ y: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      />
      <div className="bg-navy/50 rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
        <p className="text-sm text-textSecondary leading-relaxed">
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-gold"
          >
            |
          </motion.span>
        </p>
      </div>
    </motion.div>
  );
}
