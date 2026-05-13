import { Info, Bookmark, History } from 'lucide-react';
import logo from '../assets/images/logo.png';

function TopNav({ onGuide, onVault, onHistory }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#05070B]/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <a
          href="/"
          className="group flex items-center rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-blue-500/50"
          aria-label="Go to Home"
        >
          <img src={logo} alt="Gapian Logo" className="h-8 w-auto object-contain select-none" />
        </a>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onHistory}
            title="Search history"
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] text-slate-400 transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:text-white focus:outline-none"
          >
            <History size={15} strokeWidth={2} className="transition-colors duration-300 group-hover:text-blue-400" />
          </button>

          <button
            type="button"
            onClick={onVault}
            title="Saved ideas"
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] text-slate-400 transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:text-white focus:outline-none"
          >
            <Bookmark size={15} strokeWidth={2} className="transition-colors duration-300 group-hover:text-blue-400" />
          </button>

          <button
            type="button"
            onClick={onGuide}
            className="group inline-flex h-9 items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 text-[13px] font-medium text-slate-300 transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
          >
            <Info size={15} strokeWidth={2} className="text-slate-400 transition-colors duration-300 group-hover:text-blue-400" />
            <span>Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopNav;