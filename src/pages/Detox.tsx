import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import {
  Lock,
  Unlock,
  Plus,
  Home,
  Share2,
  Trophy,
  Flame,
  BookOpen,
  TreePine,
  MessageCircle,
  Pencil,
  Music,
  Sparkles,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Mode = 'config' | 'lock' | 'active' | 'complete'

interface Tip {
  icon: React.ReactNode
  title: string
  body: string
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const DURATION_PRESETS = [
  { minutes: 15, label: 'Quick Reset' },
  { minutes: 30, label: 'Deep Focus' },
  { minutes: 60, label: 'Full Reboot' },
]

const TIPS: Tip[] = [
  { icon: <BookOpen size={28} className="text-gold" />, title: 'Read a book', body: 'Pick up that book you\'ve been meaning to read.' },
  { icon: <TreePine size={28} className="text-calm" />, title: 'Go outside', body: 'Touch grass. Literally. It helps.' },
  { icon: <MessageCircle size={28} className="text-info" />, title: 'Talk to someone', body: 'Have a real conversation. No screens allowed.' },
  { icon: <Pencil size={28} className="text-purple" />, title: 'Draw or journal', body: 'Express yourself on paper, not on a screen.' },
  { icon: <Sparkles size={28} className="text-goldLight" />, title: 'Meditate', body: 'Sit still. Breathe. Just be.' },
]

const ACTIVITIES = [
  { icon: <BookOpen size={14} />, label: 'Reading' },
  { icon: <TreePine size={14} />, label: 'Walking' },
  { icon: <Sparkles size={14} />, label: 'Meditating' },
  { icon: <Pencil size={14} />, label: 'Journaling' },
  { icon: <Music size={14} />, label: 'Music' },
]

const EASE_SMOOTH = [0.4, 0, 0.2, 1] as [number, number, number, number]
const EASE_SPRING = { type: 'spring' as const, stiffness: 400, damping: 25 }

/* ------------------------------------------------------------------ */
/*  Helper: format MM:SS                                               */
/* ------------------------------------------------------------------ */
function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Config Mode                                         */
/* ------------------------------------------------------------------ */
function ConfigMode({
  selectedMinutes,
  customMinutes,
  onSelectPreset,
  onCustomChange,
  onStart,
}: {
  selectedMinutes: number
  customMinutes: number
  onSelectPreset: (m: number) => void
  onCustomChange: (m: number) => void
  onStart: () => void
}) {
  return (
    <motion.div
      key="config"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE_SMOOTH }}
      className="flex flex-col gap-5 pb-6"
    >
      {/* Hero Image */}
      <div className="relative w-full h-[200px] -mt-0 overflow-hidden" style={{ borderRadius: '0 0 24px 24px' }}>
        <motion.img
          src="/nature-escape.jpg"
          alt="Nature escape"
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 10, ease: 'linear' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, rgba(10,22,40,0.4) 50%, transparent 100%)' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE_SMOOTH }}
        >
          <h2 className="font-display text-[28px] font-bold text-textPrimary leading-tight">
            Time to disconnect.
            <br />
            <span className="text-gold">Your mind will thank you.</span>
          </h2>
        </motion.div>
      </div>

      {/* Duration Selector */}
      <div className="px-4 flex flex-col gap-4">
        <motion.h3
          className="font-display text-[22px] font-bold text-textPrimary text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          How long can you disconnect?
        </motion.h3>

        <div className="flex gap-3 justify-center">
          {DURATION_PRESETS.map((preset, i) => {
            const isSelected = selectedMinutes === preset.minutes && customMinutes === preset.minutes
            return (
              <motion.button
                key={preset.minutes}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.3, ease: EASE_SMOOTH }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectPreset(preset.minutes)}
                className="flex flex-col items-center justify-center gap-1 h-[80px] flex-1 rounded-2xl border-2 transition-colors duration-200"
                style={{
                  background: isSelected ? 'rgba(245,166,35,0.08)' : '#111D32',
                  borderColor: isSelected ? '#F5A623' : '#1A2B47',
                }}
              >
                <span className={`font-display text-[22px] font-bold ${isSelected ? 'text-gold' : 'text-textPrimary'}`}>
                  {preset.minutes}
                </span>
                <span className="text-textMuted text-[12px] font-medium">{preset.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Custom Slider */}
        <motion.div
          className="flex flex-col gap-2 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <p className="text-center font-display text-[18px] font-semibold text-gold">
            {customMinutes} minutes
          </p>
          <div className="relative w-full px-1">
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={customMinutes}
              onChange={(e) => onCustomChange(Number(e.target.value))}
              className="w-full h-[6px] rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #F5A623 0%, #FFD93D ${((customMinutes - 5) / (120 - 5)) * 100}%, #1A2B47 ${((customMinutes - 5) / (120 - 5)) * 100}%, #1A2B47 100%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-textMuted px-1">
            <span>5m</span>
            <span>120m</span>
          </div>
        </motion.div>

        {/* Rewards Preview */}
        <motion.div
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{
            background: 'linear-gradient(180deg, #111D32 0%, #0D1A2D 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: EASE_SMOOTH }}
        >
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-gold" />
            <span className="text-gold font-display text-[18px] font-semibold">+50 XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-danger" />
            <span className="text-textSecondary text-[14px]">Streak: 7 days → 8 days</span>
          </div>
          {selectedMinutes >= 30 && (
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-purple" />
              <span className="text-purple text-[14px]">30-min bonus: 2x XP</span>
            </div>
          )}
        </motion.div>

        {/* Tips Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <p className="text-textSecondary text-[14px] mb-3 font-medium">What to do during your detox:</p>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2">
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.1, duration: 0.4, ease: EASE_SMOOTH }}
                className="flex-shrink-0 w-[200px] snap-start rounded-xl p-4 flex flex-col gap-2"
                style={{ background: '#111D32', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {tip.icon}
                <span className="text-textPrimary text-[14px] font-semibold">{tip.title}</span>
                <span className="text-textSecondary text-[12px] leading-relaxed">{tip.body}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full h-[56px] rounded-[14px] flex items-center justify-center gap-2 font-bold text-[16px] text-deepSpace gradient-gold shadow-gold-button mt-2"
        >
          <Lock size={20} />
          Lock In My Detox
        </motion.button>
        <p className="text-center text-textMuted text-[12px]">
          {selectedMinutes} minutes · No turning back (kind of)
        </p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Lock Mode                                           */
/* ------------------------------------------------------------------ */
function LockMode({ minutes, onConfirm }: { minutes: number; onConfirm: () => void }) {
  const [progress, setProgress] = useState(0)
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTime = useRef<number>(0)

  const startHold = useCallback(() => {
    startTime.current = Date.now()
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current
      const pct = Math.min(elapsed / 3000, 1)
      setProgress(pct)
      if (pct >= 1) {
        if (holdTimer.current) clearInterval(holdTimer.current)
        onConfirm()
      }
    }, 30)
  }, [onConfirm])

  const endHold = useCallback(() => {
    setProgress(0)
    if (holdTimer.current) {
      clearInterval(holdTimer.current)
      holdTimer.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearInterval(holdTimer.current)
    }
  }, [])

  return (
    <motion.div
      key="lock"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-6 gap-8"
    >
      {/* Yog-Bot Mascot */}
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: EASE_SMOOTH }}
      >
        <motion.img
          src="/yogbot-mascot.png"
          alt="Yog-Bot"
          className="w-[100px] h-[100px] object-contain"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <div
          className="max-w-[280px] rounded-2xl p-4 text-center"
          style={{
            background: '#1A2B47',
            borderRadius: '16px 16px 16px 4px',
          }}
        >
          <p className="text-textPrimary text-[14px] leading-relaxed">
            Ready to lock in {minutes} minutes of freedom? Your phone will wait. You deserve this break.
          </p>
        </div>
      </motion.div>

      {/* Hold-to-Lock Button */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, ...EASE_SPRING }}
      >
        {/* Pulsing ring */}
        <motion.div
          className="absolute w-[120px] h-[120px] rounded-full"
          style={{ background: 'rgba(245,166,35,0.15)' }}
          animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
        />

        {/* Circular progress ring */}
        <svg className="absolute w-[120px] h-[120px] -rotate-90 pointer-events-none" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#1A2B47"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#F5A623"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54 * (1 - progress)}
            className="transition-none"
          />
        </svg>

        {/* Lock button */}
        <motion.button
          className="w-[80px] h-[80px] rounded-full gradient-gold flex items-center justify-center shadow-gold-glow select-none"
          style={{ boxShadow: '0 0 40px rgba(245,166,35,0.3)' }}
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          whileTap={{ scale: 0.95 }}
        >
          <Lock size={32} className="text-deepSpace" />
        </motion.button>
      </motion.div>

      <motion.p
        className="text-textMuted text-[12px] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Hold the lock for 3 seconds to commit
      </motion.p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Active Timer Mode                                   */
/* ------------------------------------------------------------------ */
function ActiveTimerMode({
  totalSeconds,
  remainingSeconds,
  startTime,
  onExtend,
  onEmergencyEnd,
}: {
  totalSeconds: number
  remainingSeconds: number
  startTime: string
  onExtend: () => void
  onEmergencyEnd: () => void
}) {
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0
  const isUrgent = remainingSeconds <= 60
  const isCritical = remainingSeconds <= 10
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  /* Emergency unlock hold */
  const [emergencyHolding, setEmergencyHolding] = useState(false)
  const [emergencyProgress, setEmergencyProgress] = useState(0)
  const emergencyTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const emergencyStart = useRef<number>(0)

  const startEmergency = useCallback(() => {
    setEmergencyHolding(true)
    emergencyStart.current = Date.now()
    emergencyTimer.current = setInterval(() => {
      const elapsed = Date.now() - emergencyStart.current
      const pct = Math.min(elapsed / 3000, 1)
      setEmergencyProgress(pct)
      if (pct >= 1) {
        if (emergencyTimer.current) clearInterval(emergencyTimer.current)
        onEmergencyEnd()
      }
    }, 30)
  }, [onEmergencyEnd])

  const endEmergency = useCallback(() => {
    setEmergencyHolding(false)
    setEmergencyProgress(0)
    if (emergencyTimer.current) {
      clearInterval(emergencyTimer.current)
      emergencyTimer.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (emergencyTimer.current) clearInterval(emergencyTimer.current)
    }
  }, [])

  /* Rotating activity suggestion */
  const [activeActivity, setActiveActivity] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveActivity((prev) => (prev + 1) % ACTIVITIES.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      key="active"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center min-h-[70vh] px-5 pt-4 pb-6 gap-5"
    >
      {/* Top row */}
      <div className="w-full flex items-center justify-between">
        <button className="text-danger text-[12px] font-medium">Quit</button>
        <button
          onClick={onExtend}
          className="flex items-center gap-1 text-gold text-[12px] font-medium"
        >
          <Plus size={14} /> +15 min
        </button>
      </div>

      {/* Timer Ring */}
      <div className="relative flex items-center justify-center mt-4">
        <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="rgba(245,166,35,0.2)"
            strokeWidth="4"
          />
          {/* Progress */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={isCritical ? '#EF4444' : isUrgent ? '#F5A623' : '#F5A623'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Center text */}
        <motion.div
          className="absolute flex flex-col items-center"
          animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
          transition={isCritical ? { repeat: Infinity, duration: 0.5 } : {}}
        >
          <span
            className="font-mono text-[64px] font-medium leading-none"
            style={{
              color: isCritical ? '#EF4444' : isUrgent ? '#F5A623' : '#F0F2F5',
              letterSpacing: '-2px',
            }}
          >
            {formatTime(remainingSeconds)}
          </span>
        </motion.div>
      </div>

      {/* Status */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-textSecondary text-[18px] font-semibold">Digital Detox in Progress</p>
        <div className="flex items-center gap-1 text-textMuted text-[12px]">
          <Lock size={12} />
          <span>Locked since {startTime}</span>
        </div>
      </div>

      {/* Activity Suggestions */}
      <div className="w-full">
        <p className="text-textMuted text-[12px] mb-2 text-center">What you could be doing right now:</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {ACTIVITIES.map((act, i) => (
            <motion.div
              key={act.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-center gap-1 px-3 h-[32px] rounded-full text-[12px] font-medium"
              style={{
                background: '#1A2B47',
                color: activeActivity === i ? '#F5A623' : '#94A3B8',
                border: activeActivity === i ? '1px solid #F5A623' : '1px solid transparent',
              }}
            >
              {act.icon}
              {act.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency Unlock */}
      <div className="w-full mt-auto pt-4">
        <button
          onPointerDown={startEmergency}
          onPointerUp={endEmergency}
          onPointerLeave={endEmergency}
          className="relative w-full h-[48px] rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          {/* Progress fill */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-danger/20"
            style={{ width: `${emergencyProgress * 100}%` }}
          />
          <div className="relative flex items-center gap-2 z-10">
            <Unlock size={16} className="text-danger" />
            <span className="text-danger text-[14px] font-medium">
              {emergencyHolding ? 'Keep holding...' : 'Emergency Unlock — Hold 3 seconds'}
            </span>
          </div>
        </button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Completion Mode                                     */
/* ------------------------------------------------------------------ */
function CompletionMode({
  minutes,
  streak,
  onDetoxAgain,
}: {
  minutes: number
  streak: number
  onDetoxAgain: () => void
}) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center min-h-[70vh] px-5 pt-6 pb-6 gap-6 relative"
    >
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          numberOfPieces={50}
          colors={['#F5A623', '#FFD93D', '#14B8A6', '#FFFFFF']}
          gravity={0.25}
          recycle={false}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 60,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Screen flash */}
      <motion.div
        className="fixed inset-0 bg-white pointer-events-none z-50"
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Yog-Bot Celebrating */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <motion.img
          src="/yogbot-celebrating.png"
          alt="Yog-Bot celebrating"
          className="w-[120px] h-[120px] object-contain"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
        <div
          className="max-w-[300px] rounded-2xl p-4 text-center"
          style={{ background: '#1A2B47', borderRadius: '16px 16px 16px 4px' }}
        >
          <p className="text-textPrimary text-[14px] leading-relaxed">
            You did it! {minutes} minutes of pure, screen-free freedom. That&apos;s genuinely impressive.
          </p>
        </div>
      </motion.div>

      {/* Results Card */}
      <motion.div
        className="w-full max-w-[320px] rounded-2xl p-6 flex flex-col items-center gap-4"
        style={{
          background: 'linear-gradient(180deg, #111D32 0%, #0D1A2D 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: EASE_SMOOTH }}
      >
        <h2 className="font-display text-[28px] font-bold text-textPrimary">Detox Complete!</h2>
        <p className="text-textSecondary text-[16px]">{minutes} minutes screen-free</p>

        <div className="w-full h-px bg-white/5 my-1" />

        {/* XP */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Trophy size={22} className="text-gold" />
          <span className="font-display text-[22px] font-bold text-gold">+50 XP</span>
        </motion.div>

        {/* Streak */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <Flame size={22} className="text-danger" />
          </motion.div>
          <span className="font-display text-[18px] font-semibold text-danger">
            {streak} day streak!
          </span>
        </motion.div>

        <p className="text-textSecondary text-[14px] text-center">
          You saved ~{Math.round(minutes * 0.75)} notifications from interrupting you
        </p>
      </motion.div>

      {/* Share buttons */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        <button className="h-[40px] px-4 rounded-[14px] border-[1.5px] border-gold/50 text-gold text-[13px] font-semibold flex items-center gap-1.5 hover:bg-gold/10 transition-colors">
          <Share2 size={14} /> Share
        </button>
      </motion.div>

      {/* Back to Dashboard / Detox Again */}
      <motion.div
        className="w-full flex flex-col gap-3 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDetoxAgain}
          className="w-full h-[52px] rounded-[14px] gradient-gold text-deepSpace font-bold text-[16px] flex items-center justify-center gap-2"
        >
          Detox Again
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => window.location.href = '/dashboard'}
          className="w-full h-[48px] rounded-[14px] border-[1.5px] border-gold/50 text-gold font-semibold text-[16px] flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors"
        >
          <Home size={18} /> Back to Dashboard
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Detox Component                                               */
/* ------------------------------------------------------------------ */
export default function Detox() {
  const [mode, setMode] = useState<Mode>('config')
  const [selectedMinutes, setSelectedMinutes] = useState(30)
  const [customMinutes, setCustomMinutes] = useState(30)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [startTimeLabel, setStartTimeLabel] = useState('')
  const [streak] = useState(8)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* Duration selection */
  const handlePresetSelect = (minutes: number) => {
    setSelectedMinutes(minutes)
    setCustomMinutes(minutes)
  }

  const handleCustomChange = (value: number) => {
    setCustomMinutes(value)
    setSelectedMinutes(value)
  }

  /* Start → Lock mode */
  const handleStart = () => {
    setMode('lock')
  }

  /* Lock confirm → Active mode */
  const handleLockConfirm = useCallback(() => {
    const total = selectedMinutes * 60
    setTotalSeconds(total)
    setRemainingSeconds(total)
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    setStartTimeLabel(timeStr)
    setMode('active')
  }, [selectedMinutes])

  /* Timer countdown */
  useEffect(() => {
    if (mode === 'active' && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            setMode('complete')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [mode])

  /* Extend timer */
  const handleExtend = () => {
    setRemainingSeconds((prev) => prev + 15 * 60)
    setTotalSeconds((prev) => prev + 15 * 60)
  }

  /* Emergency end */
  const handleEmergencyEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setMode('complete')
  }, [])

  /* Detox again */
  const handleDetoxAgain = () => {
    setMode('config')
    setRemainingSeconds(0)
    setTotalSeconds(0)
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {mode === 'config' && (
          <ConfigMode
            key="config"
            selectedMinutes={selectedMinutes}
            customMinutes={customMinutes}
            onSelectPreset={handlePresetSelect}
            onCustomChange={handleCustomChange}
            onStart={handleStart}
          />
        )}
        {mode === 'lock' && (
          <LockMode
            key="lock"
            minutes={selectedMinutes}
            onConfirm={handleLockConfirm}
          />
        )}
        {mode === 'active' && (
          <ActiveTimerMode
            key="active"
            totalSeconds={totalSeconds}
            remainingSeconds={remainingSeconds}
            startTime={startTimeLabel}
            onExtend={handleExtend}
            onEmergencyEnd={handleEmergencyEnd}
          />
        )}
        {mode === 'complete' && (
          <CompletionMode
            key="complete"
            minutes={selectedMinutes}
            streak={streak}
            onDetoxAgain={handleDetoxAgain}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
