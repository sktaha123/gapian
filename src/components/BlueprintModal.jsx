import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Loader2, ArrowRight, Target, Users, Zap, TrendingUp, BookOpen,
  Gift, Award, ChevronDown, ChevronRight, Sparkles, AlertCircle, Copy, Check, FileText
} from 'lucide-react';
import { fetchProductBlueprint } from '../services/geminiService.js';
import { formatIndexBlock } from '../prompts/masterPrompt.js';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, accent = 'blue' }) {
  const accents = {
    blue:    { icon: 'text-blue-400',    border: 'border-blue-500/10',   bg: 'bg-blue-500/[0.03]' },
    purple:  { icon: 'text-purple-400',  border: 'border-purple-500/10', bg: 'bg-purple-500/[0.03]' },
    emerald: { icon: 'text-emerald-400', border: 'border-emerald-500/10',bg: 'bg-emerald-500/[0.03]' },
    amber:   { icon: 'text-amber-400',   border: 'border-amber-500/10',  bg: 'bg-amber-500/[0.03]' },
  };
  const c = accents[accent] || accents.blue;
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className={c.icon}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      </div>
      <p className="text-[14px] leading-relaxed text-slate-300">{value}</p>
    </div>
  );
}

function ChapterRow({ chapter, index, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border transition-colors duration-200 ${open ? 'border-white/10 bg-white/[0.02]' : 'border-white/5 hover:border-white/8'}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0B1220] border border-white/5 text-[12px] font-bold text-slate-400 tabular-nums">
          {String(index).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-slate-200 truncate">{chapter.title}</p>
          {chapter.subtitle && <p className="text-[12px] text-slate-500 mt-0.5 truncate">{chapter.subtitle}</p>}
        </div>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-4">
              {chapter.modules?.map((mod, mi) => (
                <div key={mi}>
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight size={12} className="text-blue-400 shrink-0" />
                    <span className="text-[13px] font-semibold text-slate-300">{mod.title}</span>
                  </div>
                  <ul className="pl-5 space-y-1.5">
                    {mod.sections?.map((sec, si) => (
                      <li key={si} className="flex items-start gap-2.5 text-[12px] text-slate-500 leading-relaxed">
                        <span className="mt-2 h-[3px] w-[3px] shrink-0 rounded-full bg-slate-600" />
                        {sec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {chapter.checklist && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-2.5">
                  <span className="text-[12px] text-emerald-500">✓</span>
                  <span className="text-[12px] text-emerald-400/80">{chapter.checklist}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const BONUS_STYLES = {
  'worksheet':   { pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20',    icon: '◧' },
  'template':    { pill: 'bg-violet-500/10 text-violet-400 border-violet-500/20', icon: '⊞' },
  'swipe-file':  { pill: 'bg-pink-500/10 text-pink-400 border-pink-500/20',    icon: '≡' },
  'prompt-pack': { pill: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',    icon: '◈' },
  'resource':    { pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: '◉' },
  'checklist':   { pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '✓' },
};

function SectionHeading({ icon, title, badge }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03]">
        {icon}
      </div>
      <div>
        <h3 className="text-[15px] font-semibold text-slate-100">{title}</h3>
      </div>
      {badge && (
        <span className="ml-auto rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-slate-400">
          {badge}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

function BlueprintModal({ idea, path = 'ai', onClose, onContinue }) {
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [copied, setCopied]       = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setBlueprint(null);
    fetchProductBlueprint(idea)
      .then(d  => { if (!cancelled) { setBlueprint(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [idea.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleCopyGuide = async () => {
    if (!blueprint) return;
    const text = [
      `PRODUCT: ${idea.title}`,
      `${idea.headline}`,
      ``,
      `DESCRIPTION: ${idea.description}`,
      `AUDIENCE: ${idea.audience}`,
      `PRICING: ${idea.pricing}`,
      ``,
      formatIndexBlock(blueprint),
    ].join('\n');
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] overflow-y-auto bg-[#05070B]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
    >
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-80 w-80 rounded-full bg-blue-600/4 blur-[100px]" />
      </div>

      {/* Fixed top bar */}
      <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#05070B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-200 transition-colors"
            >
              <X size={15} />
              <span>Close</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                path === 'manual'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-violet-500/30 bg-violet-500/10 text-violet-400'
              }`}>Step 2</span>
              <span className="text-[13px] font-medium text-slate-400">Product Blueprint</span>
              <span className="text-[11px] text-slate-600">—</span>
              <span className="text-[11px] text-slate-500">{path === 'manual' ? 'Manual Guide' : 'AI Creation'}</span>
            </div>
          </div>
          {blueprint && path === 'ai' && (
            <button
              type="button"
              onClick={() => onContinue(blueprint)}
              className="group hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:from-violet-500 hover:to-blue-500"
            >
              Continue
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          )}
          {blueprint && path === 'manual' && (
            <button
              type="button"
              onClick={handleCopyGuide}
              className={`hidden sm:inline-flex items-center gap-2 rounded-xl border px-5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                copied
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy Blueprint</>}
            </button>
          )}
        </div>
      </div>

      {/* Page content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-12">

        {/* Title block */}
        <div className="mb-10 border-b border-white/[0.06] pb-10">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{idea.audience}</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{idea.title}</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-slate-400 max-w-3xl">{idea.headline}</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-5 py-32">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-violet-500/20 bg-violet-500/5" />
              <div className="absolute inset-0 rounded-full bg-violet-500/8 blur-lg" />
              <Loader2 size={24} className="relative animate-spin text-violet-400" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-medium text-slate-200">Architecting your product blueprint</p>
              <p className="mt-1.5 text-[13px] text-slate-500">Generating chapters, modules, and bonus content…</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-4 rounded-2xl border border-red-500/15 bg-red-500/[0.05] p-6">
            <AlertCircle size={20} className="shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="text-[14px] font-medium text-red-300">Blueprint generation failed</p>
              <p className="mt-1 text-[13px] text-red-400/70 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Blueprint content */}
        {blueprint && (
          <div className="space-y-12">

            {/* ── Overview ───────────────────────────────────────────── */}
            <section>
              <SectionHeading
                icon={<Target size={16} className="text-blue-400" />}
                title="Product Overview"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {blueprint.overview?.goal && (
                  <StatCard icon={<Target size={14} />} label="Core Goal" value={blueprint.overview.goal} accent="blue" />
                )}
                {blueprint.overview?.audience && (
                  <StatCard icon={<Users size={14} />} label="Target Audience" value={blueprint.overview.audience} accent="purple" />
                )}
                {blueprint.overview?.transformation && (
                  <StatCard icon={<Zap size={14} />} label="Transformation" value={blueprint.overview.transformation} accent="amber" />
                )}
                {blueprint.overview?.monetization && (
                  <StatCard icon={<TrendingUp size={14} />} label="Monetization Potential" value={blueprint.overview.monetization} accent="emerald" />
                )}
              </div>

              {/* Positioning + Problems */}
              <div className="mt-3 space-y-3">
                {blueprint.overview?.positioning && (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Market Positioning</p>
                    <p className="text-[14px] leading-relaxed text-slate-300">{blueprint.overview.positioning}</p>
                  </div>
                )}
                {blueprint.overview?.problemsSolved?.length > 0 && (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Problems Solved</p>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.overview.problemsSolved.map((p, i) => (
                        <span key={i} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[12px] text-slate-400">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ── Chapters ───────────────────────────────────────────── */}
            {blueprint.chapters?.length > 0 && (
              <section>
                <SectionHeading
                  icon={<BookOpen size={16} className="text-violet-400" />}
                  title="Complete Product Index"
                  badge={`${blueprint.chapters.length} Chapters`}
                />
                <div className="space-y-2">
                  {blueprint.chapters.map((ch, i) => (
                    <ChapterRow key={i} chapter={ch} index={i + 1} defaultOpen={i === 0} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Bonuses ────────────────────────────────────────────── */}
            {blueprint.bonuses?.length > 0 && (
              <section>
                <SectionHeading
                  icon={<Gift size={16} className="text-amber-400" />}
                  title="Bonus Content"
                  badge={`${blueprint.bonuses.length} Bonuses`}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {blueprint.bonuses.map((bonus, i) => {
                    const s = BONUS_STYLES[bonus.type] || BONUS_STYLES['resource'];
                    return (
                      <div key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/10 transition-colors duration-200">
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <p className="text-[14px] font-semibold text-slate-200 leading-snug">{bonus.title}</p>
                          <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${s.pill}`}>
                            {bonus.type || 'bonus'}
                          </span>
                        </div>
                        {bonus.description && (
                          <p className="text-[12px] text-slate-500 leading-relaxed">{bonus.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Positioning ────────────────────────────────────────── */}
            {blueprint.positioning && (
              <section>
                <SectionHeading
                  icon={<Award size={16} className="text-emerald-400" />}
                  title="Product Positioning"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Audience Level',        value: blueprint.positioning.level },
                    { label: 'Premium Angle',         value: blueprint.positioning.premiumAngle },
                    { label: 'Authority Positioning', value: blueprint.positioning.authority },
                    { label: 'Value Perception',      value: blueprint.positioning.perception },
                  ].filter(row => row.value).map((row, i) => (
                    <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{row.label}</p>
                      <p className="text-[14px] leading-relaxed text-slate-300">{row.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Bottom CTA ── */}
            <div className="flex flex-col items-center gap-4 border-t border-white/[0.06] pt-10 pb-4">
              {path === 'ai' ? (
                <>
                  <div className="text-center space-y-1.5">
                    <p className="text-[15px] font-semibold text-slate-200">Ready to build this product?</p>
                    <p className="text-[13px] text-slate-500">Configure style, theme, and depth — then export to Claude AI.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onContinue(blueprint)}
                    className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-[14px] font-bold text-white shadow-lg shadow-violet-500/15 transition-all duration-200 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/25 hover:scale-[1.01]"
                  >
                    <Sparkles size={16} />
                    Continue Product Creation
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center space-y-1.5">
                    <p className="text-[15px] font-semibold text-slate-200">Your blueprint is ready.</p>
                    <p className="text-[13px] text-slate-500">Copy the full guide and start building your product manually.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyGuide}
                      className={`group inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-[14px] font-bold transition-all duration-200 border ${
                        copied
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300 hover:bg-emerald-500/15 hover:scale-[1.01]'
                      }`}
                    >
                      {copied ? <><Check size={16} /> Blueprint Copied!</> : <><Copy size={16} /> Copy Full Blueprint</>}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.02] px-8 py-4 text-[14px] font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      <FileText size={16} /> Done
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BlueprintModal;
