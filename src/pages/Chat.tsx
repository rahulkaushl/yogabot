import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Send,
  Sparkles,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

interface MockConversation {
  messages: Omit<Message, 'id' | 'timestamp'>[];
}

/* ──────────────────────────────────────────────
   Mock Conversations (8–10 realistic exchanges)
   ────────────────────────────────────────────── */

const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    messages: [
      { sender: 'user', text: "I'm stressed 😰" },
      {
        sender: 'bot',
        text: "I'm sorry to hear that. 💙 Stress is tough — but you're tougher. Want to try a quick grounding exercise? It only takes 2 minutes.",
        suggestions: ["Try 5-min breathing 🫁", "Quick yoga stretch 🧘", "Talk about it 💬"],
      },
      { sender: 'user', text: 'Try 5-min breathing 🫁' },
      {
        sender: 'bot',
        text: "Great choice! Here's a simple 5-4-3-2-1 grounding technique:\n\n🌿 Name 5 things you can see\n🌿 Name 4 things you can touch\n🌿 Name 3 things you can hear\n🌿 Name 2 things you can smell\n🌿 Name 1 thing you can taste\n\nTake your time. I'll wait right here. 🤖",
      },
      {
        sender: 'bot',
        text: 'How are you feeling now? A little better, I hope? 🌟',
        suggestions: ["Much better! ✨", "A bit calmer 😌", "Still stressed 😰"],
      },
    ],
  },
  {
    messages: [
      { sender: 'user', text: "Can't sleep 🌙" },
      {
        sender: 'bot',
        text: "Sleep troubles are the worst. 😴 Have you been scrolling on your phone in bed? No judgment — we've all been there!",
      },
      { sender: 'user', text: 'Yeah... TikTok until 2am again' },
      {
        sender: 'bot',
        text: "Oof, the algorithm got you! 📱😅 Let's set you up for success tonight. Want me to guide you through a sleep prep yoga flow? It's 10 minutes and works like a charm.",
        suggestions: ["Sleep prep yoga 🌙", "Body scan meditation ✨", "Screen-time lock 🔒"],
      },
      { sender: 'user', text: 'Screen-time lock 🔒' },
      {
        sender: 'bot',
        text: 'Smart move! 🎯 I\'ve set a 30-minute digital detox timer. Your phone will gently remind you to wind down at 10 PM. Want to add a relaxing sound playlist too? 🎵',
      },
    ],
  },
  {
    messages: [
      { sender: 'user', text: 'Need motivation 💪' },
      {
        sender: 'bot',
        text: "You got this! 💪 Remember: every expert was once a beginner. Your future self will thank you for showing up today.\n\nYou've already completed 24 sessions — that's 24 times you chose YOU over the algorithm! 🔥",
        suggestions: ["View my progress 📊", "Start a challenge 🏆", "Daily affirmation ☀️"],
      },
      { sender: 'user', text: 'Start a challenge 🏆' },
      {
        sender: 'bot',
        text: "Awesome! 🎉 Here's your personalized 7-Day Morning Yoga Challenge:\n\n📅 Day 1–2: 5-min Sun Salutation\n📅 Day 3–4: Add Warrior Flow (10 min)\n📅 Day 5–6: Core Balance Focus\n📅 Day 7: Full Reset Session\n\nCompleting this earns you the 'Week Warrior' badge! Ready to start?",
        suggestions: ["Let's go! 🚀", "Maybe tomorrow 📅"],
      },
    ],
  },
  {
    messages: [
      { sender: 'user', text: 'Feeling anxious about exams 😰' },
      {
        sender: 'bot',
        text: "Exam anxiety is so real! 📚✨ But here's the thing — you've prepared, and worrying won't change the outcome. Let's do a quick Box Breathing exercise together:\n\n🫁 Inhale for 4 counts\n😌 Hold for 4 counts\n💨 Exhale for 4 counts\n🌀 Hold for 4 counts\n\nRepeat 5 times. I'll count with you!",
      },
      { sender: 'user', text: 'Thanks, that helped a bit 😌' },
      {
        sender: 'bot',
        text: "So glad to hear that! 😊💙 Remember: you've survived 100% of your bad days so far. That's a pretty great track record.\n\nWant me to set a reminder for a 5-min meditation before your exam?",
        suggestions: ["Yes please! 🔔", "I'm good for now ✨"],
      },
    ],
  },
  {
    messages: [
      { sender: 'user', text: 'How do I reduce screen time?' },
      {
        sender: 'bot',
        text: "Great question! 🎯 You're already at 3.5 hours today — down from 5 hours last week. Progress! 🎉\n\nHere are 3 quick wins:\n\n📱 Turn on grayscale mode after 8pm\n🚫 Move social apps off your home screen\n⏱️ Set app timers for 20 min max",
        suggestions: ["Set detox timer ⏱️", "More tips please 💡", "Challenge accepted 🏆"],
      },
    ],
  },
  {
    messages: [
      { sender: 'user', text: 'Is social media bad for my brain?' },
      {
        sender: 'bot',
        text: "Not inherently! 🧠 But here's the tea: social media is designed to hijack your dopamine system. Those infinite scrolls and likes? They trigger the same brain pathways as slot machines! 🎰\n\nThe key is being INTENTIONAL about your usage, not just mindlessly scrolling.",
      },
      { sender: 'user', text: 'That makes sense actually' },
      {
        sender: 'bot',
        text: "Right?! 🤯 You're basically training your brain to crave quick hits of validation. The good news: you can rewire it!\n\nWant to learn more about digital wellness? I can walk you through our Media Literacy module! 📚✨",
        suggestions: ["Yes, teach me! 🧠", "Maybe later 📅"],
      },
    ],
  },
  {
    messages: [
      { sender: 'user', text: 'I completed my first yoga session! 🎉' },
      {
        sender: 'bot',
        text: "YESSS! 🎉🎉🎉 I'm literally celebrating over here! You just took the first step on an incredible journey.\n\n🏆 Badge Unlocked: 'First Step'\n➕ +50 XP earned!\n\nHow did it feel? Sore? Amazing? Both? 😄",
        suggestions: ["It felt amazing! ✨", "I'm so sore 😅", "Both honestly 😂"],
      },
      { sender: 'user', text: 'It felt amazing! ✨' },
      {
        sender: 'bot',
        text: "That post-yoga glow is REAL! 🌟✨ Keep riding this wave — consistency is where the magic happens. Your streak starts NOW: Day 1 of your wellness journey! 🔥\n\nSee you on the mat tomorrow? 🧘‍♀️",
      },
    ],
  },
  {
    messages: [
      { sender: 'user', text: 'What yoga pose helps with focus?' },
      {
        sender: 'bot',
        text: "For focus, I'd recommend Tree Pose (Vrksasana)! 🌳\n\nIt looks simple, but balancing on one leg forces your brain to concentrate. Studies show it improves working memory!\n\n🧘 Stand tall, shift weight to left foot\n🦶 Place right foot on inner left thigh\n🙏 Hands at heart center or overhead\n👀 Focus gaze on one point\n\nHold for 5 breaths each side!",
        suggestions: ["Show me a video 🎥", "More focus poses 🧠"],
      },
    ],
  },
  {
    messages: [
      { sender: 'user', text: 'Tell me something motivational' },
      {
        sender: 'bot',
        text: "You don't need to be perfect. You just need to be 1% better than yesterday. 💫\n\nEvery breath you take on the mat, every minute you spend away from the screen, every time you choose yourself — you're rewriting your story.\n\nAnd hey, you've already saved 8.5 hours of screen time this week. That's 8.5 hours you got back for YOU. 🎉💙",
      },
    ],
  },
];

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

