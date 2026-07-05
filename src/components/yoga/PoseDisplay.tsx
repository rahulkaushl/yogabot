import { motion } from 'framer-motion';

interface PoseDisplayProps {
  image: string;
  name: string;
  sanskrit: string;
  description: string;
  nextPoseName?: string;
}

export default function PoseDisplay({
  image,
  name,
  sanskrit,
  description,
  nextPoseName,
}: PoseDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.img
        key={image}
        src={image}
        alt={name}
        className="w-full h-56 object-cover rounded-2xl mb-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        key={name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h3 className="font-display text-lg font-bold text-textPrimary">{name}</h3>
        <p className="text-xs text-textMuted italic mb-2">{sanskrit}</p>
        <p className="text-sm text-textSecondary max-w-xs">{description}</p>
      </motion.div>

      {nextPoseName && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-textMuted mt-3"
        >
          Next: {nextPoseName}
        </motion.p>
      )}
    </div>
  );
}
