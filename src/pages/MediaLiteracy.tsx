import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  MousePointerClick,
  Brain,
  Handshake,
  Check,
  Lock,
  Trophy,
  ChevronRight,
  ArrowLeft,
  X,
  BookOpen,
  Award,
} from 'lucide-react'

/* ── types ─────────────────────────────────────────── */

interface Lesson {
  id: number
  title: string
  duration: string
  completed: boolean
}

interface Module {
  id: number
  title: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ReactNode
  lessons: Lesson[]
  status: 'completed' | 'in-progress' | 'not-started'
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

/* ── easing ────────────────────────────────────────── */
const springBounce = [0.34, 1.56, 0.64, 1] as [number, number, number, number]
const easeStandard = [0.4, 0, 0.2, 1] as [number, number, number, number]

/* ── data ──────────────────────────────────────────── */

const MODULES: Module[] = [
  {
    id: 1,
    title: 'Question What You See',
    description: 'Learn to spot fake news, edited photos, and manipulative algorithms.',
    color: '#3B82F6',
    bgColor: 'rgba(59,130,246,0.08)',
    borderColor: '#3B82F6',
    icon: <Eye size={32} className="text-[#3B82F6]" />,
    status: 'in-progress',
    lessons: [
      { id: 1, title: 'The Filter Bubble', duration: '5 min', completed: true },
      { id: 2, title: 'Spotting Fake News', duration: '7 min', completed: true },
      { id: 3, title: 'The Truth About Photo Editing', duration: '5 min', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Think Before You Click',
    description: 'Understand how your data is tracked, sold, and used to manipulate you.',
    color: '#14B8A6',
    bgColor: 'rgba(20,184,166,0.08)',
    borderColor: '#14B8A6',
    icon: <MousePointerClick size={32} className="text-[#14B8A6]" />,
    status: 'in-progress',
    lessons: [
      { id: 1, title: 'Your Data is the Product', duration: '6 min', completed: true },
      { id: 2, title: 'Dark Patterns', duration: '5 min', completed: false },
      { id: 3, title: 'Digital Footprints', duration: '4 min', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Be Aware, Not Just Online',
    description: 'The psychology of doomscrolling, FOMO, and why your brain craves the feed.',
    color: '#A855F7',
    bgColor: 'rgba(168,85,247,0.08)',
    borderColor: '#A855F7',
    icon: <Brain size={32} className="text-[#A855F7]" />,
    status: 'not-started',
    lessons: [
      { id: 1, title: 'The Dopamine Loop', duration: '6 min', completed: false },
      { id: 2, title: 'FOMO vs JOMO', duration: '5 min', completed: false },
      { id: 3, title: 'Mindful Scrolling', duration: '5 min', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Be The Change',
    description: 'Use social media for good. Build community, share truth, lift others up.',
    color: '#F5A623',
    bgColor: 'rgba(245,166,35,0.08)',
    borderColor: '#F5A623',
    icon: <Handshake size={32} className="text-[#F5A623]" />,
    status: 'not-started',
    lessons: [
      { id: 1, title: 'Digital Activism', duration: '6 min', completed: false },
      { id: 2, title: 'Building Healthy Communities', duration: '5 min', completed: false },
      { id: 3, title: 'The Digital Detox Lifestyle', duration: '5 min', completed: false },
    ],
  },
]

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Algorithms show you content that:',
    options: [
      'Is objectively true',
      'Keeps you engaged longest',
      'Is from verified sources',
      'Is educational',
    ],
    correctIndex: 1,
    explanation:
      'Social media algorithms are designed to maximize engagement, not to show you the most accurate or helpful content.',
  },
  {
    id: 2,
    question: "A 'dark pattern' is:",
    options: [
      'A design trend',
      'A trick to make you do something you did not intend',
      'A color scheme',
      'A type of photo filter',
    ],
    correctIndex: 1,
    explanation:
      'Dark patterns are deceptive UI designs that trick users into taking actions they did not mean to take, like subscribing or sharing data.',
  },
  {
    id: 3,
    question: 'FOMO stands for:',
    options: [
      'Fear of Missing Out',
      'Friends Online Mostly Offline',
      'Free Open Media Option',
      'Focus On Mindful Objectives',
    ],
    correctIndex: 0,
    explanation:
      'FOMO — Fear of Missing Out — is the anxiety that others are having rewarding experiences without you, often amplified by social media.',
  },
  {
    id: 4,
    question: 'Your personal data is primarily used to:',
    options: [
      'Improve your experience',
      'Target you with ads',
      'Protect your privacy',
      'Share with friends',
    ],
    correctIndex: 1,
    explanation:
      'While companies claim data improves your experience, the primary use is building detailed profiles to target you with personalized advertisements.',
  },
  {
    id: 5,
    question: 'The best response to online misinformation is:',
    options: [
      'Ignore it',
      'Share it to warn others',
      'Verify before sharing',
      'Argue in the comments',
    ],
    correctIndex: 2,
    explanation:
      'Verifying information before sharing — using the SIFT method (Stop, Investigate, Find, Trace) — is the most effective way to combat misinformation.',
  },
]

function getProgressSummary(modules: Module[]) {
  const totalModules = modules.length
  const startedModules = modules.filter(
    (m) => m.status === 'in-progress' || m.status === 'completed'
  ).length
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  )
  return { totalModules, startedModules, totalLessons, completedLessons }
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: easeStandard },
  }),
}

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeStandard } },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -15 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: easeStandard },
  }),
}