/** Three bouncing dots */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-start gap-1"
    >
      <div
        className="flex items-center gap-1 px-4 py-3"
        style={{
          background: '#1A2B47',
          borderRadius: '16px 16px 16px 4px',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gold"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span
        className="text-[10px] font-medium ml-2"
        style={{ color: '#475569' }}
      >
        Yog-Bot is thinking...
      </span>
    </motion.div>
  );
}

/** Yog-Bot floating avatar (chat header) */
function FloatingBotAvatar() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)',
          transform: 'scale(1.8)',
        }}
      />
      <img
        src="/yogbot-speaking.png"
        alt="Yog-Bot"
        className="w-10 h-10 rounded-full object-cover relative z-10"
        style={{ border: '2px solid rgba(245,166,35,0.3)' }}
      />
      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-deepSpace z-20" />
    </motion.div>
  );
}

/** Small bot avatar next to message bubbles */
function BotMessageAvatar() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src="/yogbot-speaking.png"
        alt="Yog-Bot"
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 self-end mb-1"
        style={{ border: '2px solid rgba(245,166,35,0.3)' }}
      />
    </motion.div>
  );
}

/** User message bubble */
function UserBubble({ text, timestamp }: { text: string; timestamp: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="flex flex-col items-end gap-1 max-w-[75%] self-end"
    >
      <div
        className="gradient-gold px-4 py-3"
        style={{
          borderRadius: '16px 16px 4px 16px',
        }}
      >
        <p className="text-sm font-medium leading-relaxed" style={{ color: '#0A1628' }}>
          {text}
        </p>
      </div>
      <span className="text-[10px] font-medium" style={{ color: '#475569' }}>
        {timestamp}
      </span>
    </motion.div>
  );
}

