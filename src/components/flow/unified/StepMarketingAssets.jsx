import { useState, useEffect } from 'react';
import { Twitter, Image as ImageIcon, Mail, Type, Copy, Check, Linkedin, MousePointerClick, Sparkles, ExternalLink } from 'lucide-react';
import useCopy from '../../../hooks/useCopy.js';
import { formatIndexBlock, buildClaudeIntent } from '../../../prompts/masterPrompt.js';

const ASSET_TYPES = [
  { id: 'sales_page', title: 'Sales Page', icon: Type, desc: 'High-converting Gumroad/Whop copy', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'email_seq', title: 'Email Sequence', icon: Mail, desc: '5-part launch & urgency campaign', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'twitter', title: 'Twitter Thread', icon: Twitter, desc: 'Viral 7-part launch thread', color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { id: 'linkedin', title: 'LinkedIn Carousel', icon: Linkedin, desc: 'B2B authority building post', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { id: 'fb_ad', title: 'Facebook Ads', icon: MousePointerClick, desc: '3 direct-response ad variations', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'cover', title: 'Cover Prompts', icon: ImageIcon, desc: 'Midjourney/Ideogram prompts', color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10' },
];

function StepMarketingAssets({ idea, data }) {
  const { copiedId, copyToClipboard } = useCopy();
  const [activeAsset, setActiveAsset] = useState(null);
  const [methodInfo, setMethodInfo] = useState(null);

  const generateEngineeredPrompt = (type) => {
    const cust = data.customization || {};
    const tone = cust.tone?.name || 'Authoritative';
    const indexStr = data.blueprint ? formatIndexBlock(data.blueprint) : '';

    const baseContext = `
PRODUCT CONTEXT:
----------------
Title: ${idea.title}
Subtitle: ${idea.headline}
Description: ${idea.description}
Target Audience: ${idea.audience}
Price Point: ${idea.pricing}
Tone of Voice: ${tone}

PRODUCT BLUEPRINT:
------------------
${indexStr}
`;

    let task = '';
    switch (type) {
      case 'sales_page':
        task = `TASK: Write a high-converting, professional Sales Page for this product (suitable for Gumroad, Whop, or a Landing Page).
Structure it as follows:
1. A killer headline that addresses the target audience's core desire.
2. A sub-headline that introduces the mechanism (the product).
3. The "Pain/Agitate/Solve" section describing their current struggles.
4. "What You Get" — a bulleted breakdown of the core modules.
5. "Who this is for" vs "Who this is NOT for".
6. A strong Call to Action (CTA) and a guarantee.
Write this in a ${tone} tone. Use markdown formatting.`;
        break;
      case 'email_seq':
        task = `TASK: Write a premium 5-part email launch sequence for this product.
Email 1: The Teaser & Problem Awareness (Gain interest)
Email 2: The Solution (Introduce the product conceptually)
Email 3: The Launch (Product is live, list features/benefits)
Email 4: Logic & FAQs (Overcome objections, provide social proof angles)
Email 5: The Final Push (Scarcity, urgency, last chance)
Ensure the subject lines have high open-rate potential. Tone: ${tone}.`;
        break;
      case 'twitter':
        task = `TASK: Write a viral 7-part Twitter/X thread launching this product.
Tweet 1: The Hook (A bold claim, a surprising stat, or a contrarian take about the topic).
Tweet 2: The Problem (Why everyone else is failing at this).
Tweet 3: The Shift (The new way of thinking).
Tweet 4: The Framework (Introduce the product as the vehicle for this framework).
Tweet 5: The Value (List 3 mind-blowing things they will learn inside).
Tweet 6: Social Proof / Authority (Why they should listen to you).
Tweet 7: The CTA (Link to purchase).
Rule: Keep sentences short. No cringe emojis. Maximum punchiness.`;
        break;
      case 'linkedin':
        task = `TASK: Write a professional LinkedIn Carousel post script to promote this product.
Slide 1 (Hook): A bold, contrarian statement about ${idea.title} for B2B professionals.
Slide 2-5 (Value): Teach 3 specific, actionable frameworks from the blueprint above.
Slide 6 (The "How"): Explain that this is just 5% of what's inside the new product.
Slide 7 (CTA): Tell them to comment a specific word to get the link, or link in comments.
Tone: Expert, analytical, and professional.`;
        break;
      case 'fb_ad':
        task = `TASK: Write 3 direct-response Facebook/Instagram Ad copy variations for this product.
Variation 1: The Story Angle (A relatable story about struggling with the problem, finding the solution, and offering the product).
Variation 2: The Direct Offer (Straight to the point: what it is, who it's for, the massive discount/value, and the link).
Variation 3: The Contrarian Angle (Call out a common myth in the industry, and present this product as the actual truth).
Include primary text, headline, and button call-to-action for each.`;
        break;
      case 'cover':
        task = `TASK: Generate 3 premium, highly detailed Image Generation Prompts (for Midjourney v6 or Ideogram) to create the cover design for this product.
The visual aesthetic should match the color theme: ${cust.color?.name || 'Dark/Minimal'}.
The prompts should ask for: "Minimalist, luxury digital product cover for a guide titled '${idea.title}', clean typography space, professional studio lighting, 8k resolution, photorealistic, --ar 4:5 --v 6.0"
Make each variation slightly different (e.g., one abstract geometric, one minimalist gradient, one object-focused).`;
        break;
      default:
        task = '';
    }

    const finalPrompt = `${baseContext}\n\n==================================================\n\n${task}`;
    setActiveAsset({ type, prompt: finalPrompt });
    setMethodInfo(buildClaudeIntent(finalPrompt));
  };

  // Auto-generate first asset
  useEffect(() => {
    if (!activeAsset) {
      generateEngineeredPrompt('sales_page');
    }
  }, []);

  const openClaude = async () => {
    if (!methodInfo) return;
    if (methodInfo.method === 'clipboard') {
      await copyToClipboard(activeAsset.prompt, 'claude_copy');
    }
    window.open(methodInfo.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14 fade-up">
      <div className="mb-10 flex flex-col gap-2 border-b border-[#202635] pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D7DFF]">Step 5 — Go-To-Market</p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Marketing Asset Engine
        </h2>
        <p className="text-[15px] leading-relaxed text-[#A0A7B4]">
          Generate highly optimized, context-aware marketing copy. These prompts have your entire product blueprint injected into them.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Asset Types */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#6E7685] mb-2">Campaign Materials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {ASSET_TYPES.map((asset) => {
              const isActive = activeAsset?.type === asset.id;
              const Icon = asset.icon;
              return (
                <button
                  key={asset.id}
                  onClick={() => generateEngineeredPrompt(asset.id)}
                  className={`group relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-[#2D7DFF]/50 bg-[#2D7DFF]/10 shadow-[0_0_0_1px_rgba(45,125,255,0.2)]'
                      : 'border-[#202635] bg-[#050505] hover:border-[#3A4352] hover:bg-[#0B0B0F]'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? asset.bg + ' ' + asset.color : 'bg-[#111318] text-[#6E7685] group-hover:text-[#A0A7B4]'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className={`text-[14px] font-bold ${isActive ? 'text-white' : 'text-[#D9DEE7] group-hover:text-white'}`}>{asset.title}</h4>
                    <p className="text-[12px] text-[#6E7685] mt-0.5">{asset.desc}</p>
                  </div>
                  {isActive && (
                    <div className="absolute right-4 h-2 w-2 rounded-full bg-[#2D7DFF] shadow-[0_0_8px_rgba(45,125,255,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Output console */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 flex h-[600px] flex-col rounded-2xl border border-[#202635] bg-[#0B0B0F] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#202635] bg-[#111318] px-6 py-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#3A4352]">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#111318]" />
                </div>
                <h3 className="text-[14px] font-semibold text-white">Engineered Prompt</h3>
              </div>
              <div className="flex items-center gap-2">
                {activeAsset && methodInfo && (
                  <button
                    onClick={openClaude}
                    className="flex items-center gap-2 rounded-lg bg-[#2D7DFF]/10 border border-[#2D7DFF]/20 px-3 py-1.5 text-[12px] font-bold text-[#4B8DFF] transition-colors hover:bg-[#2D7DFF]/20 hover:border-[#2D7DFF]/40"
                  >
                    <Sparkles size={14} />
                    Run in Claude
                    <ExternalLink size={12} className="ml-1" />
                  </button>
                )}
                {activeAsset && (
                  <button
                    onClick={() => copyToClipboard(activeAsset.prompt, 'prompt_copy')}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-all ${
                      copiedId === 'prompt_copy'
                        ? 'border-[#2D7DFF]/30 bg-[#2D7DFF]/10 text-[#2D7DFF]'
                        : 'border-[#3A4352] bg-[#050505] text-[#A0A7B4] hover:bg-[#202635] hover:text-white'
                    }`}
                  >
                    {copiedId === 'prompt_copy' ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-[#050505] p-6 rounded-b-2xl">
              {activeAsset ? (
                <div className="relative">
                  <div className="absolute top-0 left-0 h-full w-1 rounded-full bg-gradient-to-b from-[#2D7DFF] to-transparent opacity-50" />
                  <pre className="pl-5 font-mono text-[13px] leading-relaxed text-[#A0A7B4] whitespace-pre-wrap break-words">
                    {activeAsset.prompt}
                  </pre>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
                  <Type size={32} className="text-[#3A4352] mb-4" />
                  <p className="text-[14px] text-[#A0A7B4]">Select a campaign material to compile the prompt.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepMarketingAssets;