type PageView = 'modules' | 'module-detail' | 'quiz' | 'quiz-results'

export default function MediaLiteracy() {
  const [modules, setModules] = useState<Module[]>(MODULES)
  const [view, setView] = useState<PageView>('modules')
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [badgeUnlocked, setBadgeUnlocked] = useState(false)

  const activeModule = modules.find((m) => m.id === activeModuleId)
  const { totalModules, startedModules, totalLessons, completedLessons } =
    getProgressSummary(modules)

  const isQuizReady = activeModule?.lessons.every((l) => l.completed) ?? false

  const handleModuleTap = useCallback((moduleId: number) => {
    setActiveModuleId(moduleId)
    setView('module-detail')
  }, [])

  const handleBack = useCallback(() => {
    if (view === 'quiz' || view === 'module-detail') {
      setView('modules')
      setActiveModuleId(null)
      setCurrentQIndex(0)
      setSelectedOption(null)
      setAnswers([])
      setShowFeedback(false)
      setBadgeUnlocked(false)
    } else if (view === 'quiz-results') {
      setView('modules')
      setCurrentQIndex(0)
      setSelectedOption(null)
      setAnswers([])
      setShowFeedback(false)
      setBadgeUnlocked(false)
    }
  }, [view])

  const handleStartQuiz = useCallback(() => {
    setView('quiz')
    setCurrentQIndex(0)
    setSelectedOption(null)
    setAnswers([])
    setShowFeedback(false)
    setScore(0)
  }, [])

  const handleSelectAnswer = useCallback(
    (optionIndex: number) => {
      if (showFeedback) return
      setSelectedOption(optionIndex)
      setShowFeedback(true)
      setAnswers((prev) => [...prev, optionIndex])
      if (optionIndex === QUIZ_QUESTIONS[currentQIndex].correctIndex) {
        setScore((prev) => prev + 1)
      }
    },
    [showFeedback, currentQIndex]
  )

  const handleNext = useCallback(() => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      setView('quiz-results')
      const finalScore = score + (selectedOption === QUIZ_QUESTIONS[currentQIndex].correctIndex ? 1 : 0)
      if (finalScore >= 4) {
        setBadgeUnlocked(true)
      }
    }
  }, [currentQIndex, score, selectedOption])

  const handleRetake = useCallback(() => {
    setCurrentQIndex(0)
    setSelectedOption(null)
    setAnswers([])
    setShowFeedback(false)
    setScore(0)
    setBadgeUnlocked(false)
    setView('quiz')
  }, [])

  const handleCompleteLesson = useCallback(
    (moduleId: number, lessonId: number) => {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id !== moduleId) return m
          const updatedLessons = m.lessons.map((l) =>
            l.id === lessonId ? { ...l, completed: true } : l
          )
          const allDone = updatedLessons.every((l) => l.completed)
          return {
            ...m,
            lessons: updatedLessons,
            status: allDone ? ('completed' as const) : m.status,
          }
        })
      )
    },
    []
  )

  const quizAvg = 85

  /* ── MODULES LIST VIEW ── */
  if (view === 'modules') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: easeStandard }}
        className="w-full pb-6"
      >
        <section
          className="px-5 py-6"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, #1A2B47 0%, #0A1628 70%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-4"
          >
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0 border border-gold/20">
              <img
                src="/yogbot-mascot.png"
                alt="Yog-Bot"
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
            <div>
              <h1 className="font-display text-[28px] font-bold text-textPrimary leading-tight">
                Control the Media, or It Will Control You.
              </h1>
              <p className="text-textSecondary text-sm mt-1">
                4 modules. 12 lessons. The skills school forgot to teach you.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="px-4 py-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: easeStandard }}
            className="flex items-center gap-3"
          >
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-navy overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedLessons / totalLessons) * 100}%`,
                  }}
                  transition={{ delay: 0.3, duration: 0.8, ease: easeStandard }}
                  className="h-full rounded-full gradient-gold"
                />
              </div>
              <p className="text-textMuted text-xs mt-1.5">
                {startedModules} of {totalModules} modules started ·{' '}
                {completedLessons} of {totalLessons} lessons complete
              </p>
            </div>
            <div className="flex items-center gap-1 text-gold text-xs font-medium flex-shrink-0">
              <Trophy size={14} />
              <span>+320 XP earned</span>
            </div>
          </motion.div>
        </section>

        <section className="px-4 py-2">
          <div className="grid grid-cols-1 gap-3">
            {modules.map((mod, i) => {
              const completedCount = mod.lessons.filter((l) => l.completed).length
              const progressPct = (completedCount / mod.lessons.length) * 100

              return (
                <motion.button
                  key={mod.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleModuleTap(mod.id)}
                  className="w-full text-left rounded-2xl p-4 border border-white/[0.06] shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: mod.bgColor,
                    borderLeftWidth: '4px',
                    borderLeftColor: mod.borderColor,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{mod.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display text-lg font-bold text-textPrimary">
                          {mod.title}
                        </h3>
                        {mod.status === 'completed' && (
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                            <Check size={14} className="text-success" />
                          </div>
                        )}
                      </div>
                      <p className="text-textSecondary text-sm mb-2 line-clamp-2">
                        {mod.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1 rounded-full bg-navy overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{
                              delay: 0.4 + i * 0.1,
                              duration: 0.6,
                              ease: easeStandard,
                            }}
                            className="h-full rounded-full"
                            style={{ background: mod.color }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-textMuted text-xs">
                          {completedCount} of {mod.lessons.length} lessons
                        </span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background:
                              mod.status === 'completed'
                                ? 'rgba(34,197,94,0.15)'
                                : mod.status === 'in-progress'
                                  ? `${mod.color}25`
                                  : '#1A2B47',
                            color:
                              mod.status === 'completed'
                                ? '#22C55E'
                                : mod.status === 'in-progress'
                                  ? mod.color
                                  : '#64748B',
                          }}
                        >
                          {mod.status === 'completed'
                            ? 'Completed ✓'
                            : mod.status === 'in-progress'
                              ? 'In Progress'
                              : 'Not Started'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>

        <section className="px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: easeStandard }}
            className="rounded-2xl gradient-card border border-white/[0.06] p-5 shadow-card"
          >
            <h3 className="font-display text-lg font-bold text-textPrimary mb-4">
              Your Progress
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-textMuted text-xs mb-1">Modules</p>
                <p className="font-display text-2xl font-bold text-textPrimary">
                  {startedModules}/{totalModules}
                </p>
              </div>
              <div className="text-center">
                <p className="text-textMuted text-xs mb-1">Lessons</p>
                <p className="font-display text-2xl font-bold text-textPrimary">
                  {completedLessons}/{totalLessons}
                </p>
              </div>
              <div className="text-center">
                <p className="text-textMuted text-xs mb-1">Quiz Avg</p>
                <p className="font-display text-2xl font-bold text-gold">
                  {quizAvg}%
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    )
  }

  /* ── MODULE DETAIL VIEW ── */
  if (view === 'module-detail' && activeModule) {
    return (
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, x: -40 }}
        className="w-full min-h-[100dvh] pb-6"
      >
        <div
          className="h-[160px] relative flex items-end p-5"
          style={{
            background: `linear-gradient(135deg, ${activeModule.color}, ${activeModule.color}80)`,
          }}
        >
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="mb-2">{activeModule.icon}</div>
            <h2 className="font-display text-[28px] font-bold text-white leading-tight">
              {activeModule.title}
            </h2>
            <p className="text-white/80 text-sm">{activeModule.description}</p>
          </div>
        </div>

        <div className="px-4 py-4">
          <h3 className="font-display text-lg font-bold text-textPrimary mb-3">
            Lessons
          </h3>
          <div className="space-y-0">
            {activeModule.lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                custom={i}
                variants={slideInLeft}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 h-[72px] border-b border-white/[0.05] cursor-pointer hover:bg-white/[0.02] transition-colors -mx-4 px-4"
                onClick={() =>
                  !lesson.completed &&
                  handleCompleteLesson(activeModule.id, lesson.id)
                }
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    lesson.completed
                      ? 'text-white'
                      : 'border border-white/20 text-textMuted'
                  }`}
                  style={{
                    background: lesson.completed ? activeModule.color : 'transparent',
                  }}
                >
                  {lesson.completed ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span className="text-xs font-medium">{lesson.id}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-textPrimary text-sm font-medium truncate">
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-1 text-textMuted text-xs">
                    <BookOpen size={12} />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
                {lesson.completed ? (
                  <Check size={18} style={{ color: activeModule.color }} />
                ) : (
                  <ChevronRight size={18} className="text-textMuted" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: easeStandard }}
            className="mt-6 rounded-2xl gradient-card border border-gold/30 p-5 shadow-card relative overflow-hidden"
          >
            {!isQuizReady && (
              <div className="absolute inset-0 bg-midnight/50 flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center">
                  <Lock size={32} className="text-textMuted mx-auto mb-2" />
                  <p className="text-textSecondary text-sm">
                    Complete all lessons to unlock
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Trophy size={24} className="text-gold" />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-lg font-bold text-textPrimary mb-0.5">
                  Module Quiz
                </h4>
                <p className="text-textSecondary text-sm mb-3">
                  5 questions · Test your knowledge
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartQuiz}
                  disabled={!isQuizReady}
                  className={`h-10 px-5 rounded-xl text-sm font-bold transition-all ${
                    isQuizReady
                      ? 'gradient-gold text-deepSpace shadow-gold-glow hover:brightness-110'
                      : 'bg-navy text-textMuted cursor-not-allowed'
                  }`}
                >
                  Take Quiz
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  /* ── QUIZ VIEW ── */
  if (view === 'quiz') {
    const currentQ = QUIZ_QUESTIONS[currentQIndex]
    const isCorrect = selectedOption === currentQ.correctIndex

    return (
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
        className="w-full min-h-[100dvh] flex flex-col"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 h-12 bg-deepSpace/90 backdrop-blur-sm border-b border-white/[0.05]">
          <span className="text-textSecondary text-sm">
            Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <div className="flex items-center gap-1.5">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < answers.length ? 'bg-gold' : 'bg-navy'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleBack}
            className="text-textMuted hover:text-textPrimary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: easeStandard }}
            >
              <div className="rounded-2xl gradient-card border border-white/[0.06] p-6 shadow-card mb-6">
                <p className="text-textPrimary text-base font-medium leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              <div className="space-y-2.5">
                {currentQ.options.map((option, i) => {
                  const letter = String.fromCharCode(65 + i)
                  let optionStyle =
                    'bg-navy border-white/[0.08] text-textPrimary hover:border-gold/50'

                  if (showFeedback) {
                    if (i === currentQ.correctIndex) {
                      optionStyle = 'bg-success/10 border-success text-success'
                    } else if (i === selectedOption && !isCorrect) {
                      optionStyle = 'bg-danger/10 border-danger text-danger'
                    } else {
                      optionStyle = 'bg-navy/50 border-white/[0.04] text-textMuted'
                    }
                  } else if (i === selectedOption) {
                    optionStyle = 'bg-gold/10 border-gold text-textPrimary'
                  }

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3, ease: easeStandard }}
                      onClick={() => handleSelectAnswer(i)}
                      disabled={showFeedback}
                      className={`w-full h-[52px] rounded-xl border-[1.5px] px-4 flex items-center gap-3 transition-all text-left ${optionStyle}`}
                    >
                      <span className="text-sm font-medium min-w-[24px] text-textMuted">
                        {letter})
                      </span>
                      <span className="text-sm flex-1">{option}</span>
                      {showFeedback && i === currentQ.correctIndex && <Check size={18} />}
                      {showFeedback && i === selectedOption && !isCorrect && <X size={18} />}
                    </motion.button>
                  )
                })}
              </div>

              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: easeStandard }}
                    className={`mt-3 p-3 rounded-xl text-sm leading-relaxed ${
                      isCorrect
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-danger/10 text-danger border border-danger/20'
                    }`}
                  >
                    <p className="font-semibold mb-0.5">
                      {isCorrect ? 'Correct! 🎉' : 'Not quite. 💡'}
                    </p>
                    <p className="text-xs opacity-90">{currentQ.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 p-4 bg-deepSpace/90 backdrop-blur-sm border-t border-white/[0.05]">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: showFeedback ? 1 : 0.3 }}
            whileTap={showFeedback ? { scale: 0.97 } : {}}
            onClick={handleNext}
            disabled={!showFeedback}
            className={`w-full h-12 rounded-2xl font-bold text-sm transition-all ${
              showFeedback
                ? 'gradient-gold text-deepSpace shadow-gold-glow hover:brightness-110'
                : 'bg-navy text-textMuted cursor-not-allowed'
            }`}
          >
            {currentQIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  /* ── QUIZ RESULTS VIEW ── */
  if (view === 'quiz-results') {
    const finalScore = score
    const totalQs = QUIZ_QUESTIONS.length
    let message = ''
    if (finalScore === 5) message = "Perfect! You're a Media Master! 🏆"
    else if (finalScore >= 4) message = 'Great job! Almost there! 🔥'
    else if (finalScore >= 3) message = 'Good effort! Review the lessons and try again. 💪'
    else message = 'Keep learning! The modules have all the answers. 📚'

    const scoreColor =
      finalScore >= 4 ? 'text-success' : finalScore >= 3 ? 'text-warning' : 'text-danger'

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full min-h-[100dvh] flex flex-col items-center justify-center px-6 py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center mb-6 ${
            finalScore >= 4 ? 'border-success' : 'border-warning'
          }`}
        >
          <span className={`font-display text-4xl font-bold ${scoreColor}`}>
            {finalScore}/{totalQs}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-textPrimary text-lg font-semibold text-center mb-2"
        >
          {message}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-gold font-semibold mb-8"
        >
          +80 XP earned!
        </motion.p>

        <AnimatePresence>
          {badgeUnlocked && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: 0 }}
              animate={{ scale: 1, opacity: 1, rotateY: 360 }}
              transition={{ delay: 0.6, duration: 0.8, ease: springBounce }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold to-goldLight flex items-center justify-center mb-6"
              style={{ boxShadow: '0 0 30px rgba(245,166,35,0.3)' }}
            >
              <Award size={40} className="text-deepSpace" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {badgeUnlocked && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="text-gold font-display text-xl font-bold text-center mb-8"
            >
              Media Wise Badge Unlocked! 🏅
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="flex flex-col gap-3 w-full max-w-[280px]"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRetake}
            className="w-full h-12 rounded-2xl gradient-gold text-deepSpace font-bold text-sm shadow-gold-glow hover:brightness-110 transition-all"
          >
            Retake Quiz
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            className="w-full h-12 rounded-2xl border-[1.5px] border-gold/50 text-gold font-semibold text-sm hover:bg-gold/10 transition-all"
          >
            Back to Modules
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return null
}
