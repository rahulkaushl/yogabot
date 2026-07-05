import { useLocation } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isOnboarding = location.pathname === '/onboarding'
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-deepSpace text-textPrimary font-sans">
      {/* Desktop decorative side panels */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-[calc((100vw-480px)/2)] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-deepSpace via-midnight to-deepSpace opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gold/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full bg-calm/5 blur-2xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>
      <div className="hidden lg:block fixed inset-y-0 right-0 w-[calc((100vw-480px)/2)] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-deepSpace via-midnight to-deepSpace opacity-50" />
        <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-gold/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 rounded-full bg-purple/5 blur-2xl animate-pulse-glow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main content container */}
      <div className="relative max-w-[480px] mx-auto min-h-screen flex flex-col">
        {/* Top header bar */}
        {!isOnboarding && !isHome && (
          <header className="sticky top-0 z-50 h-14 bg-deepSpace/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <img src="/yogbot-mascot.png" alt="Yog-Bot" className="w-8 h-8 object-contain" />
              <span className="font-display font-bold text-lg text-textPrimary">YOG-BOT</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-textSecondary">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              </button>
              <button className="p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-textSecondary">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          </header>
        )}

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer (only on home page) */}
        {isHome && <Footer />}

        {/* Bottom nav (not on onboarding or home) */}
        {!isOnboarding && !isHome && <Navbar />}

        {/* Spacer for bottom nav */}
        {!isOnboarding && !isHome && <div className="h-[72px]" />}
      </div>
    </div>
  )
}
