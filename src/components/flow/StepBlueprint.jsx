import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, AlertCircle, BookOpen, Gift, Award, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchProductBlueprint } from '../../services/geminiService.js';

function ChapterRow({ chapter, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className={`rounded-2xl border transition-colors ${open ? 'border-white/8 bg-white/[0.02]' : 'border-white/[0.04] hover:border-white/[0.06]'}`}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0B1220] border border-white/5 text-[11px] font-bold text-slate-500 tabular-nums">
          {String(index).padStart(2,'0')}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-200 truncate">{chapter.title}</p>
          {chapter.subtitle && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{chapter.subtitle}</p>}
        </div>
        <ChevronDown size={14} className={`shrink-0 text-slate-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.2}} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-white/[0.04] pt-3 space-y-3">
              {chapter.modules?.map((mod, mi) => (
                <div key={mi}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <ChevronRight size={11} className="text-blue-400 shrink-0"/>
                    <span className="text-[12px] font-semibold text-slate-300">{mod.title}</span>
                  </div>
                  <ul className="pl-4 space-y-1">
                    {mod.sections?.map((s,si) => (
                      <li key={si} className="flex items-start gap-2 text-[11px] text-slate-500">
                        <span className="mt-1.5 h-[3px] w-[3px] shrink-0 rounded-full bg-slate-700"/>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {chapter.checklist && (
                <p className="text-[11px] text-emerald-400/70 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] px-3 py-2">
                  Checklist: {chapter.checklist}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const BONUS_COLORS = {
  'worksheet':   'text-blue-400 border-blue-500/20 bg-blue-500/[0.04]',
  'template':    'text-violet-400 border-violet-500/20 bg-violet-500/[0.04]',
  'swipe-file':  'text-pink-400 border-pink-500/20 bg-pink-500/[0.04]',
  'prompt-pack': 'text-cyan-400 border-cyan-500/20 bg-cyan-500/[0.04]',
  'resource':    'text-amber-400 border-amber-500/20 bg-amber-500/[0.04]',
  'checklist':   'text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.04]',
};

function StepBlueprint({ idea, data, updateData, onCanContinue }) {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (data.blueprint) { setLoading(false); onCanContinue(true); return; }
    let cancelled = false;
    setLoading(true);
    fetchProductBlueprint(idea)
      .then(bp => { if (!cancelled) { updateData('blueprint', bp); setLoading(false); onCanContinue(true); } })
      .catch(e  => { if (!cancelled) { setError(e.message);        setLoading(false); } });
    return () => { cancelled = true; };
  }, [idea.id]);

  const bp = data.blueprint;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Product Blueprint</p>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-50">{idea.title}</h2>
      <p className="mb-10 text-[14px] text-slate-400 border-b border-white/[0.06] pb-10">{idea.headline}</p>

      {loading && (
        <div className="flex flex-col items-center gap-5 py-24">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-blue-500/8 blur-lg" />
            <Loader2 size={22} className="relative animate-spin text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-medium text-slate-200">Building your product blueprint</p>
            <p className="mt-1 text-[13px] text-slate-500">Architecting chapters, modules & bonuses…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5">
          <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
          <p className="text-[13px] text-red-300">{error}</p>
        </div>
      )}

      {bp && (
        <div className="space-y-10">
          {/* Chapters */}
          {bp.chapters?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <BookOpen size={15} className="text-violet-400" />
                <h3 className="text-[14px] font-semibold text-slate-200">Product Index</h3>
                <span className="ml-auto text-[11px] text-slate-600">{bp.chapters.length} chapters</span>
              </div>
              <div className="space-y-2">
                {bp.chapters.map((ch,i) => <ChapterRow key={i} chapter={ch} index={i+1} />)}
              </div>
            </section>
          )}

          {/* Bonuses */}
          {bp.bonuses?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Gift size={15} className="text-amber-400" />
                <h3 className="text-[14px] font-semibold text-slate-200">Bonus Content</h3>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {bp.bonuses.map((b,i) => {
                  const c = BONUS_COLORS[b.type] || BONUS_COLORS['resource'];
                  return (
                    <div key={i} className={`rounded-xl border p-4 ${c}`}>
                      <p className="text-[13px] font-semibold mb-1">{b.title}</p>
                      {b.description && <p className="text-[11px] opacity-70 leading-relaxed">{b.description}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Positioning */}
          {bp.positioning && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Award size={15} className="text-emerald-400" />
                <h3 className="text-[14px] font-semibold text-slate-200">Product Positioning</h3>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { label: 'Level',          value: bp.positioning.level },
                  { label: 'Premium Angle',  value: bp.positioning.premiumAngle },
                  { label: 'Authority',      value: bp.positioning.authority },
                  { label: 'Value Perception', value: bp.positioning.perception },
                ].filter(r => r.value).map((r,i) => (
                  <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600 mb-1">{r.label}</p>
                    <p className="text-[13px] text-slate-300">{r.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default StepBlueprint;
