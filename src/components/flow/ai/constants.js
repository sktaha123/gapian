import { minimalLuxury }    from '../../../prompts/styles/minimal-luxury.js';
import { darkPremium }      from '../../../prompts/styles/dark-premium.js';
import { modernCreator }    from '../../../prompts/styles/modern-creator.js';
import { futuristicAI }     from '../../../prompts/styles/futuristic-ai.js';
import { startupBlueprint } from '../../../prompts/styles/startup-blueprint.js';
import { coachingStyle }    from '../../../prompts/styles/coaching-style.js';

import { blackGold }     from '../../../prompts/themes/black-gold.js';
import { matteBlack }    from '../../../prompts/themes/matte-black.js';
import { purpleNeon }    from '../../../prompts/themes/purple-neon.js';
import { emeraldLuxury } from '../../../prompts/themes/emerald-luxury.js';
import { darkNavy }      from '../../../prompts/themes/dark-navy.js';

import { shortDepth }  from '../../../prompts/depth/short.js';
import { mediumDepth } from '../../../prompts/depth/medium.js';
import { longDepth }   from '../../../prompts/depth/long.js';
import { autoDepth }   from '../../../prompts/depth/auto.js';

export const STYLES = [
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

export const THEMES = [
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

export const DEPTHS = [
  { ...shortDepth },
  { ...mediumDepth },
  { ...longDepth },
  { id: 'xl', label: '60+ Pages', pages: 60, depthBlock: `DEPTH — EXTENDED:\n- Maximum depth. 15+ chapters, 10-15 worksheets, 6-8 bonuses.` },
  { ...autoDepth },
];
