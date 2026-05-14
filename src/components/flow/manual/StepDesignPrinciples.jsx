import { LayoutTemplate, Type, Maximize, PaintBucket } from 'lucide-react';

const PRINCIPLES = [
  {
    icon: LayoutTemplate,
    title: 'Whitespace is Premium',
    body: 'Never fill the entire page. Leave generous margins (at least 1.5 inches) and ample spacing between paragraphs. Whitespace signals luxury and makes your content significantly easier to read.',
    color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20'
  },
  {
    icon: Type,
    title: 'Typography Hierarchy',
    body: 'Use no more than two font families. Keep body text between 11pt and 13pt. Your chapter titles (H1) should be massively larger than your section headers (H2) to create clear visual anchors.',
    color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    icon: Maximize,
    title: 'Scan-ability First',
    body: 'Most buyers skim before they read. Use bolding strategically to highlight core concepts. Break up long walls of text with bullet points, numbered lists, and blockquotes.',
    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20'
  },
  {
    icon: PaintBucket,
    title: 'Restrained Color',
    body: 'Use color to direct attention, not to decorate. Keep body text dark gray (not pure black). Use your brand\'s accent color strictly for headings, links, and important callout boxes.',
    color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20'
  }
];

function StepDesignPrinciples({ onCanContinue }) {
  // Static step, can always continue
  onCanContinue(true);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 6 — Design Guide</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Premium Layout Principles
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          A high-quality digital product must look as good as the content inside it. Follow these 4 core principles to guarantee a professional result.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {PRINCIPLES.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 transition-colors hover:bg-white/[0.02]">
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border ${p.bg}`}>
                <Icon size={20} className={p.color} />
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-slate-200">{p.title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-400">{p.body}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-white/[0.04] bg-[#0B1220] p-6 text-center">
        <p className="text-[14px] font-medium text-slate-300">
          <span className="font-bold text-white">Pro Tip:</span> If you are not a designer, simply purchase a premium template on Canva or Creative Market. The template will automatically enforce these rules for you.
        </p>
      </div>
    </div>
  );
}

export default StepDesignPrinciples;
