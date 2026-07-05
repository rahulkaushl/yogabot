import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Lock,
  Play,
  Flame,
  Footprints,
  Sunrise,
  Moon,
  Crown,
  Sparkles,
  Heart,
  Shield,
  Share2,
  ChevronLeft,
  ChevronRight,
  Settings,
  Instagram,
  Music,
  Link,
  X,
  Award,
  TrendingUp,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import confetti from 'canvas-confetti';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Badge {
  id: number;
  name: string;
  icon: React.ElementType;
  description: string;
  unlockCondition: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  progressMax?: number;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  color: string;
}

interface HeatmapDay {
  day: number;
  minutes: number;
  isToday?: boolean;
}

/* ──────────────────────────────────────────────
   Mock Data
   ────────────────────────────────────────────── */

const USER = {
  username: 'YogiTeen_42',
  displayName: 'Alex',
  level: 5,
  levelTitle: 'Yoga Apprentice',
  xp: 2450,
  xpToNextLevel: 3000,
  memberSince: 'Jan 2026',
  avatar: 'A',
};

const WEEKLY_STATS = [
  { label: 'Day Streak', value: 12, icon: Flame, color: '#EF4444', glow: true },
  { label: 'Sessions', value: 24, icon: Play, color: '#F5A623' },
  { label: 'Hours Saved', value: 8.5, icon: Activity, color: '#3B82F6', isDecimal: true },
  { label: 'Badges', value: 4, icon: Award, color: '#A855F7' },
];

const BADGES: Badge[] = [
  {
    id: 1,
    name: 'First Step',
    icon: Footprints,
    description: 'Completed your first yoga session! The journey of a thousand miles begins with a single pose.',
    unlockCondition: 'Complete 1 yoga session',
    unlocked: true,
    unlockedDate: 'Jan 1, 2026',
  },
  {
    id: 2,
    name: 'Week Warrior',
    icon: Crown,
    description: 'Maintained a 7-day streak. Consistency is the key to transformation!',
    unlockCondition: '7-day consecutive streak',
    unlocked: true,
    unlockedDate: 'Jan 8, 2026',
  },
  {
    id: 3,
    name: 'Detox Master',
    icon: Lock,
    description: 'Completed 10 digital detox sessions. Your brain thanks you!',
    unlockCondition: 'Complete 10 detox sessions',
    unlocked: true,
    unlockedDate: 'Jan 12, 2026',
  },
  {
    id: 4,
    name: 'Yoga Beginner',
    icon: Activity,
    description: 'Completed 10 yoga sessions. You\'re building a solid foundation!',
    unlockCondition: 'Complete 10 yoga sessions',
    unlocked: true,
    unlockedDate: 'Jan 15, 2026',
  },
  {
    id: 5,
    name: 'Early Bird',
    icon: Sunrise,
    description: 'Complete 5 morning sessions before 8 AM. Rise and shine!',
    unlockCondition: '5 morning sessions (before 8 AM)',
    unlocked: false,
    progress: 3,
    progressMax: 5,
  },
  {
    id: 6,
    name: 'Night Owl',
    icon: Moon,
    description: 'Complete 5 evening sessions after 8 PM. Moonlight warrior!',
    unlockCondition: '5 evening sessions (after 8 PM)',
    unlocked: false,
    progress: 2,
    progressMax: 5,
  },
  {
    id: 7,
    name: 'Community Star',
    icon: Heart,
    description: 'Posted 5 times in the community. Your voice matters!',
    unlockCondition: 'Post 5 times in community',
    unlocked: false,
    progress: 2,
    progressMax: 5,
  },
  {
    id: 8,
    name: 'Media Wise',
    icon: Shield,
    description: 'Completed all media literacy modules. Knowledge is power!',
    unlockCondition: 'Complete all literacy modules',
    unlocked: false,
    progress: 1,
    progressMax: 3,
  },
  {
    id: 9,
    name: 'Balance Guru',
    icon: Sparkles,
    description: 'Reached Level 10. A true master of digital wellness!',
    unlockCondition: 'Reach Level 10',
    unlocked: false,
    progress: 5,
    progressMax: 10,
  },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    date: 'Today',
    title: '12-Day Streak! 🔥',
    subtitle: "You're on fire, Alex! Keep it going!",
    color: '#F5A623',
  },
  {
    id: '2',
    date: 'Yesterday',
    title: '+200 XP · Level 5 reached',
    subtitle: 'Yoga Apprentice unlocked',
    color: '#14B8A6',
  },
  {
    id: '3',
    date: 'Jan 14',
    title: 'Digital Detox — 30 min complete',
    subtitle: '10th detox session · Detox Master badge!',
    color: '#A855F7',
  },
  {
    id: '4',
    date: 'Jan 12',
    title: 'Community Post Shared',
    subtitle: 'Your progress inspired 3 friends!',
    color: '#3B82F6',
  },
  {
    id: '5',
    date: 'Jan 8',
    title: 'Completed Week Warrior Challenge',
    subtitle: '7-day streak · +150 XP bonus',
    color: '#22C55E',
  },
  {
    id: '6',
    date: 'Jan 1',
    title: 'First Yoga Session',
    subtitle: 'The journey began 🌱 · +50 XP',
    color: '#F5A623',
  },
];

