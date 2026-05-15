import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, AlertCircle, BookOpen, Gift, Award, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchProductBlueprint } from '../../services/geminiService.js';

function ChapterRow({ chapter, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className={`rounded-2xl border transition-all duration-300 ${open ? 'border-[#2D7DFF]/30 bg-[#2D7DFF]/[0.02]' : 'border-[#202635] bg-[#050505] hover:border-[#3A4352]'}`}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#111318] border border-[#202635] text-[12px] font-bold text-[#A0A7B4] tabular-nums">
          {String(index).padStart(2,'0')}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#F5F7FA] truncate">{chapter.title}</p>
          {chapter.subtitle && <p className="text-[12px] text-[#6E7685] mt-0.5 truncate">{chapter.subtitle}</p>}
        </div>
        <ChevronDown size={16} className={`shrink-0 text-[#6E7685] transition-transform ${open ? 'rotate-180 text-[#2D7DFF]' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.2}} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-[#202635] pt-4 space-y-4">
              {chapter.modules?.map((mod, mi) => (
                <div key={mi}>
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight size={14} className="text-[#2D7DFF] shrink-0"/>
                    <span className="text-[13px] font-semibold text-[#D9DEE7]">{mod.title}</span>
                  </div>
                  <ul className="pl-6 space-y-1.5">
                    {mod.sections?.map((s,si) => (
                      <li key={si} className="flex items-start gap-2 text-[12px] text-[#A0A7B4]">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#3A4352]"/>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {chapter.checklist && (
                <p className="mt-4 text-[12px] text-[#4B8DFF] rounded-lg border border-[#2D7DFF]/20 bg-[#2D7DFF]/10 px-4 py-3 font-medium">
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
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16 fade-up">
      <div className="mb-10 flex flex-col gap-2 border-b border-[#202635] pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D7DFF]">Step 3 — Product Blueprint</p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {idea.title}
        </h2>
        <p className="text-[15px] leading-relaxed text-[#A0A7B4]">
          {idea.headline}
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-6 py-32">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#2D7DFF]/20 blur-xl animate-pulse" />
            <Loader2 size={28} className="relative animate-spin text-[#4B8DFF]" />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[#F5F7FA]">Architecting Blueprint</p>
            <p className="mt-2 text-[14px] text-[#A0A7B4]">Structuring chapters, modules & bonuses…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#2D7DFF]/30 bg-[#2D7DFF]/10 p-5">
          <AlertCircle size={18} className="shrink-0 text-[#7AB6FF] mt-0.5" />
          <p className="text-[13px] text-[#D9DEE7]">{error}</p>
        </div>
      )}

      {bp && (
        <div className="space-y-12">
          {/* Chapters */}
          {bp.chapters?.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111318] border border-[#202635]">
                    <BookOpen size={15} className="text-[#4B8DFF]" />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#F5F7FA]">Product Index</h3>
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Chapters',  value: bp.chapters.length },
                  { label: 'Modules',   value: bp.chapters.reduce((s, c) => s + (c.modules?.length || 0), 0) },
                  { label: 'Sections',  value: bp.chapters.reduce((s, c) => s + c.modules?.reduce((ms, m) => ms + (m.sections?.length || 0), 0), 0) },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl border border-[#202635] bg-[#0B0B0F] px-4 py-3 text-center">
                    <p className="text-[22px] font-bold text-white tabular-nums">{stat.value}</p>
                    <p className="text-[11px] font-medium text-[#6E7685] uppercase tracking-[0.1em] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {bp.chapters.map((ch,i) => <ChapterRow key={i} chapter={ch} index={i+1} />)}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}

export default StepBlueprint;
