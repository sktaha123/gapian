import { Sparkles, ArrowRight, Settings2, Palette, Layers, Bot } from 'lucide-react';

function StepAIIntro() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 1 — Introduction</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Automated Product Creation
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          You are entering the AI generation workflow. We will configure the architecture and aesthetics of your product, and then compile a precision master prompt for Claude AI to write the complete content.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Layers size={18} />
          </div>
          <p className="mb-1 text-[15px] font-bold text-slate-200">1. Define Architecture</p>
          <p className="text-[13px] leading-relaxed text-slate-500">We've already generated the blueprint. Now you will choose the content depth and complexity.</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
            <Palette size={18} />
          </div>
          <p className="mb-1 text-[15px] font-bold text-slate-200">2. Set Aesthetics</p>
          <p className="text-[13px] leading-relaxed text-slate-500">Select visual styles and color themes that match your brand identity and audience.</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Settings2 size={18} />
          </div>
          <p className="mb-1 text-[15px] font-bold text-slate-200">3. Compile Engine</p>
          <p className="text-[13px] leading-relaxed text-slate-500">Gapian synthesizes your choices into a highly advanced instruction set for the AI model.</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Bot size={18} />
          </div>
          <p className="mb-1 text-[15px] font-bold text-slate-200">4. AI Execution</p>
          <p className="text-[13px] leading-relaxed text-slate-500">You paste the master prompt into Claude, and it outputs a publication-ready digital product.</p>
        </div>
      </div>
    </div>
  );
}

export default StepAIIntro;
