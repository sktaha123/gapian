import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, Sparkles, Copy, Check, ExternalLink, Palette, BookOpen, Layers } from 'lucide-react';
import { compileMasterPrompt, formatIndexBlock, buildClaudeIntent } from '../prompts/masterPrompt.js';

import { minimalLuxury }    from '../prompts/styles/minimal-luxury.js';
import { darkPremium }      from '../prompts/styles/dark-premium.js';
import { modernCreator }    from '../prompts/styles/modern-creator.js';
import { futuristicAI }     from '../prompts/styles/futuristic-ai.js';
import { startupBlueprint } from '../prompts/styles/startup-blueprint.js';
import { coachingStyle }    from '../prompts/styles/coaching-style.js';

import { blackGold }     from '../prompts/themes/black-gold.js';
import { matteBlack }    from '../prompts/themes/matte-black.js';
import { purpleNeon }    from '../prompts/themes/purple-neon.js';
import { emeraldLuxury } from '../prompts/themes/emerald-luxury.js';
import { darkNavy }      from '../prompts/themes/dark-navy.js';

import { shortDepth }  from '../prompts/depth/short.js';
import { mediumDepth } from '../prompts/depth/medium.js';
import { longDepth }   from '../prompts/depth/long.js';
import { autoDepth }   from '../prompts/depth/auto.js';

// ── Data ──────────────────────────────────────────────────────────────────────

const STYLES = [
  { ...minimalLuxury,    color: '#94A3B8', initials: 'ML' },
  { ...darkPremium,      color: '#F8FAFC', initials: 'DP' },
  { ...modernCreator,    color: '#60A5FA', initials: 'MC' },
  { ...futuristicAI,     color: '#22D3EE', initials: 'FA' },
  { ...startupBlueprint, color: '#FB923C', initials: 'SB' },
  { ...coachingStyle,    color: '#C084FC', initials: 'HC' },
  {
    id: 'elegant-editorial', name: 'Elegant Editorial', aesthetic: 'Editorial · Refined',
    description: 'Newspaper-inspired hierarchy with typographic precision.',
    color: '#FDE68A', initials: 'EE',
    styleBlock: `STYLE DIRECTION — ELEGANT EDITORIAL:\n- Bold typographic contrast, editorial headline hierarchy.\n- Journalism meets luxury. Strong pull quotes and sidebar references.\n- Tone: Authoritative broadsheet meets premium lifestyle magazine.`,
  },
  {
    id: 'cyber-neon', name: 'Cyber Neon', aesthetic: 'Cyber · Edge',
    description: 'High-energy neon accents on a dark technological canvas.',
    color: '#4ADE80', initials: 'CN',
    styleBlock: `STYLE DIRECTION — CYBER NEON:\n- Electric, high-contrast formatting with neon accent labels.\n- System-style naming: PROTOCOL, MODULE, EXECUTION NODE.\n- Tone: Hacker playbook meets premium creator curriculum.`,
  },
  {
    id: 'startup-lean', name: 'Startup Blueprint', aesthetic: 'Lean · Tactical',
    description: 'Tactical lean startup voice for founders and builders.',
    color: '#F472B6', initials: 'ST',
    styleBlock: `STYLE DIRECTION — STARTUP:\n- Direct, metrics-driven, founder voice.\n- Sprint-style breakdowns. Ship fast, learn faster.\n- Tone: YC Demo Day meets premium course content.`,
  },
];

