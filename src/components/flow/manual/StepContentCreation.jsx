import { useState } from 'react';
import { Copy, Check, ExternalLink, PenTool, Layout, Tag, Target } from 'lucide-react';
import { formatIndexBlock } from '../../../prompts/masterPrompt.js';

function StepContentCreation({ idea, data }) {
  const [copied, setCopied] = useState(false);

  const guideText = [
    `PRODUCT TITLE: ${idea.title}`,
    `SUBTITLE: ${idea.headline}`,
    ``,
    `DESCRIPTION: ${idea.description}`,
    `AUDIENCE: ${idea.audience}`,
    `PRICING GOAL: ${idea.pricing}`,
    ``,
    `--- PRODUCT BLUEPRINT ---`,
    formatIndexBlock(data.blueprint),
  ].join('\n');

  const copyGuide = async () => {
    try { await navigator.clipboard.writeText(guideText); }
    catch {
      const el = Object.assign(document.createElement('textarea'), { value: guideText });
      document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 7 — Content Creation</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Start Building
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          You have everything you need. Here is your launch checklist and your complete product roadmap ready to copy into your text editor.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Launch Checklist */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6">
          <p className="mb-5 text-[14px] font-semibold text-slate-200">Your Action Plan</p>
          <div className="space-y-3">
            {[
              { icon: PenTool, text: 'Copy the blueprint below into Google Docs or Notion.' },
              { icon: Layout,  text: 'Set your document fonts and colors to match your generated styling.' },
              { icon: Target,  text: 'Write the content chapter by chapter. Aim for 1-2 chapters per day.' },
              { icon: Tag,     text: 'Format as PDF and upload to Gumroad, Lemon Squeezy, or your own site.' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-[#05070B] p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Icon size={14} />
                  </div>
                  <p className="text-[13px] text-slate-300">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blueprint export */}
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4">
            <p className="text-[14px] font-medium text-slate-200">Your Complete Roadmap</p>
            <button
              type="button"
              onClick={copyGuide}
              className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[12px] font-bold transition-all ${
                copied ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              {copied ? <><Check size={14} /> Copied to Clipboard</> : <><Copy size={14} /> Copy Document</>}
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto px-6 py-5 bg-[#05070B]">
            <pre className="font-mono text-[11px] leading-relaxed text-slate-400 whitespace-pre-wrap break-words">
              {guideText}
            </pre>
          </div>
        </div>

        {/* AI Assistants */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="https://claude.ai/new" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3.5 text-[13px] font-bold text-violet-400 transition-colors hover:bg-violet-500/20">
            Open Claude <ExternalLink size={14} />
          </a>
          <a href="https://chat.openai.com" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-[13px] font-bold text-emerald-400 transition-colors hover:bg-emerald-500/20">
            Open ChatGPT <ExternalLink size={14} />
          </a>
          <a href="https://gemini.google.com" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3.5 text-[13px] font-bold text-blue-400 transition-colors hover:bg-blue-500/20">
            Open Gemini <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default StepContentCreation;
