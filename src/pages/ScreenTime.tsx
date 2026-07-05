import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import CountUp from 'react-countup';
import { TrendingDown, Smartphone, TrendingUp } from 'lucide-react';
import 'react-circular-progressbar/dist/styles.css';

/* ── mock data ─────────────────────────────────────────────── */

const DAILY_HOURS = 4.2;
const DAILY_GOAL = 5.0;
const WEEKLY_DATA = [
  { day: 'Mon', hours: 5.8 },
  { day: 'Tue', hours: 6.2 },
  { day: 'Wed', hours: 4.5 },
  { day: 'Thu', hours: 3.9 },
  { day: 'Fri', hours: 5.1 },
  { day: 'Sat', hours: 4.2, isToday: true },
  { day: 'Sun', hours: 3.5 },
];

const APPS = [
  { name: 'Instagram', hours: 2.1, trend: 'up', icon: '📸' },
  { name: 'TikTok', hours: 1.5, trend: 'down', icon: '🎵' },
  { name: 'YouTube', hours: 0.8, trend: 'down', icon: '▶️' },
  { name: 'Snapchat', hours: 0.5, trend: 'up', icon: '👻' },
  { name: 'Messages', hours: 0.3, trend: 'same', icon: '💬' },
];

const INSIGHTS = [
  { title: 'Peak Usage', text: 'You use your phone most between 8-10 PM. Try a detox during this time!', color: '#F5A623' },
  { title: 'Weekend Win', text: 'Your screen time is 25% lower on weekends. Keep it up!', color: '#22C55E' },
  { title: 'Social Media', text: 'Instagram takes 50% of your screen time. Consider setting app limits.', color: '#3B82F6' },
];

/* ── component ─────────────────────────────────────────────── */

export default function ScreenTime() {
  const [goalHours, setGoalHours] = useState(DAILY_GOAL);
  const percentage = Math.min((DAILY_HOURS / goalHours) * 100, 100);

  const getRingColor = () => {
    if (DAILY_HOURS < 4) return '#22C55E';
    if (DAILY_HOURS < 6) return '#EAB308';
    return '#EF4444';
  };

  const savedHours = Math.max(goalHours - DAILY_HOURS, 0);

  return (
    <div className="w-full pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4 pb-2"
      >
        <h1 className="font-display text-2xl font-bold text-textPrimary">Screen Time</h1>
        <p className="text-sm text-textSecondary">Understand your digital habits</p>
      </motion.div>

      {/* Daily Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center py-6"
      >
        <div className="w-44 h-44 mb-4">
          <CircularProgressbar
            value={percentage}
            text={`${DAILY_HOURS}h`}
            styles={buildStyles({
              pathColor: getRingColor(),
              textColor: '#F0F2F5',
              trailColor: '#1A2B47',
              textSize: '24px',
              pathTransitionDuration: 1,
            })}
          />
        </div>

        {/* Celebration message */}
        {savedHours > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 bg-success/10 rounded-full px-4 py-2"
          >
            <TrendingDown size={16} className="text-success" />
            <span className="text-success text-sm font-medium">
              You saved {savedHours.toFixed(1)} hours today!
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-3"
      >
        <div className="bg-gradient-to-br from-midnight to-[#0D1A2D] rounded-2xl border border-white/[0.06] p-5">
          <h3 className="font-display font-bold text-textPrimary mb-4">This Week</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={WEEKLY_DATA}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]} maxBarSize={28}>
                {WEEKLY_DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isToday ? '#F5A623' : entry.hours > goalHours ? '#EF4444' : '#22C55E'}
                    fillOpacity={entry.isToday ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-textMuted text-xs mt-3 text-center">
            Avg: {(WEEKLY_DATA.reduce((a, b) => a + b.hours, 0) / 7).toFixed(1)}h/day · Goal: {goalHours}h
          </p>
        </div>
      </motion.div>

      {/* App Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4 py-3"
      >
        <div className="bg-gradient-to-br from-midnight to-[#0D1A2D] rounded-2xl border border-white/[0.06] p-5">
          <h3 className="font-display font-bold text-textPrimary mb-4">Most Used Apps</h3>
          <div className="space-y-3">
            {APPS.map((app, i) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg">{app.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-textPrimary font-medium">{app.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-textSecondary">{app.hours}h</span>
                      {app.trend === 'up' && <TrendingUp size={12} className="text-danger" />}
                      {app.trend === 'down' && <TrendingDown size={12} className="text-success" />}
                    </div>
                  </div>
                  <div className="h-1.5 bg-navy rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(app.hours / 2.5) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: app.trend === 'up' ? '#EF4444' : '#22C55E',
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4 py-3"
      >
        <h3 className="font-display font-bold text-textPrimary mb-3 px-1">AI Insights</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {INSIGHTS.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.1 }}
              className="flex-shrink-0 w-64 bg-gradient-to-br from-midnight to-[#0D1A2D] rounded-2xl border border-white/[0.06] p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Smartphone size={14} style={{ color: insight.color }} />
                <span className="text-sm font-semibold" style={{ color: insight.color }}>
                  {insight.title}
                </span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">{insight.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Goal Setting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 py-3"
      >
        <div className="bg-gradient-to-br from-midnight to-[#0D1A2D] rounded-2xl border border-white/[0.06] p-5">
          <h3 className="font-display font-bold text-textPrimary mb-4">Daily Goal</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={2}
              max={10}
              step={0.5}
              value={goalHours}
              onChange={(e) => setGoalHours(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-navy rounded-full appearance-none cursor-pointer accent-gold"
            />
            <span className="font-mono text-lg font-medium text-gold w-16 text-right">
              <CountUp end={goalHours} decimals={1} duration={0.5} />h
            </span>
          </div>
          <p className="text-xs text-textMuted mt-2">
            {goalHours < DAILY_HOURS
              ? "Your goal is below today's usage. Try a more achievable target!"
              : goalHours === DAILY_HOURS
              ? "Right on target! Keep maintaining this balance."
              : "Great goal! You'll save time for what truly matters."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