const THEMES = [
  { ...blackGold,     dot: '#C9A84C', ring: 'ring-yellow-500/40',  label: 'text-yellow-400',  bg: 'bg-yellow-500/[0.06]',  border: 'border-yellow-500/30' },
  { ...matteBlack,    dot: '#E2E8F0', ring: 'ring-slate-400/40',   label: 'text-slate-200',   bg: 'bg-white/[0.04]',       border: 'border-white/20' },
  { ...purpleNeon,    dot: '#8B5CF6', ring: 'ring-violet-500/40',  label: 'text-violet-400',  bg: 'bg-violet-500/[0.06]',  border: 'border-violet-500/30' },
  { ...emeraldLuxury, dot: '#10B981', ring: 'ring-emerald-500/40', label: 'text-emerald-400', bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/30' },
  { ...darkNavy,      dot: '#3B82F6', ring: 'ring-blue-500/40',    label: 'text-blue-400',    bg: 'bg-blue-500/[0.06]',    border: 'border-blue-500/30' },
  {
    id: 'white-blue', name: 'White & Blue', description: 'Clean white with vivid blue clarity.',
    dot: '#60A5FA', ring: 'ring-sky-500/40', label: 'text-sky-400', bg: 'bg-sky-500/[0.06]', border: 'border-sky-500/30',
    themeBlock: `COLOR THEME — WHITE & BLUE:\n- Base: Pure white with deep navy text. Accent: vivid blue. Stripe meets Linear.`,
  },
  {
    id: 'beige-minimal', name: 'Beige Minimal', description: 'Warm earth tones for organic appeal.',
    dot: '#D97706', ring: 'ring-amber-500/40', label: 'text-amber-400', bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/30',
    themeBlock: `COLOR THEME — BEIGE MINIMAL:\n- Base: Warm off-white, dark brown text. Accent: amber. Boutique wellness luxury.`,
  },
  {
    id: 'royal-red', name: 'Royal Red', description: 'Deep crimson & gold for bold authority.',
    dot: '#DC2626', ring: 'ring-red-500/40', label: 'text-red-400', bg: 'bg-red-500/[0.06]', border: 'border-red-500/30',
    themeBlock: `COLOR THEME — ROYAL RED:\n- Base: Deep crimson, cream text. Accent: royal red + gold. Fortune 500 authority.`,
  },
];

const DEPTHS = [
  { ...shortDepth },
  { ...mediumDepth },
  { ...longDepth },
  { id: 'xl', label: '60+ Pages', pages: 60, depthBlock: `DEPTH — EXTENDED:\n- Maximum depth. 15+ chapters, 10-15 worksheets, 6-8 bonuses.` },
  { ...autoDepth },
];

const PDF_STEPS = [
  { n: '01', title: 'Use the Cover Design Brief', body: 'Claude outputs a [COVER DESIGN BRIEF] block. Paste it into Canva, Adobe Express, or Book Bolt to generate a premium cover.', color: 'text-violet-400' },
  { n: '02', title: 'Paste into Google Docs',     body: 'The [H1] / [H2] / [CALLOUT] / [WORKSHEET] markers map directly to Google Docs heading styles — no manual formatting needed.', color: 'text-blue-400' },
  { n: '03', title: 'Use a Canva Ebook Template', body: 'Search Canva for "ebook template" matching your chosen theme color. Drop Claude\'s content into the template sections instantly.', color: 'text-emerald-400' },
  { n: '04', title: 'Generate Cover Art with AI', body: 'Use the Cover Design Brief as a prompt for Ideogram or Midjourney. Export at 2000×2800 px for standard ebook ratio.', color: 'text-amber-400' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

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
      {/* Preview monogram */}
      <div className="mb-4 flex h-14 w-full items-center justify-center rounded-xl border border-white/5 bg-[#0B1220]">
        <span
          className="text-[13px] font-black tracking-[0.3em] uppercase"
          style={{ color: style.color }}
        >
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

function ThemeButton({ theme, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(theme)}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
        active
          ? `${theme.border} ${theme.bg}`
          : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
      }`}
    >
      <span
        className={`h-3 w-3 shrink-0 rounded-full border border-white/20 ${active ? `ring-2 ring-offset-1 ring-offset-[#05070B] ${theme.ring}` : ''}`}
        style={{ background: theme.dot }}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-[12px] font-semibold leading-none ${active ? theme.label : 'text-slate-300'}`}>
          {theme.name}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-slate-600">{theme.description}</p>
      </div>
      {active && <Check size={11} className={`shrink-0 ${theme.label}`} />}
    </button>
  );
}

