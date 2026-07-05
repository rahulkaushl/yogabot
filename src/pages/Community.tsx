import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  X,
  Trophy,
  Check,
  Smartphone,
  Lock,
  Activity,
} from 'lucide-react'

/* ── types ─────────────────────────────────────────── */

interface Post {
  id: number
  alias: string
  aliasColor: string
  time: string
  content: string
  likes: number
  replies: number
  liked: boolean
  streak?: number
}

interface Challenge {
  id: number
  title: string
  participants: number
  gradient: string
  icon: React.ReactNode
  joined: boolean
}

interface Leader {
  rank: 1 | 2 | 3
  name: string
  xp: number
  avatarBg: string
  borderColor: string
}

/* ── data ──────────────────────────────────────────── */

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    alias: 'MindfulTeen_23',
    aliasColor: 'from-[#3B82F6] to-[#2563EB]',
    time: '2h ago',
    content: 'Just completed my first 30-min digital detox! I used the time to draw and I actually forgot about my phone. Small wins 🎨',
    likes: 24,
    replies: 5,
    liked: false,
  },
  {
    id: 2,
    alias: 'Anonymous_Owl',
    aliasColor: 'from-[#14B8A6] to-[#0D9488]',
    time: '4h ago',
    content: "Day 5 of my detox... my brain feels clearer. Is this what focus feels like?? I read 40 pages of a book today. 📚",
    likes: 67,
    replies: 12,
    liked: false,
  },
  {
    id: 3,
    alias: 'PageTurner_8',
    aliasColor: 'from-[#A855F7] to-[#7C3AED]',
    time: '5h ago',
    content: "Yoga before exams helped so much. My anxiety was through the roof but 10 mins of breathing exercises saved me. 🧘",
    likes: 45,
    replies: 8,
    liked: false,
  },
  {
    id: 4,
    alias: 'CompassionBot_12',
    aliasColor: 'from-[#F5A623] to-[#D97706]',
    time: '6h ago',
    content: 'To everyone struggling today: one breath at a time. You don\'t have to be perfect. You just have to show up. 💙',
    likes: 89,
    replies: 15,
    liked: false,
  },
  {
    id: 5,
    alias: 'Grindset_5',
    aliasColor: 'from-[#EF4444] to-[#DC2626]',
    time: '8h ago',
    content: 'Just hit Level 10! Yoga Apprentice → Yoga Warrior! The grind is REAL but so worth it 🏆',
    likes: 34,
    replies: 6,
    liked: false,
    streak: 13,
  },
  {
    id: 6,
    alias: 'DigitalNative_7',
    aliasColor: 'from-[#8B5CF6] to-[#6D28D9]',
    time: '12h ago',
    content: "Anyone else struggle with TikTok? I deleted it for a week and my screen time dropped by 4 hours. Still get the itch tho 😅",
    likes: 56,
    replies: 20,
    liked: false,
  },
  {
    id: 7,
    alias: 'CalmVibes_99',
    aliasColor: 'from-[#10B981] to-[#059669]',
    time: '1d ago',
    content: 'The sleep stories on this app are undefeated. Been getting 8hrs consistently for 2 weeks now. My skin is GLOWING ✨',
    likes: 42,
    replies: 9,
    liked: false,
  },
  {
    id: 8,
    alias: 'NewbieYogi_01',
    aliasColor: 'from-[#F59E0B] to-[#B45309]',
    time: '1d ago',
    content: 'First yoga session ever today. I\'m not flexible at ALL but the beginner track was so welcoming. Going again tomorrow!',
    likes: 31,
    replies: 7,
    liked: false,
  },
]

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: '7-Day Digital Detox',
    participants: 234,
    gradient: 'from-[#F5A623] to-[#FFD93D]',
    icon: <Lock size={24} className="text-white" />,
    joined: false,
  },
  {
    id: 2,
    title: 'Morning Yoga Streak',
    participants: 189,
    gradient: 'from-[#14B8A6] to-[#0D9488]',
    icon: <Activity size={24} className="text-white" />,
    joined: true,
  },
  {
    id: 3,
    title: 'Mindful Scrolling',
    participants: 156,
    gradient: 'from-[#A855F7] to-[#7C3AED]',
    icon: <Smartphone size={24} className="text-white" />,
    joined: false,
  },
]