/** Bot message bubble */
function BotBubble({ text, timestamp }: { text: string; timestamp: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      }}
      className="flex items-end gap-2 max-w-[85%]"
    >
      <BotMessageAvatar />
      <div className="flex flex-col gap-1">
        <div
          className="px-4 py-3"
          style={{
            background: '#1A2B47',
            borderRadius: '16px 16px 16px 4px',
          }}
        >
          <p
            className="text-sm leading-relaxed whitespace-pre-line"
            style={{ color: '#F0F2F5' }}
          >
            {text}
          </p>
        </div>
        <span className="text-[10px] font-medium ml-1" style={{ color: '#475569' }}>
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
}

/** Quick-reply pill button */
function QuickReplyPill({
  text,
  onClick,
  index,
}: {
  text: string;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex-shrink-0 px-4 h-9 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 select-none"
      style={{
        background: '#1A2B47',
        border: '1px solid rgba(245,166,35,0.2)',
        color: '#F5A623',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(245,166,35,0.1)';
        e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#1A2B47';
        e.currentTarget.style.borderColor = 'rgba(245,166,35,0.2)';
      }}
    >
      {text}
    </motion.button>
  );
}

/* ──────────────────────────────────────────────
   Main Chat Page Component
   ────────────────────────────────────────────── */

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "I'm stressed 😰",
    "Can't sleep 🌙",
    "Need motivation 💪",
    "Feeling anxious 😰",
    "Screen time help 📱",
  ]);
  const [conversationIndex, setConversationIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Auto-scroll to bottom */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  /** Add a message */
  const addMessage = useCallback(
    (sender: 'user' | 'bot', text: string, suggestions?: string[]) => {
      const newMsg: Message = {
        id: generateId(),
        sender,
        text,
        timestamp: formatTime(new Date()),
        suggestions,
      };
      setMessages((prev) => [...prev, newMsg]);
    },
    []
  );

  /** Simulate bot typing then respond */
  const simulateBotResponse = useCallback(
    (botMessages: { text: string; suggestions?: string[] }[], startIdx: number) => {
      if (startIdx >= botMessages.length) {
        setIsSimulating(false);
        return;
      }

      setIsTyping(true);
      const delay = Math.min(800 + botMessages[startIdx].text.length * 15, 2500);

      const timer = setTimeout(() => {
        setIsTyping(false);
        addMessage(
          'bot',
          botMessages[startIdx].text,
          botMessages[startIdx].suggestions
        );
        if (botMessages[startIdx].suggestions) {
          setQuickReplies(botMessages[startIdx].suggestions!);
        }
        simulateBotResponse(botMessages, startIdx + 1);
      }, delay);

      return () => clearTimeout(timer);
    },
    [addMessage]
  );

  /** Send user message */
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isSimulating) return;

      addMessage('user', text);
      setInputText('');
      setIsSimulating(true);

      // Find context-aware bot response
      const lowerText = text.toLowerCase();
      let conv = MOCK_CONVERSATIONS[conversationIndex % MOCK_CONVERSATIONS.length];

      // Try to match by keyword for better context
      if (lowerText.includes('stress') || lowerText.includes('anxious')) {
        conv = MOCK_CONVERSATIONS[0];
      } else if (lowerText.includes('sleep')) {
        conv = MOCK_CONVERSATIONS[1];
      } else if (lowerText.includes('motivat')) {
        conv = MOCK_CONVERSATIONS[2];
      } else if (lowerText.includes('exam')) {
        conv = MOCK_CONVERSATIONS[3];
      } else if (lowerText.includes('screen')) {
        conv = MOCK_CONVERSATIONS[4];
      } else if (lowerText.includes('social') || lowerText.includes('brain')) {
        conv = MOCK_CONVERSATIONS[5];
      } else if (lowerText.includes('completed') || lowerText.includes('session')) {
        conv = MOCK_CONVERSATIONS[6];
      } else if (lowerText.includes('focus') || lowerText.includes('pose')) {
        conv = MOCK_CONVERSATIONS[7];
      } else if (lowerText.includes('motivational') || lowerText.includes('tell me')) {
        conv = MOCK_CONVERSATIONS[8];
      }

      const botResponses = conv.messages.filter((m) => m.sender === 'bot');
      simulateBotResponse(botResponses, 0);
      setConversationIndex((prev) => prev + 1);
    },
    [addMessage, conversationIndex, isSimulating, simulateBotResponse]
  );

  /** Send from quick reply */
  const handleQuickReply = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  /** Send from input */
  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  }, [inputText, sendMessage]);

  /** Handle key press */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  /** Initial welcome message */
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      addMessage(
        'bot',
        "Hey there! 👋 I'm Yog-Bot, your personal wellness coach. I'm here to help you find balance — one breath, one session, one day at a time. What's on your mind?",
        ["I'm stressed 😰", "Can't sleep 🌙", "Need motivation 💪", "Feeling anxious 😰"]
      );
    }, 400);
    return () => clearTimeout(welcomeTimer);
  }, [addMessage]);

  /** Voice recording toggle */
  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
  }, []);

  return (
    <div
      className="flex flex-col w-full"
      style={{ height: 'calc(100dvh - 72px)' }}
    >
      {/* ── Top Header Bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <FloatingBotAvatar />
        <div className="flex flex-col">
          <span
            className="text-base font-semibold"
            style={{ color: '#F0F2F5', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Yog-Bot
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-xs" style={{ color: '#64748B' }}>
              Online
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Sparkles size={14} style={{ color: '#F5A623' }} />
          <span className="text-[10px] font-medium" style={{ color: '#F5A623' }}>
            AI
          </span>
        </div>
      </div>

      {/* ── Chat History (Scrollable) ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
        style={{
          background: '#0A1628',
          backgroundImage:
            'linear-gradient(180deg, rgba(245,166,35,0.03) 0%, transparent 100px)',
          paddingBottom: '120px',
        }}
      >
        {messages.map((msg) =>
          msg.sender === 'user' ? (
            <UserBubble key={msg.id} text={msg.text} timestamp={msg.timestamp} />
          ) : (
            <BotBubble key={msg.id} text={msg.text} timestamp={msg.timestamp} />
          )
        )}

        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
      </div>

      {/* ── Quick Reply Suggestions ── */}
      {quickReplies.length > 0 && !isSimulating && (
        <div
          className="flex-shrink-0 px-4 py-2 overflow-x-auto hide-scrollbar"
          style={{
            background: '#0A1628',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex gap-2">
            {quickReplies.map((text, i) => (
              <QuickReplyPill
                key={`${text}-${i}`}
                text={text}
                index={i}
                onClick={() => handleQuickReply(text)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Input Bar ── */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Voice Input Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleRecording}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative"
          style={{ background: 'transparent' }}
        >
          <Mic
            size={20}
            style={{ color: isRecording ? '#EF4444' : '#94A3B8' }}
          />
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-500"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Yog-Bot..."
            className="w-full h-11 px-5 pr-12 text-sm outline-none transition-all duration-200"
            style={{
              background: '#1A2B47',
              borderRadius: '22px',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0F2F5',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#F5A623';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: inputText.trim()
                ? 'linear-gradient(135deg, #F5A623, #FFD93D)'
                : 'transparent',
              opacity: inputText.trim() ? 1 : 0.5,
            }}
          >
            <Send
              size={16}
              style={{ color: inputText.trim() ? '#0A1628' : '#64748B' }}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
