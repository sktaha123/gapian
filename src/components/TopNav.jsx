import { Info } from 'lucide-react';
import logo from '../assets/images/logo.png';

function TopNav({ onGuide }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.04] bg-[#05070B]/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        
        {/* LEFT */}
        <div className="flex items-center">

          <img
            src={logo}
            alt="Gapian Logo"
            className="
              h-10
              w-auto
              object-contain
              select-none
            "
          />
        </div>

        {/* RIGHT */}
        <button
          type="button"
          onClick={onGuide}
          className="
            group
            inline-flex
            h-10
            items-center
            gap-2
            rounded-lg
            border
            border-white/[0.06]
            bg-white/[0.02]
            px-4
            text-sm
            text-[#CBD5E1]
            transition-all
            duration-300
            hover:border-[#3B82F6]/30
            hover:bg-[#3B82F6]/[0.05]
            hover:text-white
          "
        >
          <Info
            size={14}
            className="text-[#7DA2FF] transition-all duration-300"
          />

          <span>Guide</span>
        </button>
      </div>
    </header>
  );
}

export default TopNav;