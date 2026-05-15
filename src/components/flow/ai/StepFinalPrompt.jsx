import { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { compileMasterPrompt, formatIndexBlock, buildClaudeIntent } from '../../../prompts/masterPrompt.js';

function StepFinalPrompt({ idea, data }) {
  const [copied, setCopied] = useState(false);
  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [methodInfo, setMethodInfo] = useState({ method: 'clipboard', url: 'https://claude.ai/new' });
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const cust = data.customization || {};
    const p = compileMasterPrompt({
      productTitle:      idea.title,
      productSubtitle:   idea.headline,
      productDescription:idea.description,
      productAudience:   idea.audience,
      productPricing:    idea.pricing,
      productScore:      idea.score,
      productIndex:      formatIndexBlock(data.blueprint),
      style:             { name: cust.color?.name || 'Midnight' },
      theme:             { name: cust.color?.name || 'Dark', primary: cust.color?.primary, accent: cust.color?.accent },
      depth:             cust.depth || { name: 'Standard Playbook' },
      tone:              cust.tone  || { name: 'Authoritative' },
      framework:         cust.framework || { name: 'Action-Oriented' },
      pricePositioning:   cust.priceTier?.id || 'mid',
      brandAdjectives:    cust.brandAdjectives || '',
      scaleRatio:         cust.scaleRatio?.id || 'major-second',
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
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16 fade-up">
      <div className="mb-10 flex flex-col gap-2 border-b border-[#202635] pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D7DFF]">Step 4 — Specification Output</p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Claude Design Specification
        </h2>
        <p className="text-[15px] leading-relaxed text-[#A0A7B4] max-w-2xl">
          Gapian AI has engineered a production-ready design specification system. Claude receives structured instructions — not vague requests.
        </p>
      </div>

      <div className="space-y-8">
        {/* Prompt Preview */}
        <div className="rounded-2xl border border-[#202635] bg-[#050505] overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#202635] bg-[#0B0B0F]">
            <div>
              <p className="text-[15px] font-semibold text-[#F5F7FA]">Compiled Design Specification</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[12px] text-[#A0A7B4]">
                  {data.customization?.tool?.name || 'Canva'} · {data.customization?.tone?.name || 'Authoritative'} · {data.customization?.priceTier?.name || 'Mid-Tier'} · ~{wordCount} words
                </span>
                {methodInfo.method === 'url' ? (
                  <span className="rounded bg-[#2D7DFF]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4B8DFF] border border-[#2D7DFF]/20">Auto-fills URL</span>
                ) : (
                  <span className="rounded bg-[#3A4352]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#A0A7B4] border border-[#3A4352]/30">Copy & Paste</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={copyPrompt}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-all ${
                copied ? 'border-[#2D7DFF]/30 bg-[#2D7DFF]/10 text-[#2D7DFF]' : 'border-[#3A4352] bg-[#111318] text-[#A0A7B4] hover:bg-[#202635] hover:text-white'
              }`}
            >
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto px-6 py-5">
            <pre className="font-mono text-[12px] leading-relaxed text-[#6E7685] whitespace-pre-wrap break-words">
              {compiledPrompt.slice(0, 1500)}
              <span className="text-[#3A4352]">... [Content truncated for preview]</span>
            </pre>
          </div>
        </div>

        {/* Big CTAs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <button
            type="button"
            onClick={openClaude}
            className="group flex items-center justify-center gap-3 rounded-2xl bg-[#2D7DFF] px-6 py-5 text-[15px] font-bold text-white shadow-[0_0_30px_rgba(45,125,255,0.15)] transition-all hover:scale-[1.02] hover:bg-[#4B8DFF]"
          >
            <Sparkles size={18} />
            {methodInfo.method === 'url' ? 'Send Spec to Claude' : 'Copy Spec & Open Claude'}
            <ExternalLink size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button
            type="button"
            onClick={copyPrompt}
            className={`flex items-center justify-center gap-3 rounded-2xl border px-6 py-5 text-[15px] font-bold transition-all hover:scale-[1.02] ${
              copied ? 'border-[#2D7DFF]/30 bg-[#2D7DFF]/10 text-[#4B8DFF]' : 'border-[#202635] bg-[#0B0B0F] text-[#D9DEE7] hover:border-[#3A4352] hover:bg-[#111318]'
            }`}
          >
            {copied ? <><Check size={18} /> Copied to Clipboard</> : <><Copy size={18} /> Copy Full Prompt</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepFinalPrompt;
