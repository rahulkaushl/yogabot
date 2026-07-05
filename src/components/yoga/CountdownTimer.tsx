import { motion } from 'framer-motion';

interface CountdownTimerProps {
  seconds: number;
  isActive: boolean;
}

export default function CountdownTimer({ seconds, isActive }: CountdownTimerProps) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1 }}
      className="text-center"
    >
      <span className="font-mono text-6xl font-medium text-textPrimary tracking-tight">
        {display}
      </span>
    </motion.div>
  );
}
