import { motion } from 'framer-motion';

interface PoseProgressBarProps {
  current: number;
  total: number;
  poseNames: string[];
}

export default function PoseProgressBar({ current, total, poseNames }: PoseProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex gap-1 mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 h-1.5 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{
              backgroundColor: i <= current ? '#F5A623' : '#1A2B47',
              originX: 0,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-textMuted">
        {poseNames.map((name, i) => (
          <span key={i} className={i === current ? 'text-gold font-medium' : ''}>
            {name.split(' ').slice(0, 2).join(' ')}
          </span>
        ))}
      </div>
    </div>
  );
}
