import { useLocation, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Home, Play, MessageCircle, Users, User } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/yoga', label: 'Yoga', icon: Play },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/community', label: 'Squad', icon: Users },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-deepSpace/95 backdrop-blur-xl border-t border-white/5">
      <div className="max-w-[480px] mx-auto h-full flex items-center justify-around px-2 relative">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path
          const Icon = item.icon
          const isCenter = index === 2

          if (isCenter) {
            return (
              <div key={item.path} className="relative -mt-8">
                <motion.button
                  onClick={() => navigate(item.path)}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-goldLight flex items-center justify-center shadow-[0_4px_20px_rgba(245,166,35,0.4)] border-2 border-gold/30"
                >
                  <img
                    src="/yogbot-mascot.png"
                    alt="Yog-Bot"
                    className="w-10 h-10 object-contain"
                  />
                </motion.button>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-textMuted">
                  {item.label}
                </span>
              </div>
            )
          }

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 py-2 px-3 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="navDot"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                size={24}
                className={isActive ? 'text-gold' : 'text-textMuted'}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-gold' : 'text-textMuted'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
