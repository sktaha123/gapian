import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const PATHS = [
  {
    id: 'manual',
    icon: BookOpen,
    label: 'Premium Product Guide',
    badge: 'Human-Crafted',
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    headline: 'Build it yourself — we give you the blueprint.',
    description:
      'Gapian generates a full professional product blueprint: chapter structure, modules, bonus ideas, and positioning strategy. You write the content yourself using our structured guide.',
    bullets: [
      'Complete chapter & module index',
      'Bonus content ideas & worksheets',
      'Platform & pricing recommendations',
      'Manual creation checklist',
    ],
    accent: 'border-emerald-500/20',
    glow: 'bg-emerald-500/5',
    activeRing: 'ring-2 ring-emerald-500/30 border-emerald-500/25',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'ai',
    icon: Sparkles,
    label: 'AI Product Creation',
    badge: 'Powered by Claude',
    badgeColor: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
    headline: 'Let AI write the entire product for you.',
    description:
      'Gapian builds your blueprint, then compiles a precision master prompt for Claude AI. Choose your style, color theme, and depth — Claude writes the complete, publication-ready product.',
    bullets: [
      'AI-generated full product content',
      'Style, theme & depth customization',
      'Cover design brief included',
      'One-click Claude AI export',
    ],
    accent: 'border-violet-500/20',
    glow: 'bg-violet-500/5',
    activeRing: 'ring-2 ring-violet-500/30 border-violet-500/25',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
  },
];

function ProductPathModal({ idea, onClose, onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <motion.div
      className="fixed inset-0 z-[1000] overflow-y-auto bg-[#05070B] px-4 pb-8 pt-20 sm:px-12 sm:pb-12 sm:pt-24"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-6 pb-10 border-b border-white/10 mb-10">
          <div className="flex-1">
            <button
              type="button"
              onClick={onClose}
              className="mb-6 flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              <X size={15} /> Close
            </button>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {idea.tags?.map(t => (
                <span key={t} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t}
                </span>
              ))}
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-slate-50">Choose Your Path</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-slate-400 max-w-2xl">
              You're creating a product for: <span className="font-semibold text-slate-200">{idea.title}</span>.
              How would you like to build it?
            </p>
          </div>
        </div>

        {/* Path cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-10">
          {PATHS.map(path => {
            const Icon = path.icon;
            const isActive = selected === path.id;
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => setSelected(path.id)}
                className={`group relative overflow-hidden rounded-2xl border p-8 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  isActive
                    ? `${path.activeRing} ${path.glow}`
                    : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                }`}
              >
                {/* Top glow strip */}
                <div className={`absolute inset-x-0 top-0 h-px transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                } bg-gradient-to-r from-transparent ${path.id === 'manual' ? 'via-emerald-400/40' : 'via-violet-400/40'} to-transparent`} />

                {/* Icon + Badge row */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${path.iconBg}`}>
                    <Icon size={20} className={path.iconColor} />
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${path.badgeColor}`}>
                    {path.badge}
                  </span>
                </div>

                <p className="text-[18px] font-bold tracking-tight text-slate-100 mb-2">{path.label}</p>
                <p className="text-[13px] font-medium text-slate-400 mb-1 leading-snug">{path.headline}</p>
                <p className="text-[12px] leading-relaxed text-slate-500 mb-6">{path.description}</p>

                {/* Bullets */}
                <ul className="space-y-2">
                  {path.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2.5">
                      <CheckCircle
                        size={13}
                        className={`shrink-0 ${isActive ? path.iconColor : 'text-slate-600'} transition-colors duration-200`}
                      />
                      <span className={`text-[12px] ${isActive ? 'text-slate-300' : 'text-slate-500'} transition-colors duration-200`}>
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Selected indicator */}
                {isActive && (
                  <div className={`absolute bottom-4 right-4 flex h-6 w-6 items-center justify-center rounded-full ${
                    path.id === 'manual' ? 'bg-emerald-500/20' : 'bg-violet-500/20'
                  }`}>
                    <CheckCircle size={14} className={path.iconColor} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between gap-6 pt-6 border-t border-white/10">
          <p className="text-[13px] text-slate-500">
            {selected
              ? `You selected: ${PATHS.find(p => p.id === selected)?.label}`
              : 'Select a path above to continue'}
          </p>
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className={`group inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-[14px] font-bold text-white transition-all duration-300 ${
              selected
                ? selected === 'manual'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 hover:scale-[1.01]'
                  : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-500/20 hover:scale-[1.01]'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight size={16} className={`transition-transform duration-300 ${selected ? 'group-hover:translate-x-0.5' : ''}`} />
          </button>
        </div>

      </div>
    </motion.div>
  );
}

export default ProductPathModal;