const XP_DATA = [
  { name: 'Yoga', value: 1100, color: '#14B8A6' },
  { name: 'Detox', value: 613, color: '#A855F7' },
  { name: 'Streaks', value: 368, color: '#F5A623' },
  { name: 'Challenges', value: 245, color: '#3B82F6' },
  { name: 'Other', value: 124, color: '#22C55E' },
];

const HEATMAP_DAYS: HeatmapDay[] = [
  { day: 1, minutes: 0 }, { day: 2, minutes: 20 }, { day: 3, minutes: 45 },
  { day: 4, minutes: 30 }, { day: 5, minutes: 0 }, { day: 6, minutes: 60 },
  { day: 7, minutes: 15 }, { day: 8, minutes: 40 }, { day: 9, minutes: 25 },
  { day: 10, minutes: 50 }, { day: 11, minutes: 0 }, { day: 12, minutes: 35 },
  { day: 13, minutes: 20 }, { day: 14, minutes: 55 }, { day: 15, minutes: 30 },
  { day: 16, minutes: 0 }, { day: 17, minutes: 25 }, { day: 18, minutes: 45 },
  { day: 19, minutes: 15 }, { day: 20, minutes: 40 }, { day: 21, minutes: 0 },
  { day: 22, minutes: 35 }, { day: 23, minutes: 50 }, { day: 24, minutes: 20 },
  { day: 25, minutes: 30 }, { day: 26, minutes: 0 }, { day: 27, minutes: 45 },
  { day: 28, minutes: 25 }, { day: 29, minutes: 0 }, { day: 30, minutes: 40 },
  { day: 31, minutes: 35 },
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

/** Animated circular XP ring */
function LevelRing({
  level,
  xp,
  xpToNext,
}: {
  level: number;
  xp: number;
  xpToNext: number;
}) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = xp / xpToNext;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[120px] h-[120px]">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#1A2B47"
            strokeWidth="8"
          />
          {/* Fill */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#FFD93D" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-lg font-bold"
            style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            LVL {level}
          </span>
          <span className="text-[10px] font-medium" style={{ color: '#64748B' }}>
            {xp} XP
          </span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
        {xpToNext - xp} XP to Level {level + 1}
      </span>
    </div>
  );
}

/** Stat pill */
function StatPill({
  stat,
  index,
}: {
  stat: (typeof WEEKLY_STATS)[number];
  index: number;
}) {
  const Icon = stat.icon;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = stat.value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        setDisplayValue(stat.value);
        clearInterval(timer);
      } else {
        setDisplayValue(Number(current.toFixed(stat.isDecimal ? 1 : 0)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [stat.value, stat.isDecimal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="flex flex-col items-center justify-center gap-1 rounded-xl py-3 px-2"
      style={{
        background: '#111D32',
        border: stat.glow ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(255,255,255,0.04)',
        boxShadow: stat.glow ? '0 0 12px rgba(239,68,68,0.08)' : 'none',
      }}
    >
      <Icon size={16} style={{ color: stat.color }} />
      <span
        className="text-lg font-semibold"
        style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {stat.isDecimal ? displayValue.toFixed(1) : displayValue}
      </span>
      <span className="text-[10px] font-medium" style={{ color: '#64748B' }}>
        {stat.label}
      </span>
    </motion.div>
  );
}

/** Badge item in grid */
function BadgeItem({
  badge,
  index,
  onClick,
}: {
  badge: Badge;
  index: number;
  onClick: () => void;
}) {
  const Icon = badge.icon;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200"
      style={{
        background: badge.unlocked ? 'rgba(245,166,35,0.04)' : 'transparent',
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
        style={{
          background: badge.unlocked
            ? 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(255,217,61,0.08))'
            : 'rgba(26,43,71,0.5)',
          border: badge.unlocked
            ? '2px solid #F5A623'
            : '2px dashed #475569',
          boxShadow: badge.unlocked
            ? '0 0 12px rgba(245,166,35,0.15)'
            : 'none',
          opacity: badge.unlocked ? 1 : 0.4,
          filter: badge.unlocked ? 'none' : 'grayscale(70%)',
        }}
      >
        <Icon
          size={28}
          style={{ color: badge.unlocked ? '#F5A623' : '#64748B' }}
        />
        {badge.unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: '#22C55E' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 500 }}
          >
            <Sparkles size={10} className="text-white" />
          </motion.div>
        )}
      </div>
      <span
        className="text-[11px] font-medium text-center leading-tight"
        style={{ color: badge.unlocked ? '#F0F2F5' : '#475569' }}
      >
        {badge.name}
      </span>
    </motion.button>
  );
}

