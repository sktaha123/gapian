import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, MapPin, Search, Mail, Twitter, TrendingUp, AlertCircle, ChevronDown } from 'lucide-react';
import { fetchIdeaDetails } from '../services/geminiService.js';

function Section({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-white/[0.01] transition-colors"
      >
        <div className="flex items-center gap-2.5 text-[14px] font-medium text-slate-200">
          {icon}<span>{title}</span>
        </div>
        <ChevronDown size={15} className={`text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IdeaExpandModal({ idea, onClose }) {
  const [details, setDetails]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setDetails(null);
    fetchIdeaDetails(idea)
      .then(d => { if (!cancelled) { setDetails(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [idea.id]);

  const scoreColor = idea.score >= 8 ? '#10B981' : idea.score >= 6 ? '#3B82F6' : '#F59E0B';

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 pb-6 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <style>{`
        .modal-scroll-hide::-webkit-scrollbar { display: none; }
        .modal-scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <motion.div
        className="relative flex w-full max-w-2xl flex-col rounded-[32px] border border-white/[0.08] bg-[#0A101E] shadow-2xl"
        style={{ maxHeight: '85vh' }}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl">
          <div className="absolute top-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[60px]" />
        </div>

        {/* Header */}
        <div className="relative shrink-0 flex items-start justify-between gap-6 p-8 rounded-t-[32px]">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {idea.tags?.map(t => (
                <span key={t} className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t}</span>
              ))}
              <span className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                style={{ background: `${scoreColor}12`, color: scoreColor, border: `1px solid ${scoreColor}20` }}>
                {idea.score}
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50">{idea.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-blue-200/50">{idea.headline}</p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 mt-1 rounded-full p-2 text-slate-500 transition-all hover:bg-white/5 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-y-auto modal-scroll-hide p-8 pt-0 space-y-4">
          {/* Overview */}
          <div className="rounded-xl border border-white/6 p-5 space-y-3">
            <p className="text-[14px] leading-relaxed text-slate-400">{idea.description}</p>
            <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
              <div className="text-[12px]"><span className="text-slate-500">Pricing: </span><span className="text-slate-300">{idea.pricing}</span></div>
              <div className="text-[12px]"><span className="text-slate-500">Audience: </span><span className="text-slate-300">{idea.audience}</span></div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-3 py-10 text-slate-500">
              <Loader2 size={18} className="animate-spin text-blue-400" />
              <span className="text-[14px]">Loading deep analysis…</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <p className="text-[13px] text-red-300">{error}</p>
            </div>
          )}

          {details && (
            <>
              {/* Competitors */}
              <Section title="Competitors & Market Gap" icon={<Search size={14} className="text-blue-400" />} defaultOpen>
                <div className="flex flex-wrap gap-2 mb-3">
                  {details.competitors?.map(c => (
                    <span key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-slate-300">{c}</span>
                  ))}
                </div>
                {details.gap && <p className="text-[13px] leading-relaxed text-slate-400 border-t border-white/5 pt-3">{details.gap}</p>}
              </Section>

              {/* Roadmap */}
              <Section title="30 / 60 / 90 Day Roadmap" icon={<MapPin size={14} className="text-purple-400" />}>
                {['day30', 'day60', 'day90'].map((key, idx) => (
                  <div key={key} className="mb-4 last:mb-0">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">{['Day 1–30', 'Day 31–60', 'Day 61–90'][idx]}</p>
                    <ul className="space-y-1.5">
                      {details.roadmap?.[key]?.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-slate-400">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Section>

              {/* Revenue */}
              <Section title="Revenue Estimate" icon={<TrendingUp size={14} className="text-emerald-400" />}>
                <p className="text-[15px] font-semibold text-emerald-400">{details.revenueEstimate}</p>
              </Section>

              {/* SEO */}
              <Section title="SEO Keywords" icon={<Search size={14} className="text-yellow-400" />}>
                <div className="flex flex-wrap gap-2">
                  {details.seoKeywords?.map(k => (
                    <span key={k} className="rounded-full border border-yellow-500/20 bg-yellow-500/[0.06] px-3 py-1 text-[12px] text-yellow-300">{k}</span>
                  ))}
                </div>
              </Section>

              {/* Email Subjects */}
              <Section title="Email Subject Lines" icon={<Mail size={14} className="text-pink-400" />}>
                <ul className="space-y-2">
                  {details.emailSubjects?.map((s, i) => (
                    <li key={i} className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2 text-[13px] text-slate-300">{s}</li>
                  ))}
                </ul>
              </Section>

              {/* Twitter Thread */}
              <Section title="Twitter/X Thread" icon={<Twitter size={14} className="text-sky-400" />}>
                <div className="space-y-2">
                  {details.twitterThread?.map((t, i) => (
                    <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                      <span className="text-[10px] font-semibold text-sky-500">#{i + 1}</span>
                      <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{t}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default IdeaExpandModal;
