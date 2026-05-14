import { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { compileMasterPrompt, formatIndexBlock, buildClaudeIntent } from '../../../prompts/masterPrompt.js';

const PDF_STEPS = [
  { n: '01', title: 'Use the Cover Design Brief', body: 'Claude outputs a [COVER DESIGN BRIEF] block. Paste it into Ideogram or Canva to generate a premium cover.', color: 'text-violet-400' },
  { n: '02', title: 'Paste into Google Docs',     body: 'The [H1]/[CALLOUT]/[WORKSHEET] markers map directly to heading styles — no manual formatting needed.', color: 'text-blue-400' },
  { n: '03', title: 'Use an Ebook Template',      body: 'Search Canva for an ebook template matching your chosen theme color. Drop content directly into the sections.', color: 'text-emerald-400' },
];

function StepFinalPrompt({ idea, data }) {
  const [copied, setCopied] = useState(false);
  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [methodInfo, setMethodInfo] = useState({ method: 'clipboard', url: 'https://claude.ai/new' });
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const p = compileMasterPrompt({
      productTitle: idea.title,
      productSubtitle: idea.headline,
      productDescription: idea.description,
      productAudience: idea.audience,
      productPricing: idea.pricing,
      productScore: idea.score,
      productIndex: formatIndexBlock(data.blueprint),
      style: data.style,
      theme: data.theme,
      depth: data.depth,
    });
    setCompiledPrompt(p);
    setMethodInfo(buildClaudeIntent(p));
    setWordCount(p.split(/\s+/).length.toLocaleString());
  }, [idea, data]);

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
    if (methodInfo.method === 'clipboard') await copyPrompt();
    window.open(methodInfo.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 6 — Final Execution</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Your Master Prompt is Ready
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          We've compiled your blueprint, style, theme, and depth into a highly structured system prompt.
        </p>
      </div>

      <div className="space-y-6">
        {/* PDF Guide */}
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.01]">
            <p className="text-[14px] font-medium text-slate-200">How to get a professional PDF</p>
          </div>
          <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-3">
            {PDF_STEPS.map(({ n, title, body, color }) => (
              <div key={n} className="bg-[#05070B] px-6 py-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[12px] font-black tabular-nums ${color}`}>{n}</span>
                  <span className="text-[13px] font-semibold text-slate-200">{title}</span>
                </div>
                <p className="text-[12px] leading-relaxed text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Preview */}
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01]">
            <div>
              <p className="text-[14px] font-medium text-slate-200">Compiled Prompt</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-slate-500">
                  {data.style?.name} · {data.theme?.name} · {data.depth?.label} · ~{wordCount} words
                </span>
                {methodInfo.method === 'url' ? (
                  <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">Auto-fills URL</span>
                ) : (
                  <span className="rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400">Copy & Paste</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={copyPrompt}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                copied ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto px-6 py-4">
            <pre className="font-mono text-[11px] leading-relaxed text-slate-500 whitespace-pre-wrap break-words">
              {compiledPrompt.slice(0, 1500)}
              <span className="text-slate-600">... [Content truncated for preview]</span>
            </pre>
          </div>
        </div>

        {/* Big CTAs */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-4">
          <button
            type="button"
            onClick={openClaude}
            className="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-5 text-[15px] font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles size={18} />
            {methodInfo.method === 'url' ? 'Open Claude (Auto-filled)' : 'Copy & Open Claude'}
            <ExternalLink size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button
            type="button"
            onClick={copyPrompt}
            className={`flex items-center justify-center gap-3 rounded-2xl border px-6 py-5 text-[15px] font-bold transition-all hover:scale-[1.02] ${
              copied ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/[0.02] text-slate-200 hover:bg-white/[0.05]'
            }`}
          >
            {copied ? <><Check size={18} /> Copied to Clipboard!</> : <><Copy size={18} /> Copy Full Prompt</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepFinalPrompt;
