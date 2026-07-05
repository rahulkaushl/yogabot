import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Play, Lock, Wind } from 'lucide-react';
import YogBotQuote from '@/components/dashboard/YogBotQuote';
import StreakCounter from '@/components/dashboard/StreakCounter';
import XPBar from '@/components/dashboard/XPBar';
import ScreenTimeRing from '@/components/dashboard/ScreenTimeRing';
import ScheduleTimeline from '@/components/dashboard/ScheduleTimeline';
import MoodSelector from '@/components/dashboard/MoodSelector';
import MiniBarChart from '@/components/dashboard/MiniBarChart';
import BreathingModal from '@/components/dashboard/BreathingModal';

/* ── mock data ─────────────────────────────────────────────── */

const STREAK = 12;
const XP_CURRENT = 2450;
const XP_MAX = 3000;
const LEVEL = 5;
const SCREEN_TIME_HOURS = 4.2;
const SCREEN_TIME_GOAL = 6;

const SCHEDULE_ITEMS = [
  { time: '7:00 AM', title: 'Morning Meditation', status: 'completed' as const },
  { time: '8:30 AM', title: 'Yoga Flow — Study Break', status: 'current' as const },
  { time: '12:00 PM', title: 'Digital Detox — Lunch Break', status: 'upcoming' as const },
  { time: '9:00 PM', title: 'Sleep Prep Yoga', status: 'upcoming' as const },
];

const WEEKLY_DATA = [
  { day: 'Mon', yoga: 15, detox: 10, isToday: false },
  { day: 'Tue', yoga: 20, detox: 0, isToday: false },
  { day: 'Wed', yoga: 12, detox: 15, isToday: false },
  { day: 'Thu', yoga: 18, detox: 0, isToday: false },
  { day: 'Fri', yoga: 25, detox: 20, isToday: false },
  { day: 'Sat', yoga: 30, detox: 30, isToday: true },
  { day: 'Sun', yoga: 0, detox: 0, isToday: false },
];

const WEEKLY_SUMMARY = '5 sessions · 78 min yoga · 2 detoxes';

/* ── component ─────────────────────────────────────────────── */

export default function Dashboard() {
  const navigate = useNavigate();
  const [breathingOpen, setBreathingOpen] = useState(false);

  // Get greeting based on time of day
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17) greeting = 'Good Evening';

  return (
    <div className="w-full pb-4">
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 pt-4 pb-2"
      >
        <h1 className="font-display text-2xl font-bold text-textPrimary">
          {greeting}, Alex
        </h1>
        <p className="text-sm text-textSecondary mt-0.5">
          Ready to reboot your day?
        </p>
      </motion.div>

      {/* Section 1: Yog-Bot Quote */}
      <div className="px-4 pt-2">
        <YogBotQuote />
      </div>

      {/* Section 2: Streak + XP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="px-4 py-3"
      >
        <div className="flex items-center gap-3 mb-3">
          <StreakCounter streak={STREAK} />
        </div>
        <XPBar currentXP={XP_CURRENT} maxXP={XP_MAX} level={LEVEL} />
      </motion.div>

      {/* Section 3: Screen Time */}
      <div className="px-4 py-2">
        <ScreenTimeRing hours={SCREEN_TIME_HOURS} goal={SCREEN_TIME_GOAL} />
      </div>

      {/* Section 4: Quick Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="px-4 py-3 flex flex-col gap-2.5"
      >
        {/* Start Yoga — Primary */}
        <motion.button
          onClick={() => navigate('/yoga')}
          className="w-full h-14 rounded-[14px] flex items-center justify-center gap-2.5 font-bold text-base relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #F5A623, #FFD93D)',
            color: '#0A1628',
          }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ filter: 'brightness(1.1)' }}
        >
          <Play size={20} fill="#0A1628" />
          <span>Start Yoga Session</span>
          <span className="text-xs font-medium opacity-70 ml-1">
            Next: Morning Flow · 12 min
          </span>
        </motion.button>

        {/* Detox Now — Secondary */}
        <motion.button
          onClick={() => navigate('/detox')}
          className="w-full h-12 rounded-[14px] flex items-center justify-center gap-2.5 font-semibold text-base border-[1.5px] border-gold/50 text-gold hover:bg-gold/10 transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          <Lock size={20} />
          <span>Start Digital Detox</span>
          <span className="text-xs font-medium opacity-60 ml-1">
            30 min · Earn 150 XP
          </span>
        </motion.button>

        {/* Breathe — Secondary */}
        <motion.button
          onClick={() => setBreathingOpen(true)}
          className="w-full h-12 rounded-[14px] flex items-center justify-center gap-2.5 font-semibold text-base border-[1.5px] border-gold/50 text-gold hover:bg-gold/10 transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          <motion.div
            animate={{ x: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Wind size={20} />
          </motion.div>
          <span>Quick Breathe Exercise</span>
          <span className="text-xs font-medium opacity-60 ml-1">
            2 min · Calm your mind
          </span>
        </motion.button>
      </motion.div>

      {/* Section 5: Today's Schedule */}
      <div className="px-4 py-2">
        <ScheduleTimeline items={SCHEDULE_ITEMS} />
      </div>

      {/* Section 6: Mood Check-In */}
      <div className="px-4 py-2">
        <MoodSelector />
      </div>

      {/* Section 7: Weekly Mini-Stats */}
      <div className="px-4 py-2">
        <MiniBarChart data={WEEKLY_DATA} summary={WEEKLY_SUMMARY} />
      </div>

      {/* Breathing Modal */}
      <BreathingModal isOpen={breathingOpen} onClose={() => setBreathingOpen(false)} />
    </div>
  );
}
