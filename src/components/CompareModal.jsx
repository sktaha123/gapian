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
      className="fixed inset-0 z-[999] flex items-start justify-center bg-black/80 px-4 pb-10 pt-24 backdrop-blur-md sm:pt-32"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex w-full max-w-2xl flex-col rounded-2xl border border-white/[0.07] bg-[#080E1A] shadow-2xl"
        style={{ maxHeight: 'calc(100vh - 80px)' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl">
          <div className="absolute top-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[60px]" />
        </div>

        {/* Header — shrink-0 so it never scrolls */}
        <div className="relative shrink-0 flex items-center justify-between border-b border-white/[0.06] p-6 rounded-t-2xl">
          <h2 className="text-[18px] font-semibold text-slate-100">Head-to-Head Comparison</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-500 hover:bg-white/10 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body — scrolls independently */}
        <div className="relative flex-1 overflow-y-auto p-6 space-y-5">
          {/* Idea labels */}
          <div className="grid grid-cols-2 gap-4">
            {[ideaA, ideaB].map((idea, idx) => (
              <div key={idea.id} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">{idx === 0 ? 'Idea A' : 'Idea B'}</p>
                <p className="text-[14px] font-semibold text-slate-200 leading-snug">{idea.title}</p>
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-3 py-10 text-slate-500">
              <Loader2 size={18} className="animate-spin text-purple-400" />
              <span className="text-[14px]">Comparing ideas…</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <p className="text-[13px] text-red-300">{error}</p>
            </div>
          )}

          {result && (
            <>
              {/* Winner */}
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.05] p-5 text-center">
                <Trophy size={20} className="mx-auto mb-2 text-yellow-400" />
                <p className="text-[12px] font-semibold uppercase tracking-widest text-yellow-600 mb-1">Winner</p>
                <p className="text-[18px] font-bold text-yellow-300">{winnerIdea.title}</p>
              </div>

              {/* Summary */}
              {result.summary && (
                <p className="text-[14px] leading-relaxed text-slate-400">{result.summary}</p>
              )}

              {/* Category table */}
              {result.categories?.length > 0 && (
                <div className="rounded-xl border border-white/6 overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-4 py-3 text-left font-medium text-slate-500">Category</th>
                        <th className="px-4 py-3 text-center font-medium text-slate-400">A</th>
                        <th className="px-4 py-3 text-center font-medium text-slate-400">B</th>
                        <th className="px-4 py-3 text-center font-medium text-slate-500">
                          <Trophy size={13} className="mx-auto text-yellow-500/70" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.categories.map((cat, i) => (
                        <tr key={i} className="border-b border-white/[0.04] last:border-0">
                          <td className="px-4 py-3 text-slate-400 font-medium">{cat.label}</td>
                          <td className={`px-4 py-3 text-center ${cat.winner === 'A' ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>{cat.a}</td>
                          <td className={`px-4 py-3 text-center ${cat.winner === 'B' ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>{cat.b}</td>
                          <td className="px-4 py-3 text-center text-slate-400">{cat.winner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Recommendation */}
              {result.recommendation && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-500 mb-2">Recommendation</p>
                  <p className="text-[14px] leading-relaxed text-slate-300">{result.recommendation}</p>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CompareModal;
