import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import 'react-circular-progressbar/dist/styles.css';

interface ScreenTimeRingProps {
  hours: number;
  goal: number;
}

export default function ScreenTimeRing({ hours = 4.2, goal = 6 }: ScreenTimeRingProps) {
  const percentage = Math.min((hours / goal) * 100, 100);
  
  const getColor = () => {
    if (hours < 4) return '#22C55E';
    if (hours < 6) return '#EAB308';
    return '#EF4444';
  };

  const getStatus = () => {
    if (hours < 4) return { label: 'On Track', icon: TrendingDown, color: 'text-success' };
    if (hours < 6) return { label: 'Getting Close', icon: Minus, color: 'text-warning' };
    return { label: 'Over Limit', icon: TrendingUp, color: 'text-danger' };
  };

  const status = getStatus();
  const StatusIcon = status.icon;
  const color = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-midnight to-[#0D1A2D] rounded-2xl border border-white/[0.06] p-5 flex items-center gap-4"
    >
      <div className="w-24 h-24 flex-shrink-0">
        <CircularProgressbar
          value={percentage}
          text={`${hours}h`}
          styles={buildStyles({
            pathColor: color,
            textColor: '#F0F2F5',
            trailColor: '#1A2B47',
            textSize: '22px',
            pathTransitionDuration: 1,
          })}
        />
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-textSecondary mb-1">Screen Time Today</p>
        <div className={`flex items-center gap-1 ${status.color}`}>
          <StatusIcon size={14} />
          <span className="text-sm font-semibold">{status.label}</span>
        </div>
        <p className="text-xs text-textMuted mt-1">
          Goal: {goal}h · {((goal - hours) * 60).toFixed(0)} min left
        </p>
      </div>
    </motion.div>
  );
}
