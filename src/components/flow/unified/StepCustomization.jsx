import { useEffect, useState, useRef } from 'react';
import { Mic, Settings, Palette, Type, DollarSign, Layers, BarChart2, Pipette } from 'lucide-react';

const PRICE_TIERS = [
  { id: 'quick',      name: 'Quick Win',   range: '$7–$27',    desc: 'Accessible, high-skim' },
  { id: 'mid',        name: 'Mid-Tier',    range: '$37–$97',   desc: 'Professional & structured' },
  { id: 'premium',    name: 'Premium',     range: '$147–$497', desc: 'Executive aesthetic' },
  { id: 'flagship',   name: 'Flagship',    range: '$497+',     desc: 'Publication-grade' },
];

const TONES = [
  { id: 'Authoritative',  name: 'Authoritative',  desc: 'Expert, formal, editorial' },
  { id: 'Conversational', name: 'Conversational', desc: 'Friendly, open, accessible' },
  { id: 'Analytical',     name: 'Analytical',     desc: 'Data-forward, precise' },
  { id: 'Visionary',      name: 'Visionary',      desc: 'Bold, forward-thinking' },
];

const FRAMEWORKS = [
  { id: 'action',           name: 'Action-Oriented',  desc: 'Steps, checklists, verb-led headers' },
  { id: 'first_principles', name: 'First Principles', desc: 'Core truths, concept tables' },
  { id: 'storybrand',       name: 'Narrative/Story',  desc: 'Hooks, pull quotes, emotional arc' },
  { id: 'pareto',           name: '80/20 Rule',       desc: 'Power 20% callouts, leverage focus' },
];

const DEPTHS = [
  { id: 'quick',       name: 'Quick Win',         desc: '5–10 pages' },
  { id: 'standard',    name: 'Standard Playbook', desc: '15–30 pages' },
  { id: 'masterclass', name: 'Masterclass',       desc: '40+ pages' },
];

const SCALE_RATIOS = [
  { id: 'minor-second',   label: '1.125', name: 'Subtle',   desc: 'Dense' },
  { id: 'major-second',   label: '1.250', name: 'Balanced', desc: 'Versatile' },
  { id: 'perfect-fourth', label: '1.333', name: 'Strong',   desc: 'Structured' },
  { id: 'golden-ratio',   label: '1.618', name: 'Dramatic', desc: 'Editorial' },
];

const COLORS = [
  // Dark family
  { id: 'midnight',    name: 'Midnight',     primary: '#111318', secondary: '#0B0B0F', accent: '#2D7DFF', text: '#F5F7FA' },
  { id: 'charcoal',    name: 'Charcoal',     primary: '#1A1A1A', secondary: '#141414', accent: '#E5E5E5', text: '#F5F7FA' },
  { id: 'graphite',    name: 'Graphite',     primary: '#1C1C24', secondary: '#14141C', accent: '#A0A7B4', text: '#F5F7FA' },
  { id: 'deep-navy',   name: 'Deep Navy',    primary: '#0A0F1E', secondary: '#070C18', accent: '#3B6FD4', text: '#F5F7FA' },
  // Blue family
  { id: 'ocean',       name: 'Ocean',        primary: '#0B0B0F', secondary: '#0F1724', accent: '#4B8DFF', text: '#F5F7FA' },
  { id: 'cobalt',      name: 'Cobalt',       primary: '#0D1526', secondary: '#0A1020', accent: '#2D7DFF', text: '#F5F7FA' },
  { id: 'slate',       name: 'Slate Blue',   primary: '#161B22', secondary: '#111318', accent: '#7AB6FF', text: '#F5F7FA' },
  // Accent color families
  { id: 'emerald',     name: 'Emerald',      primary: '#0A1410', secondary: '#0D1A14', accent: '#10B981', text: '#F5F7FA' },
  { id: 'forest',      name: 'Forest',       primary: '#0D150E', secondary: '#0A1009', accent: '#22C55E', text: '#F5F7FA' },
  { id: 'cyber',       name: 'Cyber',        primary: '#0F0B15', secondary: '#13101C', accent: '#8B5CF6', text: '#F5F7FA' },
  { id: 'crimson',     name: 'Crimson',      primary: '#150A0A', secondary: '#1C0D0D', accent: '#EF4444', text: '#F5F7FA' },
  { id: 'amber',       name: 'Amber',        primary: '#14100A', secondary: '#1A1408', accent: '#F59E0B', text: '#F5F7FA' },
  { id: 'rose',        name: 'Rose Gold',    primary: '#150D0F', secondary: '#1A1012', accent: '#FB7185', text: '#F5F7FA' },
  // Light
  { id: 'minimal',     name: 'Minimal',      primary: '#F5F7FA', secondary: '#E8ECF0', accent: '#111318', text: '#111318' },
];

