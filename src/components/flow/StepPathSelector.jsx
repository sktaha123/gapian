import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const PATHS = [
  {
    id: 'manual',
    icon: BookOpen,
    label: 'Build It Yourself',
    badge: 'Manual Guide',
    badgeStyle: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    headline: 'You create. We guide every step.',
    body: 'Gapian generates your complete product blueprint, font guidance, color palette, cover design prompts, and a production-ready content strategy — then you build it with your own skills.',
    bullets: ['Full chapter & module index', 'Font & color recommendations', 'Cover design AI prompts', 'Content creation workflow'],
    iconColor: 'text-emerald-400',
    iconBg: 'border-emerald-500/20 bg-emerald-500/10',
    topGlow: 'via-emerald-400/30',
    ring: 'border-emerald-500/25 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]',
    steps: '7 steps',
  },
  {
    id: 'ai',
    icon: Sparkles,
    label: 'Create With AI',
    badge: 'Powered by Claude',
    badgeStyle: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
    headline: 'AI writes the entire product for you.',
    body: 'Choose your style, color theme, and depth. Gapian compiles a precision master prompt for Claude AI — which writes your complete, publication-ready digital product.',
    bullets: ['AI-generated full content', 'Style & theme customization', 'Cover design brief included', 'One-click Claude export'],
    iconColor: 'text-violet-400',
    iconBg: 'border-violet-500/20 bg-violet-500/10',
    topGlow: 'via-violet-400/30',
    ring: 'border-violet-500/25 shadow-[0_0_0_1px_rgba(139,92,246,0.15)]',
    steps: '6 steps',
  },
];

function StepPathSelector({ idea, onSelect }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">

      {/* Hero text */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Creating · {idea.title}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          How would you like to build this?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-400">
          Choose a creation path. Both guide you step-by-step — one with your own skills, one powered by AI.
        </p>
      </div>

      {/* Path cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PATHS.map(path => {
          const Icon = path.icon;
          return (
            <motion.button
              key={path.id}
              type="button"
              onClick={() => onSelect(path.id)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-7 text-left transition-colors duration-300 hover:${path.ring}`}
            >
              {/* Top glow strip on hover */}
              <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${path.topGlow} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Icon + badge */}
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${path.iconBg}`}>
                  <Icon size={20} className={path.iconColor} />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${path.badgeStyle}`}>
                    {path.badge}
                  </span>
                  <span className="text-[10px] text-slate-600">{path.steps}</span>
                </div>
              </div>

              <p className="mb-1 text-[18px] font-bold tracking-tight text-slate-100">{path.label}</p>
              <p className="mb-1 text-[13px] font-medium text-slate-400 leading-snug">{path.headline}</p>
              <p className="mb-6 text-[12px] leading-relaxed text-slate-500">{path.body}</p>

              {/* Bullets */}
              <ul className="space-y-2">
                {path.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2.5">
                    <CheckCircle size={12} className={`shrink-0 ${path.iconColor} opacity-60 group-hover:opacity-100 transition-opacity duration-200`} />
                    <span className="text-[12px] text-slate-500 group-hover:text-slate-400 transition-colors duration-200">{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA arrow */}
              <div className={`mt-6 flex items-center gap-1.5 text-[12px] font-semibold ${path.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                Get started <ArrowRight size={12} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Subtext */}
      <p className="mt-8 text-center text-[11px] text-slate-600">
        Both paths start with a full AI-generated product blueprint.
      </p>
    </div>
  );
}

export default StepPathSelector;
