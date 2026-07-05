import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { day: 'Mon', yoga: 15, detox: 20 },
  { day: 'Tue', yoga: 20, detox: 15 },
  { day: 'Wed', yoga: 25, detox: 30 },
  { day: 'Thu', yoga: 10, detox: 25 },
  { day: 'Fri', yoga: 30, detox: 20 },
  { day: 'Sat', yoga: 35, detox: 40 },
  { day: 'Sun', yoga: 20, detox: 10 },
];

const today = 5; // Saturday

export default function MiniBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-midnight to-[#0D1A2D] rounded-2xl border border-white/[0.06] p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-textPrimary">This Week</h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-calm" />
            <span className="text-textSecondary">Yoga</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple" />
            <span className="text-textSecondary">Detox</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barGap={2}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <Bar dataKey="yoga" radius={[4, 4, 0, 0]} maxBarSize={16}>
            {data.map((_, i) => (
              <Cell
                key={`yoga-${i}`}
                fill={i === today ? '#14B8A6' : 'rgba(20, 184, 166, 0.4)'}
              />
            ))}
          </Bar>
          <Bar dataKey="detox" radius={[4, 4, 0, 0]} maxBarSize={16}>
            {data.map((_, i) => (
              <Cell
                key={`detox-${i}`}
                fill={i === today ? '#A855F7' : 'rgba(168, 85, 247, 0.4)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-textMuted text-xs mt-3 text-center">
        155 min yoga · 160 min detox this week
      </p>
    </motion.div>
  );
}
