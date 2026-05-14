import { useEffect, useState } from 'react';
import { Type, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { fetchFontRecommendations } from '../../../services/geminiService.js';

function FontCard({ title, fontData }) {
  if (!fontData) return null;
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <a href={fontData.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Google Fonts <ExternalLink size={10} />
        </a>
      </div>
      <p className="mb-2 text-[28px] font-bold tracking-tight text-slate-100">{fontData.name}</p>
      <p className="mb-4 text-[13px] leading-relaxed text-slate-400">{fontData.why}</p>
      
      {/* Preview */}
      <div className="rounded-xl border border-white/[0.04] bg-[#05070B] p-5">
        <p className="text-[11px] text-slate-600 mb-2 uppercase tracking-widest font-mono">Preview</p>
        <p className="text-[18px] text-slate-300" style={{ fontFamily: `"${fontData.name}", sans-serif` }}>
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
  );
}

function StepFonts({ idea, data, updateData, onCanContinue }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data.fonts) { setLoading(false); onCanContinue(true); return; }
    let cancelled = false;
    setLoading(true);
    fetchFontRecommendations(idea)
      .then(f => { if (!cancelled) { updateData('fonts', f); setLoading(false); onCanContinue(true); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [idea.id]);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 3 — Font Guidance</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Typography Recommendations
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          We've analyzed your product's niche and audience to recommend the perfect typography pairing.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-5 py-24">
          <Loader2 size={24} className="animate-spin text-emerald-400" />
          <p className="text-[15px] font-medium text-slate-300">Analyzing typography trends for your niche...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5">
          <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
          <p className="text-[13px] text-red-300">{error}</p>
        </div>
      )}

      {data.fonts && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FontCard title="Heading Font" fontData={data.fonts.heading} />
          <FontCard title="Body Font" fontData={data.fonts.body} />
          <FontCard title="Accent Font" fontData={data.fonts.accent} />
        </div>
      )}
    </div>
  );
}

export default StepFonts;
