import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Trophy, AlertCircle } from 'lucide-react';
import { compareIdeas } from '../services/geminiService.js';

function CompareModal({ ideaA, ideaB, onClose }) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let cancelled = false;
    compareIdeas(ideaA, ideaB)
      .then(r => { if (!cancelled) { setResult(r); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [ideaA.id, ideaB.id]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const winnerIdea = result?.winner === 'A' ? ideaA : ideaB;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] overflow-y-auto bg-[#05070B] px-4 pb-8 pt-24 sm:px-12 sm:pb-12 sm:pt-28"
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-6xl relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between gap-6 pb-10 border-b border-white/10 mb-10">
          <div className="flex-1">
            <button type="button" onClick={onClose} className="mb-6 flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
              <X size={16} /> Close Comparison
            </button>
            <h2 className="text-4xl font-bold tracking-tight text-slate-50">Head-to-Head Comparison</h2>
            <p className="mt-4 text-xl leading-relaxed text-purple-200/60">Evaluating market viability and strategy.</p>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 space-y-8">
          {/* Idea labels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[ideaA, ideaB].map((idea, idx) => (
              <div key={idea.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2">{idx === 0 ? 'Idea A' : 'Idea B'}</p>
                <p className="text-2xl font-bold text-slate-200 leading-snug">{idea.title}</p>
                <p className="mt-3 text-[15px] text-slate-400">{idea.headline}</p>
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-500">
              <Loader2 size={32} className="animate-spin text-purple-500" />
              <span className="text-[15px] font-medium">Running comparative analysis…</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6">
              <AlertCircle size={24} className="shrink-0 text-red-400" />
              <p className="text-[15px] text-red-300">{error}</p>
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Winner & Summary */}
              <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-28 z-20 bg-[#05070B] lg:bg-transparent pb-4 lg:pb-0">
                {/* Winner */}
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.05] p-8 text-center">
                  <Trophy size={40} className="mx-auto mb-4 text-yellow-400" />
                  <p className="text-[13px] font-bold uppercase tracking-widest text-yellow-600 mb-2">The Winner</p>
                  <p className="text-3xl font-bold text-yellow-300">{winnerIdea.title}</p>
                </div>

                {/* Summary */}
                {result.summary && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-4">Summary</p>
                    <p className="text-[16px] leading-relaxed text-slate-300">{result.summary}</p>
                  </div>
                )}

                {/* Recommendation */}
                {result.recommendation && (
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-8">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-blue-500 mb-4">Final Recommendation</p>
                    <p className="text-[16px] leading-relaxed text-slate-300">{result.recommendation}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Detailed Categories Table -> Responsive Cards */}
              <div className="lg:col-span-2">
                {result.categories?.length > 0 && (
                  <div className="flex flex-col gap-6">
                    {result.categories.map((cat, i) => (
                      <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                          <h3 className="text-[15px] font-semibold text-slate-200">{cat.label}</h3>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400 font-medium">
                            <Trophy size={11} className={cat.winner === 'A' || cat.winner === 'B' ? 'text-emerald-400' : 'text-slate-500'} />
                            Winner: {cat.winner}
                          </div>
                        </div>
                        
                        {/* Comparison Columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Idea A */}
                          <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${
                            cat.winner === 'A' ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-white/[0.04] bg-white/[0.01]'
                          }`}>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Idea A</p>
                            <p className={`text-[14px] sm:text-[15px] leading-relaxed ${
                              cat.winner === 'A' ? 'text-emerald-100 font-medium' : 'text-slate-400'
                            }`}>
                              {cat.a}
                            </p>
                          </div>

                          {/* Idea B */}
                          <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${
                            cat.winner === 'B' ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-white/[0.04] bg-white/[0.01]'
                          }`}>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Idea B</p>
                            <p className={`text-[14px] sm:text-[15px] leading-relaxed ${
                              cat.winner === 'B' ? 'text-emerald-100 font-medium' : 'text-slate-400'
                            }`}>
                              {cat.b}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CompareModal;