/** Badge detail modal */
function BadgeDetailModal({
  badge,
  onClose,
}: {
  badge: Badge;
  onClose: () => void;
}) {
  const Icon = badge.icon;
  const progress = badge.progress && badge.progressMax
    ? (badge.progress / badge.progressMax) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-full max-w-[300px] rounded-[20px] p-6 flex flex-col items-center gap-4 relative"
        style={{
          background: '#111D32',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <X size={16} style={{ color: '#64748B' }} />
        </button>

        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{
            background: badge.unlocked
              ? 'linear-gradient(135deg, rgba(245,166,35,0.2), rgba(255,217,61,0.1))'
              : 'rgba(26,43,71,0.5)',
            border: badge.unlocked ? '2px solid #F5A623' : '2px dashed #475569',
            boxShadow: badge.unlocked
              ? '0 0 20px rgba(245,166,35,0.2)'
              : 'none',
            filter: badge.unlocked ? 'none' : 'grayscale(70%)',
            opacity: badge.unlocked ? 1 : 0.4,
          }}
        >
          <Icon size={36} style={{ color: badge.unlocked ? '#F5A623' : '#64748B' }} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h3
            className="text-xl font-bold"
            style={{
              color: badge.unlocked ? '#F0F2F5' : '#94A3B8',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {badge.name}
          </h3>
          <p className="text-sm text-center leading-relaxed" style={{ color: '#94A3B8' }}>
            {badge.description}
          </p>
        </div>

        <div
          className="px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(245,166,35,0.1)' }}
        >
          <span className="text-xs font-medium" style={{ color: '#F5A623' }}>
            {badge.unlockCondition}
          </span>
        </div>

        {badge.unlocked && badge.unlockedDate && (
          <span className="text-xs" style={{ color: '#64748B' }}>
            Unlocked {badge.unlockedDate}
          </span>
        )}

        {!badge.unlocked && badge.progress !== undefined && badge.progressMax !== undefined && (
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] font-medium" style={{ color: '#64748B' }}>
                Progress
              </span>
              <span className="text-[10px] font-medium" style={{ color: '#F5A623' }}>
                {badge.progress}/{badge.progressMax}
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: '#1A2B47' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(135deg, #F5A623, #FFD93D)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Timeline item */
function TimelineItem({
  event,
  index,
}: {
  event: TimelineEvent;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.35 }}
      className="flex items-start gap-3 relative"
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: event.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.15 + 0.2,
            type: 'spring',
            stiffness: 500,
          }}
        />
        {index < TIMELINE_EVENTS.length - 1 && (
          <div
            className="w-0.5 flex-1 mt-1"
            style={{ background: '#1A2B47', minHeight: '40px' }}
          />
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col gap-0.5 pb-5">
        <span
          className="text-[10px] font-medium"
          style={{ color: event.color }}
        >
          {event.date}
        </span>
        <span className="text-sm font-medium" style={{ color: '#F0F2F5' }}>
          {event.title}
        </span>
        <span className="text-xs" style={{ color: '#64748B' }}>
          {event.subtitle}
        </span>
      </div>
    </motion.div>
  );
}

/** Heatmap cell */
function HeatmapCell({
  day,
  index,
}: {
  day: HeatmapDay;
  index: number;
}) {
  const getColor = (minutes: number) => {
    if (minutes === 0) return '#1A2B47';
    if (minutes <= 15) return 'rgba(20,184,166,0.25)';
    if (minutes <= 30) return 'rgba(20,184,166,0.5)';
    if (minutes <= 45) return 'rgba(20,184,166,0.75)';
    return '#14B8A6';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="w-8 h-8 rounded-md flex items-center justify-center relative group"
      style={{
        background: getColor(day.minutes),
        border: day.isToday ? '2px solid #F5A623' : 'none',
      }}
    >
      <span className="text-[10px] font-medium" style={{ color: day.minutes > 30 ? '#0A1628' : '#64748B' }}>
        {day.day}
      </span>
      {/* Tooltip */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
        style={{ background: '#1A2B47', color: '#F0F2F5' }}
      >
        {day.minutes} min
      </div>
    </motion.div>
  );
}

/** Share modal */
function ShareModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-full max-w-[340px] rounded-[20px] p-5 flex flex-col items-center gap-4"
        style={{
          background: '#111D32',
          border: '1px solid rgba(245,166,35,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <X size={16} style={{ color: '#64748B' }} />
        </button>

        {/* Preview Card */}
        <div
          className="w-full rounded-2xl p-5 flex flex-col items-center gap-3"
          style={{
            background: '#0A1628',
            border: '1px solid rgba(245,166,35,0.15)',
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/yogbot-mascot.png"
              alt="YOG-BOT"
              className="w-10 h-10 object-contain"
            />
            <span
              className="text-base font-bold"
              style={{ color: '#F5A623', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              YOG-BOT
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span
              className="text-xl font-bold"
              style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Level {USER.level} · {USER.levelTitle}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Flame size={14} style={{ color: '#EF4444' }} />
              <span className="text-xs" style={{ color: '#94A3B8' }}>
                12 day streak
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Activity size={14} style={{ color: '#14B8A6' }} />
              <span className="text-xs" style={{ color: '#94A3B8' }}>
                78 min yoga
              </span>
            </div>
          </div>

          <p
            className="text-sm italic text-center"
            style={{ color: '#F5A623' }}
          >
            "Rebooting. One session at a time."
          </p>
          <span className="text-[10px]" style={{ color: '#64748B' }}>
            #RebootYourself · yog-bot.app
          </span>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2 w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(245,166,35,0.5)',
              color: '#F5A623',
            }}
          >
            <Instagram size={16} />
            <span>Instagram</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(245,166,35,0.5)',
              color: '#F5A623',
            }}
          >
            <Music size={16} />
            <span>TikTok</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(245,166,35,0.5)',
              color: '#F5A623',
            }}
          >
            <Link size={16} />
            <span>Copy</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Main Profile Page Component
   ────────────────────────────────────────────── */

export default function Profile() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [activeMonth] = useState('January 2026');

  const unlockedCount = useMemo(
    () => BADGES.filter((b) => b.unlocked).length,
    []
  );

  const handleBadgeClick = useCallback((badge: Badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#F5A623', '#FFD93D', '#FFF'],
      });
    }
  }, []);

  return (
    <div
      className="w-full pb-6 overflow-y-auto"
      style={{
        height: 'calc(100dvh - 72px)',
        background: '#0A1628',
      }}
    >
      {/* ── Top Header Bar ── */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-4 h-14"
        style={{
          background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <h1
          className="text-lg font-bold"
          style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Profile
        </h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <Settings size={18} style={{ color: '#94A3B8' }} />
        </motion.button>
      </div>

      {/* ── Section 1: User Header + Level ── */}
      <div
        className="flex flex-col items-center gap-3 px-5 pt-8 pb-6"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, #1A2B47 0%, #0A1628 70%)',
        }}
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0px rgba(245,166,35,0)',
                '0 0 0 6px rgba(245,166,35,0.2)',
                '0 0 0 0px rgba(245,166,35,0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center"
          >
            <span
              className="text-3xl font-bold"
              style={{ color: '#0A1628' }}
            >
              {USER.avatar}
            </span>
          </motion.div>
          {/* Level badge */}
          <div
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-gold flex items-center justify-center"
            style={{ border: '2px solid #0A1628' }}
          >
            <span className="text-[10px] font-bold" style={{ color: '#0A1628' }}>
              {USER.level}
            </span>
          </div>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center gap-0.5"
        >
          <h2
            className="text-2xl font-bold"
            style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {USER.displayName}
          </h2>
          <span className="text-sm font-medium" style={{ color: '#F5A623' }}>
            {USER.levelTitle}
          </span>
          <span className="text-[10px]" style={{ color: '#64748B' }}>
            Member since {USER.memberSince}
          </span>
        </motion.div>

        {/* Level Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LevelRing
            level={USER.level}
            xp={USER.xp}
            xpToNext={USER.xpToNextLevel}
          />
        </motion.div>
      </div>

      {/* ── Section 2: Weekly Stats Row ── */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WEEKLY_STATS.map((stat, i) => (
            <StatPill key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>

      {/* ── Section 3: Achievement Badges ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mx-4 mt-4 rounded-2xl p-5"
        style={{
          background: 'linear-gradient(180deg, #111D32 0%, #0D1A2D 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-semibold"
            style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Achievements
          </h3>
          <span className="text-xs font-medium" style={{ color: '#64748B' }}>
            {unlockedCount} / {BADGES.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {BADGES.map((badge, i) => (
            <BadgeItem
              key={badge.id}
              badge={badge}
              index={i}
              onClick={() => handleBadgeClick(badge)}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Section 4: Wellness Timeline ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="px-4 mt-6"
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Your Journey
        </h3>
        <div className="flex flex-col">
          {TIMELINE_EVENTS.map((event, i) => (
            <TimelineItem key={event.id} event={event} index={i} />
          ))}
        </div>
      </motion.div>

      {/* ── Section 5: XP Breakdown (Donut Chart) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mx-4 mt-6 rounded-2xl p-5"
        style={{
          background: 'linear-gradient(180deg, #111D32 0%, #0D1A2D 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          XP Sources
        </h3>

        <div className="flex flex-col items-center gap-4">
          <div className="w-[180px] h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={XP_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {XP_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span
                className="text-2xl font-bold"
                style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {USER.xp}
              </span>
              <span className="text-[10px] font-medium" style={{ color: '#64748B' }}>
                Total XP
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {XP_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-xs" style={{ color: '#94A3B8' }}>
                  {item.name}
                </span>
                <span className="text-xs font-medium" style={{ color: '#F0F2F5' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Section 6: Streak Calendar (Heatmap) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mx-4 mt-6 rounded-2xl p-5"
        style={{
          background: 'linear-gradient(180deg, #111D32 0%, #0D1A2D 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-semibold"
            style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {activeMonth}
          </h3>
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <ChevronLeft size={14} style={{ color: '#64748B' }} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <ChevronRight size={14} style={{ color: '#64748B' }} />
            </motion.button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="w-8 h-6 flex items-center justify-center"
            >
              <span className="text-[10px] font-medium" style={{ color: '#475569' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-cols-7 gap-1">
          {HEATMAP_DAYS.map((day, i) => (
            <HeatmapCell key={day.day} day={{ ...day, isToday: day.day === 24 }} index={i} />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-[10px]" style={{ color: '#64748B' }}>
            Less
          </span>
          <div className="flex gap-1">
            {['#1A2B47', 'rgba(20,184,166,0.25)', 'rgba(20,184,166,0.5)', 'rgba(20,184,166,0.75)', '#14B8A6'].map(
              (color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-sm"
                  style={{ background: color }}
                />
              )
            )}
          </div>
          <span className="text-[10px]" style={{ color: '#64748B' }}>
            More
          </span>
        </div>
      </motion.div>

      {/* ── Section 7: Share Progress ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mx-4 mt-6 rounded-2xl p-5 mb-6"
        style={{
          background: 'linear-gradient(180deg, rgba(245,166,35,0.08) 0%, #111D32 100%)',
          border: '1px solid rgba(245,166,35,0.12)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} style={{ color: '#F5A623' }} />
            <h3
              className="text-lg font-semibold"
              style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Share Your Progress
            </h3>
          </div>
          <p className="text-xs text-center" style={{ color: '#94A3B8' }}>
            Inspire your friends by sharing your wellness journey!
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowShare(true)}
            className="w-full h-12 rounded-xl text-base font-bold gradient-gold flex items-center justify-center gap-2"
            style={{ color: '#0A1628' }}
          >
            <Share2 size={18} />
            <span>Share Progress</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Badge Detail Modal ── */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailModal
            badge={selectedBadge}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {showShare && <ShareModal onClose={() => setShowShare(false)} />}
      </AnimatePresence>
    </div>
  );
}
