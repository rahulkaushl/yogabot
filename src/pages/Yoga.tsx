import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SessionSelector from '@/components/yoga/SessionSelector';
import PoseDisplay from '@/components/yoga/PoseDisplay';
import CountdownTimer from '@/components/yoga/CountdownTimer';
import PoseProgressBar from '@/components/yoga/PoseProgressBar';
import PauseOverlay from '@/components/yoga/PauseOverlay';
import CompletionScreen from '@/components/yoga/CompletionScreen';
import { Pause, Heart } from 'lucide-react';

/* ── types & mock data ─────────────────────────────────────── */

interface Pose {
  name: string;
  sanskrit: string;
  duration: number;
  image: string;
  description: string;
}

interface Session {
  id: string;
  title: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  image: string;
  poses: Pose[];
}

const SESSIONS: Session[] = [
  {
    id: '1',
    title: 'Morning Energy Flow',
    duration: 12,
    difficulty: 'Beginner',
    category: 'Morning Flow',
    image: '/yoga-pose-1.jpg',
    poses: [
      { name: 'Mountain Pose', sanskrit: 'Tadasana', duration: 60, image: '/yoga-pose-1.jpg', description: 'Stand tall, grounding through all four corners of your feet.' },
      { name: 'Warrior II', sanskrit: 'Virabhadrasana II', duration: 45, image: '/yoga-pose-2.jpg', description: 'Open your hips and chest, arms extended, gaze over front hand.' },
      { name: "Child's Pose", sanskrit: 'Balasana', duration: 60, image: '/yoga-pose-3.jpg', description: 'Rest and breathe. Let go of tension in your back and shoulders.' },
    ],
  },
  {
    id: '2',
    title: 'Study Break Stretch',
    duration: 8,
    difficulty: 'Beginner',
    category: 'Quick Reboots',
    image: '/yoga-pose-3.jpg',
    poses: [
      { name: 'Seated Forward Fold', sanskrit: 'Paschimottanasana', duration: 45, image: '/yoga-pose-4.jpg', description: 'Gently fold forward, reaching for your toes or shins.' },
      { name: 'Neck Release', sanskrit: 'Greeva Sanchalana', duration: 30, image: '/yoga-pose-2.jpg', description: 'Slowly tilt your head side to side, releasing neck tension.' },
      { name: 'Corpse Pose', sanskrit: 'Savasana', duration: 60, image: '/yoga-pose-5.jpg', description: 'Lie flat, completely relax every muscle in your body.' },
    ],
  },
  {
    id: '3',
    title: 'Anxiety Relief',
    duration: 15,
    difficulty: 'Intermediate',
    category: 'Anxiety Relief',
    image: '/yoga-pose-4.jpg',
    poses: [
      { name: 'Legs Up the Wall', sanskrit: 'Viparita Karani', duration: 90, image: '/yoga-pose-5.jpg', description: 'Relax with legs elevated. Calms the nervous system.' },
      { name: 'Butterfly Pose', sanskrit: 'Baddha Konasana', duration: 60, image: '/yoga-pose-3.jpg', description: 'Sole of feet together, gently flap knees like wings.' },
      { name: 'Supine Twist', sanskrit: 'Supta Matsyendrasana', duration: 45, image: '/yoga-pose-4.jpg', description: 'Twist gently, releasing tension in the spine.' },
    ],
  },
  {
    id: '4',
    title: 'Sleep Prep',
    duration: 20,
    difficulty: 'Beginner',
    category: 'Sleep Prep',
    image: '/yoga-pose-5.jpg',
    poses: [
      { name: 'Cat-Cow', sanskrit: 'Marjaryasana-Bitilasana', duration: 60, image: '/yoga-pose-3.jpg', description: 'Flow between arching and rounding your spine.' },
      { name: 'Puppy Pose', sanskrit: 'Uttana Shishosana', duration: 60, image: '/yoga-pose-4.jpg', description: 'Melt your chest toward the mat, deep shoulder stretch.' },
      { name: 'Reclined Butterfly', sanskrit: 'Supta Baddha Konasana', duration: 90, image: '/yoga-pose-5.jpg', description: 'Fully supported relaxation pose. Breathe deeply.' },
    ],
  },
];

type Phase = 'select' | 'playing' | 'completed';

/* ── component ─────────────────────────────────────────────── */

export default function Yoga() {
  const [phase, setPhase] = useState<Phase>('select');
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const startSession = (session: Session) => {
    setActiveSession(session);
    setCurrentPoseIdx(0);
    setTimeLeft(session.poses[0].duration);
    setPhase('playing');
    setIsPaused(false);
  };

  const currentPose = activeSession?.poses[currentPoseIdx];
  const nextPose = activeSession?.poses[currentPoseIdx + 1];

  return (
    <div className="w-full pb-4">
      <AnimatePresence mode="wait">
        {/* ── Session Selection ── */}
        {phase === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="px-4 pt-4 pb-2">
              <h1 className="font-display text-2xl font-bold text-textPrimary">Yoga</h1>
              <p className="text-sm text-textSecondary">Find your flow</p>
            </div>
            <SessionSelector
              sessions={SESSIONS}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectSession={startSession}
            />
          </motion.div>
        )}

        {/* ── Playing ── */}
        {phase === 'playing' && activeSession && currentPose && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div>
                <p className="text-xs text-textMuted">{activeSession.title}</p>
                <p className="text-xs text-gold">Pose {currentPoseIdx + 1} of {activeSession.poses.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart
                    size={22}
                    className={isFavorited ? 'text-danger fill-danger' : 'text-textMuted'}
                  />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPaused(true)}
                  className="w-10 h-10 rounded-full bg-midnight flex items-center justify-center"
                >
                  <Pause size={18} className="text-textPrimary" />
                </motion.button>
              </div>
            </div>

            {/* Pose Display */}
            <div className="px-4 py-2">
              <PoseDisplay
                image={currentPose.image}
                name={currentPose.name}
                sanskrit={currentPose.sanskrit}
                description={currentPose.description}
                nextPoseName={nextPose?.name}
              />
            </div>

            {/* Timer */}
            <div className="py-4">
              <CountdownTimer seconds={timeLeft} isActive={!isPaused} />
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-2">
              <PoseProgressBar
                current={currentPoseIdx}
                total={activeSession.poses.length}
                poseNames={activeSession.poses.map((p) => p.name)}
              />
            </div>

            {/* Pause overlay */}
            <AnimatePresence>
              {isPaused && (
                <PauseOverlay
                  onResume={() => setIsPaused(false)}
                  onRestart={() => {
                    setCurrentPoseIdx(0);
                    setTimeLeft(activeSession.poses[0].duration);
                    setIsPaused(false);
                  }}
                  onEnd={() => {
                    setPhase('select');
                    setIsPaused(false);
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Completed ── */}
        {phase === 'completed' && activeSession && (
          <CompletionScreen
            key="completed"
            sessionName={activeSession.title}
            duration={activeSession.duration}
            xpEarned={activeSession.duration * 2}
            onShare={() => {}}
            onRestart={() => startSession(activeSession)}
            onHome={() => setPhase('select')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
