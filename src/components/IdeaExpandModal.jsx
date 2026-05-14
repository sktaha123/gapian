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

    // Scroll lock
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const scoreColor = idea.score >= 8 ? '#10B981' : idea.score >= 6 ? '#3B82F6' : '#F59E0B';

    return (
      <motion.div
        className="fixed inset-0 z-[1000] overflow-y-auto bg-[#05070B] px-4 pb-8 pt-24 sm:px-12 sm:pb-12 sm:pt-28"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="mx-auto w-full max-w-5xl relative">
          
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between gap-6 pb-10 border-b border-white/10 mb-10">
            <div className="flex-1">
              <button type="button" onClick={onClose} className="mb-6 flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
                <X size={16} /> Close Analysis
              </button>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {idea.tags?.map(t => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t}</span>
                ))}
                <span className="rounded-full px-3 py-1.5 text-[12px] font-bold"
                  style={{ background: `${scoreColor}12`, color: scoreColor, border: `1px solid ${scoreColor}20` }}>
                  Score: {idea.score}/10
                </span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-50">{idea.title}</h2>
              <p className="mt-4 text-xl leading-relaxed text-blue-200/60">{idea.headline}</p>
            </div>
          </div>

          {/* Body */}
          <div className="relative z-10 space-y-8">
            {/* Overview */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Core Concept</h3>
              <p className="text-[16px] leading-relaxed text-slate-300">{idea.description}</p>
              <div className="flex flex-wrap gap-8 pt-6 border-t border-white/5 mt-6">
                <div><span className="block text-[11px] uppercase tracking-widest text-slate-500 mb-1">Suggested Pricing</span><span className="text-lg font-medium text-slate-200">{idea.pricing}</span></div>
                <div><span className="block text-[11px] uppercase tracking-widest text-slate-500 mb-1">Target Audience</span><span className="text-lg font-medium text-slate-200">{idea.audience}</span></div>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-500">
                <Loader2 size={32} className="animate-spin text-blue-500" />
                <span className="text-[15px] font-medium">Running deep market analysis…</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6">
                <AlertCircle size={24} className="shrink-0 text-red-400" />
                <p className="text-[15px] text-red-300">{error}</p>
              </div>
            )}

            {details && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {/* Competitors */}
                  <Section title="Competitors & Market Gap" icon={<Search size={18} className="text-blue-400" />} defaultOpen>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {details.competitors?.map(c => (
                        <span key={c} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[13px] text-slate-300">{c}</span>
                      ))}
                    </div>
                    {details.gap && <p className="text-[14px] leading-relaxed text-slate-400 border-t border-white/5 pt-4">{details.gap}</p>}
                  </Section>

                  {/* Revenue */}
                  <Section title="Revenue Estimate" icon={<TrendingUp size={18} className="text-emerald-400" />} defaultOpen>
                    <p className="text-2xl font-bold text-emerald-400">{details.revenueEstimate}</p>
                  </Section>
                  
                  {/* Roadmap */}
                  <Section title="30 / 60 / 90 Day Roadmap" icon={<MapPin size={18} className="text-purple-400" />} defaultOpen>
                    <div className="space-y-6">
                      {['day30', 'day60', 'day90'].map((key, idx) => (
                        <div key={key}>
                          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-slate-500">{['Phase 1: Day 1–30', 'Phase 2: Day 31–60', 'Phase 3: Day 61–90'][idx]}</p>
                          <ul className="space-y-2.5">
                            {details.roadmap?.[key]?.map((step, i) => (
                              <li key={i} className="flex items-start gap-3 text-[14px] text-slate-300">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>

                <div className="space-y-8">
                  {/* SEO */}
                  <Section title="SEO Keywords" icon={<Search size={18} className="text-yellow-400" />} defaultOpen>
                    <div className="flex flex-wrap gap-2">
                      {details.seoKeywords?.map(k => (
                        <span key={k} className="rounded-full border border-yellow-500/20 bg-yellow-500/[0.06] px-3.5 py-1.5 text-[13px] text-yellow-300">{k}</span>
                      ))}
                    </div>
                  </Section>

                  {/* Email Subjects */}
                  <Section title="Email Subject Lines" icon={<Mail size={18} className="text-pink-400" />} defaultOpen>
                    <ul className="space-y-3">
                      {details.emailSubjects?.map((s, i) => (
                        <li key={i} className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3 text-[14px] text-slate-300">{s}</li>
                      ))}
                    </ul>
                  </Section>

                  {/* Twitter Thread */}
                  <Section title="Twitter/X Thread" icon={<Twitter size={18} className="text-sky-400" />} defaultOpen>
                    <div className="space-y-3">
                      {details.twitterThread?.map((t, i) => (
                        <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-sky-500">Tweet {i + 1}</span>
                          <p className="mt-2 text-[14px] leading-relaxed text-slate-300">{t}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  export default IdeaExpandModal;
