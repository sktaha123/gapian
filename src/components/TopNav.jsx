import { Info } from 'lucide-react';
import logo from '../assets/images/logo.png';

function TopNav({ onGuide }) {
  return (
    <header 
      className="
        fixed inset-x-0 top-0 z-50 
        border-b border-white/5 
        bg-[#05070B]/60 
        backdrop-blur-xl 
      "
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* LEFT: Logo (Wrapped in a link for standard UX) */}
        <a 
          href="/" 
          className="
            group 
            flex 
            items-center 
            rounded-lg 
            outline-none 
            transition-opacity 
            hover:opacity-80 
            focus-visible:ring-2 
            focus-visible:ring-blue-500/50
          "
          aria-label="Go to Home"
        >
          <img
            src={logo}
            alt="Gapian Logo"
            className="
              h-8
              w-auto
              object-contain
              select-none
            "
          />
        </a>

        {/* RIGHT: Guide Button */}
        <button
          type="button"
          onClick={onGuide}
          className="
            group
            inline-flex
            h-9
            items-center
            gap-2
            rounded-full
            border
            border-white/5
            bg-white/[0.02]
            px-4
            text-[13px]
            font-medium
            text-slate-300
            transition-all
            duration-300
            hover:border-white/10
            hover:bg-white/5
            hover:text-white
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-blue-500/50
          "
        >
          <Info
            size={15}
            strokeWidth={2}
            className="text-slate-400 transition-colors duration-300 group-hover:text-blue-400"
          />
          <span>Guide</span>
        </button>
      </div>
    </header>
  );
}

export default TopNav;