import { Target, Users, TrendingUp, DollarSign, BarChart2, Zap } from 'lucide-react';

const DIFFICULTY_CONFIG = {
  beginner:     { label: 'Beginner',     color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.06]', bar: 'bg-emerald-500', pct: 33 },
  intermediate: { label: 'Intermediate', color: 'text-blue-400',    border: 'border-blue-500/20',    bg: 'bg-blue-500/[0.06]',    bar: 'bg-blue-500',    pct: 66 },
  advanced:     { label: 'Advanced',     color: 'text-violet-400',  border: 'border-violet-500/20',  bg: 'bg-violet-500/[0.06]',  bar: 'bg-violet-500',  pct: 100 },
};

function MetaChip({ icon: Icon, label, value, accent = 'text-slate-300' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5">
      <Icon size={14} className="shrink-0 text-slate-500" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600">{label}</p>
        <p className={`mt-0.5 text-[13px] font-semibold ${accent} truncate`}>{value}</p>
      </div>
    </div>
  );
}

function StepOverview({ idea }) {
  const difficulty = idea.difficulty || 'intermediate';
  const diff = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.intermediate;
  const score = idea.score ?? 7;
  const scoreColor = score >= 8 ? 'text-emerald-400' : score >= 6 ? 'text-blue-400' : 'text-amber-400';

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">

      {/* Label */}
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 1 — Product Overview</p>

      {/* Title block */}
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{idea.title}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-slate-400">{idea.headline}</p>
        <p className="mt-4 text-[14px] leading-relaxed text-slate-500">{idea.description}</p>
      </div>

      {/* Meta grid */}
      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <MetaChip icon={Users}      label="Audience"     value={idea.audience || 'Creators'}      accent="text-slate-200" />
        <MetaChip icon={DollarSign} label="Pricing"      value={idea.pricing  || 'TBD'}            accent="text-emerald-400" />
        <MetaChip icon={TrendingUp} label="Monetization" value={idea.monetization || 'Digital sale'} accent="text-blue-400" />
        <MetaChip icon={Target}     label="Product Type" value={idea.productType || 'Ebook / Guide'} accent="text-slate-200" />
        <MetaChip icon={BarChart2}  label="Competition"  value={idea.competition || 'Medium'}       accent="text-amber-400" />
        <MetaChip icon={Zap}        label="Trend Strength" value={idea.trendStrength || 'Rising'}    accent="text-violet-400" />
      </div>

      {/* Score + Difficulty */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Market score */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Market Score</p>
          <div className="flex items-end gap-3">
            <span className={`text-4xl font-black tabular-nums ${scoreColor}`}>{score}</span>
            <span className="mb-1 text-[13px] text-slate-600">/ 10</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/5">
            <div
              className={`h-full rounded-full ${score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-blue-500' : 'bg-amber-500'}`}
              style={{ width: `${score * 10}%` }}
            />
          </div>
        </div>

        {/* Difficulty */}
        <div className={`rounded-2xl border ${diff.border} ${diff.bg} p-5`}>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Creation Difficulty</p>
          <p className={`text-[22px] font-bold ${diff.color}`}>{diff.label}</p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/5">
            <div className={`h-full rounded-full ${diff.bar}`} style={{ width: `${diff.pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepOverview;
