import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { STYLES } from './constants.js';

function StyleCard({ style, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(style)}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
        active
          ? 'border-white/20 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_24px_rgba(0,0,0,0.4)]'
          : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]'
      }`}
    >
      <div className="mb-4 flex h-14 w-full items-center justify-center rounded-xl border border-white/5 bg-[#0B1220]">
        <span className="text-[13px] font-black tracking-[0.3em] uppercase" style={{ color: style.color }}>
          {style.initials}
        </span>
      </div>
      <p className="text-[13px] font-semibold text-slate-100">{style.name}</p>
      <p className="mt-1 text-[11px] leading-snug text-slate-500">{style.description}</p>
      <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: style.color }}>
        {style.aesthetic}
      </p>
      {active && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
          <Check size={10} className="text-white" />
        </span>
      )}
    </button>
  );
}

function StepStyleSelector({ data, updateData, onCanContinue }) {
  const [selectedStyle, setSelectedStyle] = useState(data.style || STYLES[0]);

  useEffect(() => {
    updateData('style', selectedStyle);
    onCanContinue(true);
  }, [selectedStyle]);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 3 — Ebook Style</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Choose a Visual Style
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          This controls the writing voice, tone, formatting behavior, and layout direction of your product.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {STYLES.map(s => (
          <StyleCard key={s.id} style={s} active={selectedStyle.id === s.id} onSelect={setSelectedStyle} />
        ))}
      </div>
    </div>
  );
}

export default StepStyleSelector;
