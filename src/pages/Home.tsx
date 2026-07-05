import { useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router'
import CountUp from 'react-countup'
import {
  ChevronDown,
  Bot,
  Smartphone,
  Lock,
  Users,
  Zap,
  Sunrise,
  BookOpen,
  Heart,
  Moon,
  Sparkles,
  Trophy,
  Quote,
} from 'lucide-react'

/* ──────────────────────────────────────────────
   Animated Components (isolated for performance)
   ────────────────────────────────────────────── */

const FloatingMascot = memo(function FloatingMascot() {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 -m-10 rounded-full animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)',
        }}
      />
      <motion.img
        src="./yogbot-mascot.png"
        alt="Yog-Bot mascot"
        className="w-[200px] h-[200px] object-contain relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.8 }}
        style={{
          animation: 'float 3.5s ease-in-out infinite',
        }}
      />
    </div>
  )
})

const FloatingParticles = memo(function FloatingParticles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.2 + 0.1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0,
            animation: `particle-drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
})

function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  const dirMap = {
    up: { y: 40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  }
  const dir = dirMap[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: dir.y, x: dir.x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   Section 1: Hero
   ────────────────────────────────────────────── */

function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 gradient-hero overflow-hidden">
      <FloatingParticles />

      {/* Yog-Bot Mascot */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.8 }}
        className="mb-6"
      >
        <FloatingMascot />
      </motion.div>

      {/* Headline */}
      <div className="text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="font-display text-[42px] font-bold text-textPrimary leading-[1.1] tracking-tight"
        >
          Rebooting Teenagers.
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="font-display text-[42px] font-bold text-textPrimary leading-[1.1] tracking-tight"
        >
          Reconnecting Humanity.
        </motion.h1>
      </div>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-body-lg text-textSecondary text-center max-w-[320px] mt-4 z-10"
      >
        The AI wellness coach that helps you control your screen time, not the other way around.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
        className="flex gap-3 mt-6 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/onboarding')}
          className="h-[52px] px-6 rounded-[14px] gradient-gold font-body text-[#0A1628] font-bold text-base shadow-gold-button"
        >
          Get the App
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(245,166,35,0.1)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/yoga')}
          className="h-[52px] px-6 rounded-[14px] border-[1.5px] border-gold/50 text-gold font-body font-semibold text-base bg-transparent"
        >
          Try a Session
        </motion.button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 z-10"
      >
        <ChevronDown size={24} className="text-gold animate-bounce-chevron" />
      </motion.div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Section 2: Problem Statement
   ────────────────────────────────────────────── */

function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  const painPoints = [
    '😰 You check your phone 96 times a day — and feel worse every time',
    '😴 Sleep? What\'s that? The blue light won, again.',
    '😐 Real conversations feel awkward. Streaks feel safe.',
  ]

  return (
    <section className="px-5 py-16" style={{ background: '#0A1628' }}>
      <ScrollReveal>
        <p className="text-caption text-gold tracking-[0.1em] uppercase mb-4">THE PROBLEM</p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 className="font-display text-[32px] font-bold text-textPrimary leading-[1.15] max-w-[90%]">
          Your phone was designed to keep you scrolling. We were designed to help you stop.
        </h2>
      </ScrollReveal>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        className="mt-8 rounded-2xl overflow-hidden gradient-card border border-white/[0.06] shadow-card"
      >
        <div className="flex flex-col">
          <img
            src="./teen-meditating.jpg"
            alt="Teenager meditating"
            className="w-full h-[200px] object-cover"
          />
          <div className="p-5">
            {painPoints.map((point, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="text-sm text-textSecondary mb-3 last:mb-0 leading-relaxed"
              >
                {point}
              </motion.p>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Section 3: How It Works (4-step journey)
   ────────────────────────────────────────────── */

const journeySteps = [
  {
    emoji: '😵',
    title: 'The Scroll Spiral',
    description: 'Mindlessly scrolling, comparing, feeling worse. You know the drill.',
    borderColor: 'rgba(239,68,68,0.1)',
  },
  {
    emoji: '💪',
    title: 'The Wake-Up Call',
    description: "You realize something's off. The anxiety, the sleep issues, the FOMO.",
    borderColor: 'rgba(234,179,8,0.1)',
  },
  {
    emoji: '💡',
    title: 'Meeting Yog-Bot',
    description: 'Your AI wellness coach shows up. No judgment, just support.',
    borderColor: 'rgba(59,130,246,0.1)',
  },
  {
    emoji: '🧘',
    title: 'Finding Your Flow',
    description: 'Yoga, mindfulness, real connections. You control the tech, not vice versa.',
    borderColor: 'rgba(34,197,94,0.1)',
    special: true,
  },
]

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section className="px-5 py-16" style={{ background: '#0A1628' }}>
      <ScrollReveal>
        <h2 className="font-display text-[28px] font-bold text-textPrimary text-center mb-8">
          Your Journey to Balance
        </h2>
      </ScrollReveal>

      {/* Connecting line */}
      <div className="relative">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="absolute top-[60px] left-4 right-4 h-[2px] origin-left hidden md:block"
          style={{ background: 'rgba(245,166,35,0.3)', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(245,166,35,0.3) 6px, rgba(245,166,35,0.3) 12px)' }}
        />

        {/* Horizontal scroll container */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {journeySteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
              className="flex-shrink-0 w-[260px] rounded-2xl p-5 gradient-card shadow-card"
              style={{
                scrollSnapAlign: 'start',
                border: step.special
                  ? '1px solid rgba(255,255,255,0.06)'
                  : `1px solid ${step.borderColor}`,
                borderLeft: step.special ? '3px solid #F5A623' : undefined,
              }}
            >
              <div className="text-[48px] mb-3">{step.emoji}</div>
              <h3 className="font-display text-[22px] font-bold text-textPrimary mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Section 4: Feature Highlights
   ────────────────────────────────────────────── */

const features = [
  {
    icon: Bot,
    title: 'AI Yoga Bot',
    description: 'Personalized yoga flows guided by Yog-Bot. From 2-minute reboots to full sessions.',
    color: '#F5A623',
    hoverAnim: { rotate: 15 },
  },
  {
    icon: Smartphone,
    title: 'Screen Time Tracker',
    description: 'Know exactly where your hours go. Color-coded alerts when you need to step back.',
    color: '#14B8A6',
    hoverAnim: { scale: [1, 1.1, 1] },
  },
  {
    icon: Lock,
    title: 'Digital Detox Mode',
    description: 'Lock in focus time. Earn XP for every minute away from your screen.',
    color: '#A855F7',
    hoverAnim: { rotate: [-5, 5, -5, 5, 0] },
  },
  {
    icon: Users,
    title: 'Teen Squad',
    description: 'Anonymous community of teens on the same journey. Challenges, buddies, zero judgment.',
    color: '#3B82F6',
    hoverAnim: { y: [0, -4, 0] },
  },
]

function FeaturesSection() {
  return (
    <section className="px-5 py-16" style={{ background: '#0A1628' }}>
      <ScrollReveal>
        <h2 className="font-display text-[28px] font-bold text-textPrimary text-center mb-8">
          Your Wellness Toolkit
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, i) => (
          <ScrollReveal key={i} delay={i * 0.12}>
            <motion.div
              whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-5 gradient-card border border-white/[0.06] shadow-card min-h-[180px] flex flex-col cursor-pointer"
            >
              <motion.div
                whileHover={feature.hoverAnim}
                transition={{ duration: 0.4 }}
              >
                <feature.icon size={32} style={{ color: feature.color }} strokeWidth={2} />
              </motion.div>
              <h3 className="font-display text-[18px] font-bold text-textPrimary mt-3 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed flex-1">
                {feature.description}
              </p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Section 5: Content Categories
   ────────────────────────────────────────────── */

const categories = [
  { icon: Zap, name: 'Quick Reboots', sessions: '12 sessions', gradient: 'from-amber-500 to-orange-600' },
  { icon: Sunrise, name: 'Morning Flow', sessions: '8 sessions', gradient: 'from-yellow-400 to-amber-500' },
  { icon: BookOpen, name: 'Study Break', sessions: '15 sessions', gradient: 'from-blue-400 to-indigo-500' },
  { icon: Heart, name: 'Anxiety Relief', sessions: '10 sessions', gradient: 'from-teal-400 to-cyan-500' },
  { icon: Moon, name: 'Sleep Prep', sessions: '9 sessions', gradient: 'from-indigo-400 to-purple-500' },
  { icon: Lock, name: 'Digital Detox', sessions: '6 sessions', gradient: 'from-purple-400 to-pink-500' },
  { icon: Sparkles, name: 'Body Positivity', sessions: '7 sessions', gradient: 'from-pink-400 to-rose-500' },
  { icon: Trophy, name: 'Confidence Boost', sessions: '11 sessions', gradient: 'from-emerald-400 to-teal-500' },
]

function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section className="px-5 py-16" style={{ background: '#0A1628' }}>
      <ScrollReveal>
        <h2 className="font-display text-[28px] font-bold text-textPrimary mb-8">
          Find Your Flow
        </h2>
      </ScrollReveal>

      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`flex-shrink-0 w-[150px] h-[180px] rounded-2xl bg-gradient-to-br ${cat.gradient} flex flex-col items-center justify-center p-4 cursor-pointer shadow-card`}
            style={{ scrollSnapAlign: 'start' }}
          >
            <cat.icon size={28} className="text-white mb-3" strokeWidth={2} />
            <h3 className="font-display text-[16px] font-semibold text-white text-center leading-tight">
              {cat.name}
            </h3>
            <p className="text-xs text-white/70 mt-1">{cat.sessions}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Section 6: Testimonials
   ────────────────────────────────────────────── */

const testimonials = [
  {
    quote:
      "I used to scroll TikTok for 4 hours before bed. Now I do a 10-min yoga session with Yog-Bot and actually sleep. Game changer.",
    name: 'Jordan, 16',
    initials: 'J',
    color: '#F5A623',
    reaction: 'Proud of you, Jordan! 🔥',
  },
  {
    quote:
      "The digital detox timer is honestly kind of genius. I locked my phone for 30 mins and… nothing bad happened. I read a book.",
    name: 'Aisha, 17',
    initials: 'A',
    color: '#14B8A6',
    reaction: "That's the spirit, Aisha! 📚✨",
  },
  {
    quote:
      "My anxiety was through the roof. The 'Anxiety Relief' yoga flows + talking to Yog-Bot at 2am saved me more than once.",
    name: 'Marcus, 15',
    initials: 'M',
    color: '#A855F7',
    reaction: 'Always here for you, Marcus. 💙🧘',
  },
]

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section className="px-5 py-16" style={{ background: '#0A1628' }}>
      <ScrollReveal>
        <h2 className="font-display text-[28px] font-bold text-textPrimary text-center mb-8">
          Real Teens, Real Change
        </h2>
      </ScrollReveal>

      <div ref={ref} className="flex flex-col gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="rounded-2xl p-5 gradient-card border border-white/[0.06] shadow-card relative"
          >
            {/* Gold quote border on left */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gold origin-top"
            />

            <Quote size={20} className="text-gold/40 mb-2" />

            <p className="text-base text-textPrimary italic leading-relaxed pl-2">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3 mt-4 pl-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
                style={{ background: t.color }}
              >
                {t.initials}
              </div>
              <span className="text-xs font-semibold text-gold tracking-wide">{t.name}</span>
            </div>

            {/* Yog-Bot reaction */}
            <div className="mt-3 flex items-start gap-2 pl-2">
              <img
                src="./yogbot-speaking.png"
                alt="Yog-Bot"
                className="w-6 h-6 object-contain flex-shrink-0 mt-0.5"
              />
              <div className="bg-navy rounded-xl rounded-tl-sm px-3 py-2">
                <p className="text-sm text-textSecondary">{t.reaction}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Section 7: Stats + Trust
   ────────────────────────────────────────────── */

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const stats = [
    { value: 50, suffix: 'K+', label: 'Teens Rebooted', decimals: 0 },
    { value: 2.4, suffix: 'M', label: 'Minutes of Yoga', decimals: 1 },
    { value: 4.8, suffix: '★', label: 'App Store Rating', decimals: 1 },
  ]

  const publications = ['TechCrunch', 'Teen Vogue', 'Mashable', 'Forbes']

  return (
    <section
      className="px-5 py-12 border-y border-white/5"
      style={{
        background: 'linear-gradient(180deg, #111D32 0%, #0D1A2D 100%)',
      }}
    >
      <div ref={ref} className="grid grid-cols-3 gap-4 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <div className="font-display text-[28px] font-bold text-gold">
              {isInView ? (
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={2}
                  delay={i * 0.2}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                />
              ) : (
                `0${stat.suffix}`
              )}
            </div>
            <p className="text-xs text-textSecondary mt-1 tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trust bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-8 flex flex-col items-center"
      >
        <p className="text-xs text-textMuted mb-3 tracking-wide">As featured in</p>
        <div className="flex items-center gap-5">
          {publications.map((pub) => (
            <span
              key={pub}
              className="text-sm font-display font-semibold text-textMuted/60 tracking-wide"
            >
              {pub}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Section 8: Final CTA
   ────────────────────────────────────────────── */

function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="px-5 pt-16 pb-8" style={{ background: '#0A1628' }}>
      <ScrollReveal>
        <div
          className="rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #111D32 0%, #0D1A2D 100%)',
            border: '1px solid rgba(245,166,35,0.2)',
          }}
        >
          {/* Gold tint overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(245,166,35,0.03)' }}
          />

          <motion.img
            src="./yogbot-celebrating.png"
            alt="Yog-Bot celebrating"
            className="w-[120px] h-[120px] object-contain mb-4 relative z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
          />

          <h2 className="font-display text-[32px] font-bold text-textPrimary relative z-10">
            Ready to Reboot?
          </h2>

          <p className="text-base text-textSecondary mt-2 mb-6 relative z-10">
            Download YOG-BOT free. Your first 5-minute session starts now.
          </p>

          <div className="flex flex-col gap-3 w-full relative z-10">
            <motion.button
              whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/onboarding')}
              className="h-[52px] w-full rounded-[14px] gradient-gold font-body text-[#0A1628] font-bold text-base shadow-gold-button"
            >
              Download for iOS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/onboarding')}
              className="h-[52px] w-full rounded-[14px] gradient-gold font-body text-[#0A1628] font-bold text-base shadow-gold-button"
            >
              Download for Android
            </motion.button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Home Page (assembles all sections)
   ────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <StatsSection />
      <CTASection />
    </div>
  )
}
