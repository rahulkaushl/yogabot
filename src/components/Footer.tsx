import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-deepSpace border-t border-white/5 py-8 px-6">
      <div className="max-w-[480px] mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/yogbot-mascot.png" alt="Yog-Bot" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl text-textPrimary">YOG-BOT</span>
        </div>
        <p className="text-center text-textMuted text-sm mb-4">
          Rebooting Teenagers. Reconnecting Humanity.
        </p>
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="text-textSecondary hover:text-gold transition-colors text-sm">About</a>
          <a href="#" className="text-textSecondary hover:text-gold transition-colors text-sm">Privacy</a>
          <a href="#" className="text-textSecondary hover:text-gold transition-colors text-sm">Terms</a>
          <a href="#" className="text-textSecondary hover:text-gold transition-colors text-sm">Contact</a>
        </div>
        <p className="text-center text-textMuted text-xs flex items-center justify-center gap-1">
          Made with <Heart size={12} className="text-danger fill-danger" /> for teens everywhere
        </p>
        <p className="text-center text-textMuted/50 text-xs mt-2">
          #YOG-BOT #MediaWise #TeenPower #BalanceIsBeautiful #MindfulTeen #RebootYourself
        </p>
      </div>
    </footer>
  )
}
