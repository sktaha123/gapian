import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Search, GitMerge, FileCheck, Sparkles } from 'lucide-react';

const GUIDE_STEPS = [
  {
    icon: Search,
    title: '1. Discover Ideas',
    body: 'Use the AI search bar to generate premium digital product opportunities based on your niche. Every result includes positioning and pricing data.',
    color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    icon: GitMerge,
    title: '2. Choose Your Path',
    body: 'Select between building it yourself with the Manual Guide or letting AI generate the entire product. Both paths start with a complete architectural blueprint.',
    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20'
  },
  {
    icon: Sparkles,
    title: '3. Configure Product',
    body: 'Step through an immersive wizard to set typography, color palettes, cover design prompts, and content depth tailored exactly to your brand.',
    color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20'
  },
  {
    icon: FileCheck,
    title: '4. Final Execution',
    body: 'Copy your complete roadmap for manual creation, or export a precision master prompt directly to Claude for instant generation.',
    color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20'
  }
];

function GuideModal({ open, onClose }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#05070B]/80 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/5 bg-[#05070B] shadow-2xl"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/[0.06] bg-white/[0.01] px-6 py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Platform Guide
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-100">
                  How Gapian Works
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="relative space-y-4 p-6 sm:p-8">
              {GUIDE_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-5 rounded-2xl border border-white/5 bg-white/[0.01] p-5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${step.bg}`}>
                      <Icon size={20} className={step.color} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-200">{step.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="relative border-t border-white/[0.06] bg-white/[0.01] px-6 py-4 text-center">
              <p className="text-[12px] text-slate-500">
                Press <kbd className="mx-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[10px] font-bold text-slate-300">Esc</kbd> to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GuideModal;