function DepthPill({ depth, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(depth)}
      className={`rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
        active
          ? 'border-blue-500/40 bg-blue-500/[0.07] shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
          : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
      }`}
    >
      <p className={`text-[14px] font-bold ${active ? 'text-blue-400' : 'text-slate-300'}`}>
        {depth.label}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500">
        {depth.pages ? (depth.pages >= 60 ? '60+ pages' : `~${depth.pages} pg`) : 'AI auto'}
      </p>
      {active && <div className="mt-2.5 h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500/80 to-transparent" />}
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

function ProductCreatorModal({ idea, blueprint, onBack, onClose }) {
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedDepth, setSelectedDepth] = useState(DEPTHS[1]);
  const [copied, setCopied] = useState(false);

  const compiledPrompt = compileMasterPrompt({
    productTitle:       idea.title,
    productSubtitle:    idea.headline,
    productDescription: idea.description,
    productAudience:    idea.audience,
    productPricing:     idea.pricing,
    productScore:       idea.score,
    productIndex:       formatIndexBlock(blueprint),
    style:  selectedStyle,
    theme:  selectedTheme,
    depth:  selectedDepth,
  });

  const { method, url } = buildClaudeIntent(compiledPrompt);
  const wordCount = compiledPrompt.split(/\s+/).length.toLocaleString();

  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(compiledPrompt); }
    catch {
      const el = Object.assign(document.createElement('textarea'), { value: compiledPrompt });
      document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const openClaude = async () => {
    if (method === 'clipboard') await copyPrompt();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1001] overflow-y-auto bg-[#05070B] px-4 pb-8 pt-20 sm:px-12 sm:pb-12 sm:pt-24"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Ambient glow — matches IdeaExpandModal */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">

        {/* ── Header ── matches IdeaExpandModal exactly */}
        <div className="flex items-start justify-between gap-6 pb-10 border-b border-white/10 mb-10">
          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={15} /> Blueprint
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors"
              >
                <X size={15} /> Close
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-400">
                Step 3
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Product Creation
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-slate-50">Product Creator</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-slate-400 max-w-2xl">
              Configure your product style, color theme, and depth.
              The master prompt compiles automatically — then export to Claude AI.
            </p>
          </div>

          {/* Quick export — top right */}
          <div className="hidden md:flex flex-col items-end gap-2 shrink-0 pt-8">
            <button
              type="button"
              onClick={openClaude}
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-500 hover:to-violet-500 hover:shadow-blue-500/30 hover:scale-[1.02]"
            >
              <Sparkles size={14} />
              {method === 'url' ? 'Open Claude (Auto-filled)' : 'Copy & Open Claude'}
              <ExternalLink size={13} />
            </button>
            <p className="text-[11px] text-slate-600">
              {method === 'url' ? '✓ Short enough to auto-fill' : '⚡ Prompt copied on open'}
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="space-y-10">

          {/* ── Style Selector ── */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Layers size={16} className="text-slate-400" />
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-100">Ebook Style</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">Writing voice, tone, and layout direction</p>
                </div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-slate-300">
                {selectedStyle.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {STYLES.slice(0, 5).map(s => (
                <StyleCard key={s.id} style={s} active={selectedStyle.id === s.id} onSelect={setSelectedStyle} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STYLES.slice(5).map(s => (
                <StyleCard key={s.id} style={s} active={selectedStyle.id === s.id} onSelect={setSelectedStyle} />
              ))}
            </div>
          </section>

          {/* ── Theme Selector ── */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Palette size={16} className="text-slate-400" />
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-100">Color Theme</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">Cover palette, visual identity, and aesthetic mood</p>
                </div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-slate-300">
                {selectedTheme.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {THEMES.map(t => (
                <ThemeButton key={t.id} theme={t} active={selectedTheme.id === t.id} onSelect={setSelectedTheme} />
              ))}
            </div>
          </section>

          {/* ── Depth Selector ── */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <BookOpen size={16} className="text-slate-400" />
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-100">Content Depth</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">Page count, chapter expansion, and bonus volume</p>
                </div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-slate-300">
                {selectedDepth.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {DEPTHS.map(d => (
                <DepthPill key={d.id} depth={d} active={selectedDepth.id === d.id} onSelect={setSelectedDepth} />
              ))}
            </div>
          </section>

          {/* ── PDF Guide ── matches the Section pattern from IdeaExpandModal */}
          <section>
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <p className="text-[14px] font-medium text-slate-200">How to Build a Professional PDF</p>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">4 Steps</span>
              </div>
              <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2">
                {PDF_STEPS.map(({ n, title, body, color }) => (
                  <div key={n} className="bg-[#05070B] px-6 py-5">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className={`text-[11px] font-black tabular-nums ${color}`}>{n}</span>
                      <span className="text-[13px] font-semibold text-slate-200">{title}</span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-slate-500">{body}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01]">
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  <span className="font-semibold text-blue-400">Pro tip:</span>{' '}
                  The compiled prompt includes a <span className="text-slate-300">[COVER DESIGN BRIEF]</span> and structural markers
                  (<span className="text-slate-300">[CALLOUT]</span>, <span className="text-slate-300">[WORKSHEET]</span>, <span className="text-slate-300">[PAGE BREAK]</span>)
                  designed to work with Canva ebook templates and Google Docs heading styles.
                </p>
              </div>
            </div>
          </section>

          {/* ── Prompt Preview ── */}
          <section>
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div>
                  <p className="text-[14px] font-medium text-slate-200">Compiled Master Prompt</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-500">
                      {selectedStyle.name} · {selectedTheme.name} · {selectedDepth.label} · ~{wordCount} words
                    </span>
                    {method === 'url'
                      ? <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">Auto-fills Claude</span>
                      : <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">Copy &amp; Paste</span>
                    }
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
                    copied
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <div className="max-h-44 overflow-y-auto px-6 py-4">
                <pre className="font-mono text-[11px] leading-relaxed text-slate-600 whitespace-pre-wrap break-words">
                  {compiledPrompt.slice(0, 1200)}<span className="text-slate-700">…</span>
                </pre>
              </div>
            </div>
          </section>

          {/* ── Export CTAs ── */}
          <section className="grid grid-cols-1 gap-3 pb-8 sm:grid-cols-2">
            <button
              type="button"
              onClick={openClaude}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-5 text-[15px] font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-500 hover:to-violet-500 hover:shadow-blue-500/30 hover:scale-[1.01]"
            >
              <Sparkles size={17} />
              {method === 'url' ? 'Open Claude (Auto-filled)' : 'Copy & Open Claude'}
              <ExternalLink size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              type="button"
              onClick={copyPrompt}
              className={`inline-flex items-center justify-center gap-2.5 rounded-2xl border px-8 py-5 text-[15px] font-bold transition-all duration-300 ${
                copied
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 bg-white/[0.02] text-slate-200 hover:bg-white/[0.05] hover:border-white/15 hover:text-white'
              }`}
            >
              {copied ? <><Check size={17} /> Prompt Copied!</> : <><Copy size={17} /> Copy Full Prompt</>}
            </button>
          </section>

        </div>
      </div>
    </motion.div>
  );
}

export default ProductCreatorModal;