const LEADERS: Leader[] = [
  { rank: 1, name: 'ZenMaster', xp: 4250, avatarBg: 'bg-gradient-to-br from-[#F5A623] to-[#FFD93D]', borderColor: 'border-[#FFD93D]' },
  { rank: 2, name: 'YogiBear', xp: 3890, avatarBg: 'bg-gradient-to-br from-[#94A3B8] to-[#CBD5E1]', borderColor: 'border-[#CBD5E1]' },
  { rank: 3, name: 'CalmKid', xp: 3560, avatarBg: 'bg-gradient-to-br from-[#B45309] to-[#D97706]', borderColor: 'border-[#D97706]' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const COMPLETED_DAYS = [true, true, true, false, false, false, false]

/* ── easing ────────────────────────────────────────── */
const springBounce = [0.34, 1.56, 0.64, 1] as [number, number, number, number]
const easeStandard = [0.4, 0, 0.2, 1] as [number, number, number, number]

/* ── variants ──────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: easeStandard },
  }),
}

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: easeStandard },
  }),
}

const podiumRise = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.6, ease: i === 2 ? springBounce : easeStandard },
  }),
}

/* ── component ─────────────────────────────────────── */

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES)
  const [showComposer, setShowComposer] = useState(false)
  const [composerText, setComposerText] = useState('')
  const [composerTag, setComposerTag] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'recent' | 'trending'>('recent')
  const [buddyMatched, setBuddyMatched] = useState(false)
  const [heartBurst, setHeartBurst] = useState<number | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

  const handleLike = useCallback((postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
    setHeartBurst(postId)
    setTimeout(() => setHeartBurst(null), 600)
  }, [])

  const handleJoinChallenge = useCallback((challengeId: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, joined: !c.joined } : c))
    )
  }, [])

  const handlePost = useCallback(() => {
    if (!composerText.trim()) return
    const newPost: Post = {
      id: Date.now(),
      alias: 'Anonymous_You',
      aliasColor: 'from-[#F5A623] to-[#FFD93D]',
      time: 'Just now',
      content: composerText,
      likes: 0,
      replies: 0,
      liked: false,
    }
    setPosts((prev) => [newPost, ...prev])
    setComposerText('')
    setComposerTag(null)
    setShowComposer(false)
  }, [composerText])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: easeStandard }}
      className="w-full pb-6"
    >
      {/* ═══ SECTION 1: Active Challenges Banner ═══ */}
      <section className="pt-4 pb-2">
        <div className="px-4 mb-3">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="font-display text-[22px] font-bold text-textPrimary"
          >
            Active Challenges
          </motion.h2>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 px-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2"
        >
          {challenges.map((c, i) => (
            <motion.div
              key={c.id}
              custom={i}
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className={`relative flex-shrink-0 w-[280px] h-[160px] rounded-2xl bg-gradient-to-br ${c.gradient} p-4 snap-start flex flex-col justify-between overflow-hidden`}
            >
              {/* Decorative circle */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

              <div className="flex items-start justify-between relative z-10">
                <h3 className="text-white font-semibold text-lg leading-tight max-w-[180px]">
                  {c.title}
                </h3>
                <div className="opacity-80">{c.icon}</div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users size={14} className="text-white/70" />
                  <span className="text-white/70 text-xs">
                    {c.participants} participants
                  </span>
                </div>

                {/* Avatar stack */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((a) => (
                      <div
                        key={a}
                        className="w-6 h-6 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center"
                      >
                        <span className="text-[8px] text-white font-bold">
                          {String.fromCharCode(65 + a)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleJoinChallenge(c.id)}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold backdrop-blur-sm transition-all duration-200 ${
                      c.joined
                        ? 'bg-white/10 text-white/60'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {c.joined ? (
                      <span className="flex items-center gap-1">
                        <Check size={12} /> Joined
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Join <span className="text-sm">→</span>
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 2: Leaderboard Mini ═══ */}
      <section className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: easeStandard }}
          className="rounded-2xl gradient-card border border-white/[0.06] p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-textPrimary">
              This Week&apos;s Leaders
            </h3>
            <button className="text-gold text-xs font-medium hover:underline">
              Full Leaderboard →
            </button>
          </div>

          {/* Podium */}
          <div className="flex items-end justify-center gap-4 mb-4">
            {/* #2 */}
            <motion.div
              custom={0}
              variants={podiumRise}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center pb-2"
            >
              <div
                className={`w-16 h-16 rounded-full ${LEADERS[1].avatarBg} ${LEADERS[1].borderColor} border-2 flex items-center justify-center`}
              >
                <span className="text-white font-bold text-lg">
                  {LEADERS[1].name[0]}
                </span>
              </div>
              <span className="text-textPrimary text-xs font-medium mt-2">
                {LEADERS[1].name}
              </span>
              <span className="text-gold text-xs">
                {LEADERS[1].xp.toLocaleString()} XP
              </span>
            </motion.div>

            {/* #1 — Center, largest */}
            <motion.div
              custom={2}
              variants={podiumRise}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              {/* Crown */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <Crown size={20} className="text-[#FFD93D] mb-1" />
              </motion.div>
              <div
                className={`w-20 h-20 rounded-full ${LEADERS[0].avatarBg} ${LEADERS[0].borderColor} border-[3px] flex items-center justify-center shadow-[0_0_20px_rgba(245,166,35,0.3)]`}
              >
                <span className="text-white font-bold text-xl">
                  {LEADERS[0].name[0]}
                </span>
              </div>
              <span className="text-textPrimary text-xs font-semibold mt-2">
                {LEADERS[0].name}
              </span>
              <span className="text-gold text-xs font-bold">
                {LEADERS[0].xp.toLocaleString()} XP
              </span>
            </motion.div>

            {/* #3 */}
            <motion.div
              custom={1}
              variants={podiumRise}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center pb-2"
            >
              <div
                className={`w-16 h-16 rounded-full ${LEADERS[2].avatarBg} ${LEADERS[2].borderColor} border-2 flex items-center justify-center`}
              >
                <span className="text-white font-bold text-lg">
                  {LEADERS[2].name[0]}
                </span>
              </div>
              <span className="text-textPrimary text-xs font-medium mt-2">
                {LEADERS[2].name}
              </span>
              <span className="text-gold text-xs">
                {LEADERS[2].xp.toLocaleString()} XP
              </span>
            </motion.div>
          </div>

          {/* Divider + Your Rank */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: easeStandard }}
            className="border-t border-white/5 pt-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-textSecondary text-sm">
                  Your rank:{' '}
                  <span className="text-textPrimary font-semibold">#24</span> of{' '}
                  1,847
                </p>
                <p className="text-gold text-xs mt-0.5">
                  384 XP this week
                </p>
              </div>
              <div className="w-24">
                <div className="h-1.5 rounded-full bg-navy overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '24%' }}
                    transition={{ delay: 0.8, duration: 0.6, ease: easeStandard }}
                    className="h-full rounded-full gradient-gold"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SECTION 3: Community Feed ═══ */}
      <section className="px-4 py-2">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 mb-4">
          <button
            onClick={() => setActiveTab('recent')}
            className={`relative pb-1 text-sm font-semibold transition-colors ${
              activeTab === 'recent' ? 'text-textPrimary' : 'text-textMuted'
            }`}
          >
            Recent
            {activeTab === 'recent' && (
              <motion.div
                layoutId="feed-tab"
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gold rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`relative pb-1 text-sm font-semibold transition-colors ${
              activeTab === 'trending' ? 'text-textPrimary' : 'text-textMuted'
            }`}
          >
            Trending
            {activeTab === 'trending' && (
              <motion.div
                layoutId="feed-tab"
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gold rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Posts */}
        <AnimatePresence mode="popLayout">
          {(activeTab === 'recent' ? posts : [...posts].sort((a, b) => b.likes - a.likes)).map(
            (post, i) => (
              <motion.article
                key={post.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                layout
                className="rounded-2xl gradient-card border border-white/[0.06] p-4 mb-4 shadow-card"
              >
                {/* Post header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${post.aliasColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-sm">
                      {post.alias[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-textPrimary text-sm font-semibold">
                        {post.alias}
                      </span>
                      {post.streak && (
                        <span className="text-[10px] font-semibold text-danger bg-danger/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Activity size={10} />
                          {post.streak} streak
                        </span>
                      )}
                    </div>
                    <span className="text-textMuted text-xs">{post.time}</span>
                  </div>
                </div>

                {/* Post body */}
                <p className="text-textSecondary text-sm leading-relaxed mb-3">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-5">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors relative ${
                      post.liked ? 'text-danger' : 'text-textMuted hover:text-danger'
                    }`}
                  >
                    <motion.div
                      animate={
                        heartBurst === post.id
                          ? { scale: [1, 1.4, 1] }
                          : {}
                      }
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        size={16}
                        fill={post.liked ? '#EF4444' : 'none'}
                        strokeWidth={post.liked ? 2 : 1.5}
                      />
                    </motion.div>
                    {post.likes}
                    {/* Heart burst particles */}
                    <AnimatePresence>
                      {heartBurst === post.id && (
                        <>
                          {[...Array(6)].map((_, pi) => (
                            <motion.div
                              key={pi}
                              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                              animate={{
                                opacity: 0,
                                scale: 0.6,
                                x: Math.cos((pi * Math.PI * 2) / 6) * 20,
                                y: Math.sin((pi * Math.PI * 2) / 6) * 20,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-danger"
                              style={{ marginLeft: -3, marginTop: -3 }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <button className="flex items-center gap-1.5 text-textMuted text-xs font-medium hover:text-textSecondary transition-colors">
                    <MessageCircle size={16} strokeWidth={1.5} />
                    {post.replies}
                  </button>

                  <button className="flex items-center gap-1.5 text-textMuted text-xs font-medium hover:text-textSecondary transition-colors">
                    <Share2 size={16} strokeWidth={1.5} />
                    Share
                  </button>
                </div>
              </motion.article>
            )
          )}
        </AnimatePresence>
      </section>

      {/* ═══ SECTION 4: Buddy System ═══ */}
      <section className="px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: easeStandard }}
          className="rounded-2xl gradient-card border border-white/[0.06] p-5 shadow-card"
        >
          <h3 className="font-display text-lg font-bold text-textPrimary mb-3">
            Your Accountability Buddy
          </h3>

          <AnimatePresence mode="wait">
            {buddyMatched ? (
              <motion.div
                key="matched"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div className="flex-1">
                  <p className="text-textPrimary text-sm font-semibold">
                    FocusFriend_17
                  </p>
                  <p className="text-gold text-xs mt-0.5 flex items-center gap-1">
                    <Activity size={12} /> 8 days together!
                  </p>
                  <p className="text-textSecondary text-xs mt-1">
                    Both targeting: 30-min daily yoga
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button className="h-8 px-3 rounded-xl border border-gold/50 text-gold text-xs font-semibold hover:bg-gold/10 transition-colors">
                      Send Encouragement
                    </button>
                    <button className="h-8 px-3 rounded-xl bg-navy text-textPrimary text-xs font-semibold hover:bg-navy/80 transition-colors">
                      Nudge
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="find"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="inline-flex mb-3"
                >
                  <Users size={40} className="text-textMuted" />
                </motion.div>
                <p className="text-textPrimary font-semibold mb-1">
                  Find Your Buddy
                </p>
                <p className="text-textSecondary text-sm mb-4 max-w-[280px] mx-auto">
                  Get matched with a teen on the same journey. Support each
                  other. Zero pressure.
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setBuddyMatched(true)}
                  className="h-12 px-8 rounded-2xl gradient-gold text-deepSpace font-bold text-sm hover:brightness-110 transition-all shadow-gold-glow"
                >
                  Get Matched
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ═══ SECTION 5: Weekly Challenge Detail ═══ */}
      <section className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: easeStandard }}
          className="rounded-2xl gradient-card border border-white/[0.06] shadow-card overflow-hidden"
        >
          {/* Colored top border */}
          <div className="h-1 bg-gradient-to-r from-calm to-[#0D9488]" />

          <div className="p-5">
            <h3 className="font-display text-lg font-bold text-textPrimary mb-1">
              This Week: 7-Day Yoga Streak
            </h3>
            <p className="text-textSecondary text-sm mb-3">
              Complete at least one yoga session every day for 7 days.
            </p>

            {/* Participant avatars */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3, 4].map((a) => (
                  <div
                    key={a}
                    className="w-6 h-6 rounded-full border-2 border-midnight bg-gradient-to-br from-calm to-[#0D9488] flex items-center justify-center"
                  >
                    <span className="text-[7px] text-white font-bold">
                      {String.fromCharCode(65 + a)}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-textMuted text-xs">+1,242 others</span>
            </div>

            {/* Day markers */}
            <div className="flex items-center justify-between mb-2">
              {DAYS.map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span className="text-textMuted text-[10px]">{day}</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      duration: 0.3,
                      ease: springBounce,
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      COMPLETED_DAYS[i]
                        ? 'bg-calm'
                        : i === 3
                          ? 'border-2 border-gold'
                          : 'border-2 border-navy'
                    }`}
                  >
                    {COMPLETED_DAYS[i] && (
                      <Check size={14} className="text-white" strokeWidth={3} />
                    )}
                    {i === 3 && !COMPLETED_DAYS[i] && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: 'easeInOut',
                        }}
                        className="w-2 h-2 rounded-full bg-gold"
                      />
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

            <p className="text-textPrimary text-sm mb-4">
              Day 4 of 7 —{' '}
              <span className="text-textSecondary">3 more to go!</span>
            </p>

            {/* Reward preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gold/5 border border-gold/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5A623] to-[#FFD93D] flex items-center justify-center flex-shrink-0">
                <Trophy size={20} className="text-deepSpace" />
              </div>
              <div>
                <p className="text-textPrimary text-sm font-semibold">
                  7-Day Streak Badge
                </p>
                <p className="text-gold text-xs">+500 XP</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ SECTION 6: Floating Compose Button ═══ */}
      <motion.button
        onClick={() => setShowComposer(true)}
        className="fixed z-40 w-14 h-14 rounded-full gradient-gold flex items-center justify-center shadow-gold-glow"
        style={{ bottom: '88px', right: 'max(16px, calc((100vw - 480px) / 2 + 16px))' }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
          scale: { type: 'spring', stiffness: 400, damping: 17 },
        }}
      >
        <Plus size={24} className="text-deepSpace" strokeWidth={2.5} />
      </motion.button>

      {/* ═══ Post Composer Bottom Sheet ═══ */}
      <AnimatePresence>
        {showComposer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowComposer(false)}
              className="fixed inset-0 bg-black/60 z-50"
              style={{ maxWidth: '480px', margin: '0 auto' }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-midnight rounded-t-[20px] max-h-[70vh]"
              style={{ maxWidth: '480px', margin: '0 auto' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-[#475569]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <h3 className="font-display text-lg font-bold text-textPrimary">
                  Share with the community
                </h3>
                <button
                  onClick={() => setShowComposer(false)}
                  className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-textMuted hover:text-textPrimary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tags */}
              <div className="flex gap-2 px-5 mb-3 overflow-x-auto hide-scrollbar">
                {[
                  { label: 'Celebration', emoji: '🎉' },
                  { label: 'Need support', emoji: '💙' },
                  { label: 'Tips', emoji: '💡' },
                  { label: 'Vent', emoji: '😤' },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() =>
                      setComposerTag(
                        composerTag === tag.label ? null : tag.label
                      )
                    }
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      composerTag === tag.label
                        ? 'bg-gold text-deepSpace'
                        : 'bg-navy text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {tag.emoji} {tag.label}
                  </button>
                ))}
              </div>

              {/* Text area */}
              <div className="px-5 mb-3">
                <textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder="How's your journey going? What's on your mind?"
                  className="w-full min-h-[120px] bg-deepSpace rounded-xl p-4 text-textPrimary text-sm placeholder:text-textMuted resize-none outline-none border border-white/[0.06] focus:border-gold/50 transition-colors"
                />
              </div>

              {/* Footer */}
              <div className="px-5 pb-6 pt-1">
                <p className="text-textMuted text-xs text-center mb-3">
                  Your post is anonymous. Be kind. 💛
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePost}
                  disabled={!composerText.trim()}
                  className={`w-full h-12 rounded-2xl font-bold text-sm transition-all ${
                    composerText.trim()
                      ? 'gradient-gold text-deepSpace shadow-gold-glow hover:brightness-110'
                      : 'bg-navy text-textMuted cursor-not-allowed'
                  }`}
                >
                  Post Anonymously
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
