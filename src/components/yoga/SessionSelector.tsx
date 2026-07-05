import { motion } from 'framer-motion';
import { Clock, Flame, Zap } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  image: string;
}

interface SessionSelectorProps {
  sessions: Session[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectSession: (session: Session) => void;
}

const CATEGORIES = ['All', 'Quick Reboots', 'Morning Flow', 'Anxiety Relief', 'Sleep Prep'];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#22C55E',
  Intermediate: '#EAB308',
  Advanced: '#EF4444',
};

export default function SessionSelector({
  sessions,
  selectedCategory,
  onSelectCategory,
  onSelectSession,
}: SessionSelectorProps) {
  const filtered = selectedCategory === 'All'
    ? sessions
    : sessions.filter((s) => s.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 px-4 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gold text-deepSpace'
                : 'bg-midnight text-textSecondary hover:bg-midnight/80'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Session cards */}
      <div className="space-y-3 px-4">
        {filtered.map((session, i) => (
          <motion.button
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelectSession(session)}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 bg-midnight/50 rounded-2xl p-3 border border-white/5 hover:border-white/10 transition-all text-left"
          >
            <img
              src={session.image}
              alt={session.title}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${DIFFICULTY_COLORS[session.difficulty]}20`,
                    color: DIFFICULTY_COLORS[session.difficulty],
                  }}
                >
                  {session.difficulty}
                </span>
              </div>
              <h4 className="font-semibold text-textPrimary text-sm truncate">{session.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-textMuted text-xs">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {session.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={12} />
                  +{session.duration * 2} XP
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
