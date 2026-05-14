import { useEffect, useState } from 'react';
import { Image, Loader2, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { fetchCoverDesignPrompts } from '../../../services/geminiService.js';

function PromptBox({ title, promptText }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(promptText).catch(() => {
      const el = document.createElement('textarea');
      el.value = promptText; document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove();
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-3">
        <p className="text-[12px] font-bold text-slate-200">{title}</p>
        <button type="button" onClick={copy} className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${copied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
          {copied ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy</>}
        </button>
      </div>
      <div className="p-5">
        <p className="font-mono text-[12px] leading-relaxed text-slate-400">{promptText}</p>
      </div>
    </div>
  );
}

function StepCover({ idea, data, updateData, onCanContinue }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data.coverPrompts) { setLoading(false); onCanContinue(true); return; }
    let cancelled = false;
    setLoading(true);
    fetchCoverDesignPrompts(idea, data.theme || { name: 'Default' })
      .then(p => { if (!cancelled) { updateData('coverPrompts', p); setLoading(false); onCanContinue(true); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [idea.id]);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 5 — Cover Design</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Visual Concept & Covers
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          AI-generated image prompts to help you create stunning, professional covers using Midjourney, Ideogram, or Canva.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-5 py-24">
          <Loader2 size={24} className="animate-spin text-emerald-400" />
          <p className="text-[15px] font-medium text-slate-300">Designing cover concepts...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5">
          <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
          <p className="text-[13px] text-red-300">{error}</p>
        </div>
      )}

      {data.coverPrompts && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PromptBox title="Front Cover Image Prompt" promptText={data.coverPrompts.front} />
            <div className="space-y-6">
               <PromptBox title="Back Cover/Texture Prompt" promptText={data.coverPrompts.back} />
               <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5">
                 <p className="text-[12px] font-bold text-slate-200 mb-3">Canva Search Terms</p>
                 <div className="flex flex-wrap gap-2">
                   {data.coverPrompts.canvaSearch?.map((term, i) => (
                     <span key={i} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-slate-300">
                       {term}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-blue-500/20 bg-blue-500/[0.05]">
            <Image size={24} className="text-blue-400 shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-slate-200">Recommendation</p>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Use <a href="https://ideogram.ai" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Ideogram.ai</a> for the best text-rendering on covers. Paste the prompt above exactly as written.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StepCover;
