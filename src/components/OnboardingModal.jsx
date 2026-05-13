import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, BarChart2 } from 'lucide-react';
import { setOnboardingDone } from '../services/storageService.js';

const STEPS = [
  {
    icon: <Search size={28} className="text-blue-400" />,
    title: 'Describe your niche',
    body: 'Type anything — a topic, audience, or industry. The AI will generate premium product ideas tailored to it.',
  },
  {
    icon: <Sparkles size={28} className="text-purple-400" />,
    title: 'Get enriched AI results',
    body: 'Each idea includes a market score, pricing strategy, target audience, and category tags — not just a title.',
  },
  {
    icon: <BarChart2 size={28} className="text-emerald-400" />,
    title: 'Deep-dive, compare & refine',
    body: 'Expand any idea for a full analysis: competitors, roadmap, SEO keywords, and a Twitter thread. Compare two ideas head-to-head, or refine all results with a follow-up prompt.',
  },
];

function OnboardingModal({ open, onClose }) {
  const [step, setStep] = useState(0);

  const handleClose = () => {
    setOnboardingDone();
    onClose();
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-start justify-center bg-black/70 pt-24 px-4 pb-8 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080E1A] p-8 shadow-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[60px]" />
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="absolute right-5 top-5 rounded-full p-1.5 text-slate-600 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04]">
                  {STEPS[step].icon}
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Step {step + 1} of {STEPS.length}
                </p>
                <h3 className="text-[22px] font-semibold text-slate-100 mb-3">{STEPS[step].title}</h3>
                <p className="text-[15px] leading-7 text-slate-400">{STEPS[step].body}</p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-5 bg-blue-500' : 'w-1.5 bg-white/15'}`} />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-blue-600 px-5 py-2 text-[13px] font-semibold text-white transition-all hover:bg-blue-500"
              >
                {step < STEPS.length - 1 ? 'Next' : 'Get started'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OnboardingModal;
