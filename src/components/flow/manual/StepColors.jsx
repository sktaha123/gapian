import { useEffect, useState } from 'react';
import { Palette, Loader2, AlertCircle } from 'lucide-react';
import { fetchColorPalette } from '../../../services/geminiService.js';

function ColorSwatch({ label, hex, description }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="h-12 w-12 shrink-0 rounded-lg border border-white/10" style={{ backgroundColor: hex }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p>
        <p className="text-[14px] font-mono font-bold text-slate-200 mt-0.5">{hex}</p>
        <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function StepColors({ idea, data, updateData, onCanContinue }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data.colors) { setLoading(false); onCanContinue(true); return; }
    let cancelled = false;
    setLoading(true);
    fetchColorPalette(idea)
      .then(c => { if (!cancelled) { updateData('colors', c); setLoading(false); onCanContinue(true); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [idea.id]);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 4 — Color Palette</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Color & Identity
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          A bespoke color palette designed to evoke the right emotional response from your target audience.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-5 py-24">
          <Loader2 size={24} className="animate-spin text-emerald-400" />
          <p className="text-[15px] font-medium text-slate-300">Generating psychological color profile...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5">
          <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
          <p className="text-[13px] text-red-300">{error}</p>
        </div>
      )}

      {data.colors && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6">
            <h3 className="text-[15px] font-bold text-slate-200 mb-2">Aesthetic Rationale</h3>
            <p className="text-[13px] leading-relaxed text-slate-400">{data.colors.rationale}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorSwatch label="Primary Color" hex={data.colors.primary} description="Main brand presence, key buttons" />
            <ColorSwatch label="Secondary Color" hex={data.colors.secondary} description="Supportive elements, cards, banners" />
            <ColorSwatch label="Accent Color" hex={data.colors.accent} description="Call to action, highlights, warnings" />
            <ColorSwatch label="Background Base" hex={data.colors.background} description="Page background, surface layers" />
          </div>
        </div>
      )}
    </div>
  );
}

export default StepColors;
