import { motion } from 'framer-motion';
import { Check, Circle, Clock } from 'lucide-react';

interface ScheduleItem {
  time: string;
  title: string;
  type: 'completed' | 'current' | 'upcoming';
  icon: string;
}

const SCHEDULE: ScheduleItem[] = [
  { time: '7:00 AM', title: 'Morning Stretch', type: 'completed', icon: '🌅' },
  { time: '12:30 PM', title: 'Lunch Break Yoga', type: 'completed', icon: '🧘' },
  { time: '3:00 PM', title: 'Afternoon Detox', type: 'current', icon: '📵' },
  { time: '6:00 PM', title: 'Evening Flow', type: 'upcoming', icon: '🌙' },
  { time: '9:30 PM', title: 'Sleep Meditation', type: 'upcoming', icon: '😴' },
];

export default function ScheduleTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-gradient-to-br from-midnight to-[#0D1A2D] rounded-2xl border border-white/[0.06] p-5"
    >
      <h3 className="font-display font-bold text-textPrimary mb-4">Today's Schedule</h3>
      
      <div className="space-y-0">
        {SCHEDULE.map((item, i) => (
          <motion.div
            key={item.time}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-start gap-3 relative"
          >
            {/* Connector line */}
            {i < SCHEDULE.length - 1 && (
              <div className="absolute left-[19px] top-8 w-0.5 h-full bg-white/5" />
            )}
            
            {/* Status dot */}
            <div className="relative z-10 mt-1">
              {item.type === 'completed' && (
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Check size={12} className="text-success" />
                </div>
              )}
              {item.type === 'current' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-5 h-5 rounded-full bg-gold/30 flex items-center justify-center ring-2 ring-gold"
                >
                  <Clock size={12} className="text-gold" />
                </motion.div>
              )}
              {item.type === 'upcoming' && (
                <div className="w-5 h-5 rounded-full border-2 border-white/10 flex items-center justify-center">
                  <Circle size={8} className="text-textMuted" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 ${item.type === 'completed' ? 'opacity-60' : ''}`}>
              <p className="text-xs text-textMuted">{item.time}</p>
              <p className={`text-sm font-medium ${
                item.type === 'current' ? 'text-gold' : 'text-textPrimary'
              }`}>
                {item.icon} {item.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