const BRAND_ADJ = [
  'restrained','analytical','editorial','luxurious',
  'energetic','authoritative','cinematic','minimal',
  'instructional','premium','technical','academic',
];

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left w-full transition-all duration-200 ${
        active
          ? 'border-[#2D7DFF]/50 bg-[#2D7DFF]/10 shadow-[0_0_0_1px_rgba(45,125,255,0.15)]'
          : 'border-[#202635] bg-[#050505] hover:border-[#3A4352] hover:bg-[#0B0B0F]'
      }`}>
      {children}
    </button>
  );
}

// ─── Rich Live Preview ─────────────────────────────────────────────────────────
function LivePreview({ color, tone, framework, priceTier, depth, scaleRatio, brandAdjectives }) {
  const c = color || COLORS[0];
  const isDark = c.id !== 'minimal';
  const textMuted = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
  const textSub   = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)';
  const textMain  = c.text;
  const divider   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const cardBg    = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const calloutBg = c.accent + '18';

  return (
    <div className="overflow-hidden rounded-2xl border border-[#202635] shadow-2xl transition-all duration-500"
      style={{ background: c.primary }}>

      {/* Accent header bar */}
      <div className="h-[3px] w-full" style={{ background: c.accent }} />

      {/* Document shell */}
      <div className="p-5 space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Chapter label */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1" style={{ background: divider }} />
          <span style={{ color: c.accent, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Chapter 1
          </span>
          <div className="h-px flex-1" style={{ background: divider }} />
        </div>

        {/* Title */}
        <div style={{ color: textMain, fontSize: 18, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {tone?.name === 'Visionary' ? 'The Future of' : tone?.name === 'Analytical' ? 'Data-Driven' : ''} Mastery Framework
        </div>

        {/* Subtitle */}
        <div style={{ color: textSub, fontSize: 11, lineHeight: 1.7 }}>
          How high-performers eliminate guesswork and build systems that compound.
        </div>

        {/* Body lines */}
        <div className="space-y-1.5">
          {[1, 0.9, 0.75].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full" style={{ width: `${w * 100}%`, background: textMuted }} />
          ))}
        </div>

        {/* Callout box (varies by framework) */}
        <div className="rounded-lg px-3.5 py-3" style={{ background: calloutBg, borderLeft: `2px solid ${c.accent}` }}>
          <div style={{ color: c.accent, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            {framework?.name === '80/20 Rule' ? 'Power 20%' : framework?.name === 'Narrative/Story' ? 'Key Insight' : 'Pro Tip'}
          </div>
          <div className="space-y-1">
            {[0.95, 0.7].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: `${w * 100}%`, background: textMuted }} />
            ))}
          </div>
        </div>

        {/* Checklist (for action framework) */}
        {(framework?.id === 'action' || framework?.id === 'pareto') && (
          <div className="space-y-2">
            {['Step one complete', 'Step two in progress'].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-sm border" style={{ borderColor: c.accent, background: i === 0 ? c.accent + '30' : 'transparent' }} />
                <div className="h-1.5 rounded-full flex-1" style={{ background: textMuted, maxWidth: i === 0 ? '70%' : '50%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Pull quote (for narrative) */}
        {framework?.id === 'storybrand' && (
          <div className="pl-3" style={{ borderLeft: `2px solid ${c.accent}` }}>
            <div className="space-y-1">
              <div className="h-1.5 w-4/5 rounded-full" style={{ background: textMuted }} />
              <div className="h-1.5 w-3/5 rounded-full" style={{ background: textMuted }} />
            </div>
          </div>
        )}

        {/* Footer / page number */}
        <div className="flex items-center justify-between pt-1" style={{ borderTop: `1px solid ${divider}` }}>
          <div style={{ color: textMuted, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {priceTier?.name || 'Mid-Tier'} Edition
          </div>
          <div style={{ color: c.accent, fontSize: 10, fontWeight: 700 }}>01</div>
        </div>
      </div>

      {/* Spec strip */}
      <div className="grid grid-cols-3 divide-x" style={{ borderTop: `1px solid ${divider}`, divideColor: divider }}>
        {[
          { label: 'Scale',  value: scaleRatio?.label || '1.250' },
          { label: 'Depth',  value: depth?.name?.split(' ')[0] || 'Standard' },
          { label: 'Voice',  value: tone?.name?.slice(0,5) || 'Auth' },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center py-2.5" style={{ borderColor: divider }}>
            <span style={{ color: c.accent, fontSize: 11, fontWeight: 700 }}>{s.value}</span>
            <span style={{ color: textMuted, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function StepCustomization({ data, updateData, onCanContinue }) {
  const [priceTier,       setPriceTier]       = useState(data.priceTier       || PRICE_TIERS[1]);
  const [tone,            setTone]            = useState(data.tone            || TONES[0]);
  const [framework,       setFramework]       = useState(data.framework       || FRAMEWORKS[0]);
  const [color,           setColor]           = useState(data.color           || COLORS[0]);
  const [scaleRatio,      setScaleRatio]      = useState(data.scaleRatio      || SCALE_RATIOS[1]);
  const [depth,           setDepth]           = useState(data.depth           || DEPTHS[1]);
  const [brandAdjectives, setBrandAdjectives] = useState(data.brandAdjectives || '');
  const [activeAdj,       setActiveAdj]       = useState([]);
  const [customColor,     setCustomColor]     = useState({ bg: '', accent: '' });

  const toggleAdj = (adj) => {
    setActiveAdj(prev => {
      const next = prev.includes(adj) ? prev.filter(a => a !== adj) : [...prev, adj];
      setBrandAdjectives(next.join(', '));
      return next;
    });
  };

  useEffect(() => {
    updateData('customization', { priceTier, tone, framework, color, scaleRatio, depth, brandAdjectives });
    onCanContinue(true);
  }, [priceTier, tone, framework, color, scaleRatio, depth, brandAdjectives]);

  const labelCls = 'mb-3 text-[11px] font-bold uppercase tracking-[0.13em] text-[#6E7685]';
  const activeCard = (active) => active
    ? 'border-[#2D7DFF]/50 bg-[#2D7DFF]/10 shadow-[0_0_0_1px_rgba(45,125,255,0.15)]'
    : 'border-[#202635] bg-[#050505] hover:border-[#3A4352] hover:bg-[#0B0B0F]';

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 fade-up">

      {/* Header */}
      <div className="mb-10 border-b border-[#202635] pb-8">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D7DFF]">Step 2 — Specification Architecture</p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-2">Design System Configuration</h2>
        <p className="text-[15px] leading-relaxed text-[#A0A7B4] max-w-2xl">
          Configure the intelligence layer. Gapian AI engineers a 6-domain specification system — Claude receives exact structured instructions.
        </p>
      </div>

      {/* 2-col: Controls | Sticky Preview */}
      <div className="flex gap-8 items-start">

        {/* ─── LEFT: All Controls ─── */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* Price Positioning */}
          <div>
            <p className={labelCls}><DollarSign size={11} className="inline mr-1.5 text-[#2D7DFF]" />Price Positioning — shapes visual density & weight</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {PRICE_TIERS.map(p => {
                const active = priceTier?.id === p.id;
                return (
                  <button key={p.id} onClick={() => setPriceTier(p)}
                    className={`relative flex flex-col gap-1.5 rounded-xl border px-4 py-4 text-left transition-all duration-200 ${activeCard(active)}`}>
                    <span className={`font-mono text-[10px] font-bold ${active ? 'text-[#2D7DFF]' : 'text-[#3A4352]'}`}>{p.range}</span>
                    <span className={`text-[13px] font-bold ${active ? 'text-white' : 'text-[#D9DEE7]'}`}>{p.name}</span>
                    <span className="text-[11px] text-[#6E7685]">{p.desc}</span>
                    {active && <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#2D7DFF] shadow-[0_0_5px_rgba(45,125,255,0.9)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone + Framework */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <p className={labelCls}><Mic size={11} className="inline mr-1.5 text-[#2D7DFF]" />Voice & Tone</p>
              <div className="flex flex-col gap-2">
                {TONES.map(t => {
                  const active = tone?.id === t.id;
                  return (
                    <button key={t.id} onClick={() => setTone(t)}
                      className={`relative flex flex-col gap-0.5 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${activeCard(active)}`}>
                      <span className={`text-[13px] font-bold ${active ? 'text-white' : 'text-[#D9DEE7]'}`}>{t.name}</span>
                      <span className="text-[11px] text-[#6E7685]">{t.desc}</span>
                      {active && <div className="absolute right-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#2D7DFF] shadow-[0_0_5px_rgba(45,125,255,0.9)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className={labelCls}><Settings size={11} className="inline mr-1.5 text-[#2D7DFF]" />Teaching Framework</p>
              <div className="flex flex-col gap-2">
                {FRAMEWORKS.map(f => {
                  const active = framework?.id === f.id;
                  return (
                    <button key={f.id} onClick={() => setFramework(f)}
                      className={`relative flex flex-col gap-0.5 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${activeCard(active)}`}>
                      <span className={`text-[13px] font-bold ${active ? 'text-white' : 'text-[#D9DEE7]'}`}>{f.name}</span>
                      <span className="text-[11px] text-[#6E7685]">{f.desc}</span>
                      {active && <div className="absolute right-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#2D7DFF] shadow-[0_0_5px_rgba(45,125,255,0.9)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Depth */}
          <div>
            <p className={labelCls}><BarChart2 size={11} className="inline mr-1.5 text-[#2D7DFF]" />Content Depth</p>
            <div className="grid grid-cols-3 gap-2.5">
              {DEPTHS.map(d => {
                const active = depth?.id === d.id;
                return (
                  <button key={d.id} onClick={() => setDepth(d)}
                    className={`relative flex flex-col gap-1 rounded-xl border px-4 py-4 text-left transition-all duration-200 ${activeCard(active)}`}>
                    <span className={`text-[13px] font-bold ${active ? 'text-white' : 'text-[#D9DEE7]'}`}>{d.name}</span>
                    <span className="text-[11px] text-[#6E7685]">{d.desc}</span>
                    {active && <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#2D7DFF] shadow-[0_0_5px_rgba(45,125,255,0.9)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette + Custom */}
          <div>
            <p className={labelCls}><Palette size={11} className="inline mr-1.5 text-[#2D7DFF]" />Color Palette</p>
            {/* Preset swatches — 7 per row */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {COLORS.map(c => {
                const active = color?.id === c.id && !customColor.bg;
                return (
                  <button key={c.id} onClick={() => { setColor(c); setCustomColor({ bg: '', accent: '' }); }}
                    title={c.name}
                    className={`group flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all duration-200 ${active ? 'border-[#2D7DFF]/50 bg-[#2D7DFF]/10 shadow-[0_0_0_1px_rgba(45,125,255,0.15)]' : 'border-[#202635] bg-[#050505] hover:border-[#3A4352]'}`}>
                    <div className="flex h-8 w-full overflow-hidden rounded-lg border border-[#3A4352]/20">
                      <div className="flex-1" style={{ background: c.primary }} />
                      <div className="w-3 shrink-0" style={{ background: c.accent }} />
                    </div>
                    <span className={`text-[9px] font-semibold leading-none text-center ${active ? 'text-white' : 'text-[#6E7685]'}`}>{c.name}</span>
                    {active && <div className="h-1 w-1 rounded-full bg-[#2D7DFF] shadow-[0_0_4px_rgba(45,125,255,0.9)]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom hex pickers */}
            <div className="rounded-xl border border-[#202635] bg-[#050505] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6E7685] mb-3"><Pipette size={10} className="inline mr-1.5" />Custom Colors</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#6E7685] mb-1.5">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={customColor.bg || color?.primary || '#111318'}
                      onChange={e => {
                        const bg = e.target.value;
                        setCustomColor(p => ({ ...p, bg }));
                        setColor(prev => ({ ...prev, id: 'custom', name: 'Custom', primary: bg, secondary: bg + 'DD', text: '#F5F7FA' }));
                      }}
                      className="h-9 w-9 cursor-pointer rounded-lg border border-[#202635] bg-transparent p-0.5" />
                    <span className="font-mono text-[12px] text-[#A0A7B4]">{customColor.bg || color?.primary || '#111318'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-[#6E7685] mb-1.5">Accent</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={customColor.accent || color?.accent || '#2D7DFF'}
                      onChange={e => {
                        const acc = e.target.value;
                        setCustomColor(p => ({ ...p, accent: acc }));
                        setColor(prev => ({ ...prev, id: 'custom', name: 'Custom', accent: acc }));
                      }}
                      className="h-9 w-9 cursor-pointer rounded-lg border border-[#202635] bg-transparent p-0.5" />
                    <span className="font-mono text-[12px] text-[#A0A7B4]">{customColor.accent || color?.accent || '#2D7DFF'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Scale */}
          <div>
            <p className={labelCls}><Type size={11} className="inline mr-1.5 text-[#2D7DFF]" />Modular Type Scale</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {SCALE_RATIOS.map(s => {
                const active = scaleRatio?.id === s.id;
                return (
                  <button key={s.id} onClick={() => setScaleRatio(s)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3.5 text-center transition-all duration-200 ${activeCard(active)}`}>
                    <span className={`font-mono text-[16px] font-bold ${active ? 'text-[#2D7DFF]' : 'text-[#3A4352]'}`}>{s.label}</span>
                    <span className={`text-[12px] font-bold ${active ? 'text-white' : 'text-[#D9DEE7]'}`}>{s.name}</span>
                    <span className="text-[10px] text-[#6E7685]">{s.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Adjectives */}
          <div>
            <p className={labelCls}><Layers size={11} className="inline mr-1.5 text-[#2D7DFF]" />Brand Adjectives</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {BRAND_ADJ.map(adj => (
                <button key={adj} onClick={() => toggleAdj(adj)}
                  className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all duration-200 ${
                    activeAdj.includes(adj)
                      ? 'border-[#2D7DFF]/50 bg-[#2D7DFF]/10 text-[#7AB6FF]'
                      : 'border-[#202635] bg-[#050505] text-[#6E7685] hover:border-[#3A4352] hover:text-[#A0A7B4]'
                  }`}>{adj}</button>
              ))}
            </div>
            <input
              type="text" value={brandAdjectives}
              onChange={e => setBrandAdjectives(e.target.value)}
              placeholder="Or type custom adjectives…"
              className="w-full rounded-xl border border-[#202635] bg-[#050505] px-4 py-3 text-[14px] text-[#D9DEE7] placeholder-[#3A4352] outline-none transition-colors focus:border-[#2D7DFF]/40 focus:ring-1 focus:ring-[#2D7DFF]/10"
            />
          </div>

        </div>

        {/* ─── RIGHT: Sticky Preview ─── */}
        <div className="hidden lg:block w-[340px] shrink-0 sticky top-6 space-y-4">

          <LivePreview color={color} tone={tone} framework={framework}
            priceTier={priceTier} depth={depth} scaleRatio={scaleRatio}
            brandAdjectives={brandAdjectives} />

          {/* Spec summary */}
          <div className="rounded-2xl border border-[#202635] bg-[#0B0B0F] overflow-hidden">
            <div className="border-b border-[#202635] bg-[#111318]/60 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2D7DFF]">Live Specification</p>
            </div>
            <div className="divide-y divide-[#202635]">
              {[
                { label: 'Price',     value: `${priceTier?.name} (${priceTier?.range})` },
                { label: 'Voice',     value: tone?.name },
                { label: 'Framework', value: framework?.name },
                { label: 'Depth',     value: depth?.name },
                { label: 'Scale',     value: `${scaleRatio?.label} — ${scaleRatio?.name}` },
                { label: 'Bg',        value: color?.primary },
                { label: 'Accent',    value: color?.accent },
                { label: 'Brand',     value: brandAdjectives || '—' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#6E7685] shrink-0">{row.label}</span>
                  <div className="flex items-center gap-1.5">
                    {(row.label === 'Bg' || row.label === 'Accent') && (
                      <div className="h-3 w-3 rounded-full border border-[#3A4352]" style={{ background: row.value }} />
                    )}
                    <span className="font-mono text-[11px] font-semibold text-right text-[#D9DEE7] truncate">{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StepCustomization;
