import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { DEPTHS } from './constants.js';

function DepthPill({ depth, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(depth)}
      className={`relative rounded-xl border px-4 py-4 text-left transition-all duration-200 ${
        active
          ? 'border-blue-500/40 bg-blue-500/[0.07] shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
          : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
      }`}
    >
      <p className={`text-[15px] font-bold ${active ? 'text-blue-400' : 'text-slate-200'}`}>
        {depth.label}
      </p>
      <p className="mt-1 text-[12px] text-slate-500">
        {depth.pages ? (depth.pages >= 60 ? '60+ pages' : `~${depth.pages} pg`) : 'AI determined'}
      </p>
      {active && <div className="mt-3 h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500/80 to-transparent" />}
    </button>
  );
}

function StepDepthSelector({ data, updateData, onCanContinue }) {
  const [selectedDepth, setSelectedDepth] = useState(data.depth || DEPTHS[1]); // default to medium

  useEffect(() => {
    updateData('depth', selectedDepth);
    onCanContinue(true);
  }, [selectedDepth]);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 5 — Content Depth</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Set Content Depth
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          This controls the page count, chapter expansion limits, and the volume of bonuses and worksheets included.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {DEPTHS.map(d => (
          <DepthPill key={d.id} depth={d} active={selectedDepth.id === d.id} onSelect={setSelectedDepth} />
        ))}
      </div>

      {/* Value preview grid based on selected depth */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6">
        <p className="mb-4 text-[13px] font-semibold text-slate-200">What you can expect:</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] text-slate-500">Chapters</p>
            <p className="text-[15px] font-semibold text-slate-300">
              {selectedDepth.id === 'short' ? '5-6' : selectedDepth.id === 'medium' ? '8-10' : selectedDepth.id === 'long' ? '12-14' : selectedDepth.id === 'xl' ? '15+' : 'Variable'}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Est. Pages</p>
            <p className="text-[15px] font-semibold text-slate-300">
              {selectedDepth.pages ? `~${selectedDepth.pages}` : 'Auto'}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Worksheets</p>
            <p className="text-[15px] font-semibold text-slate-300">
              {selectedDepth.id === 'short' ? '3-4' : selectedDepth.id === 'medium' ? '5-7' : selectedDepth.id === 'long' ? '8-10' : selectedDepth.id === 'xl' ? '12+' : 'Variable'}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-emerald-400/80">Retail Value</p>
            <p className="text-[15px] font-bold text-emerald-400">
              {selectedDepth.id === 'short' ? '$27-$47' : selectedDepth.id === 'medium' ? '$47-$97' : selectedDepth.id === 'long' ? '$97-$197' : selectedDepth.id === 'xl' ? '$197-$497' : 'Variable'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepDepthSelector;
