/**
 * GAPIAN AI — DESIGN SPECIFICATION ENGINE
 * ============================================================
 * Gapian AI is NOT a text generator.
 * Gapian AI engineers professional Claude-ready design specification systems.
 *
 * Claude is the generation engine.
 * Gapian AI is the intelligence layer.
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// MODULAR TYPE SCALE ENGINE
// ─────────────────────────────────────────────────────────────────────────────

const MODULAR_SCALES = {
  'minor-second': 1.125,
  'major-second': 1.250,
  'perfect-fourth': 1.333,
  'golden-ratio': 1.618,
};

function buildTypeScale(baseSize, ratio) {
  const r = MODULAR_SCALES[ratio] || 1.250;
  const round = n => Math.round(n);
  return {
    caption:  round(baseSize / r / r),
    body:     round(baseSize),
    h3:       round(baseSize * r),
    h2:       round(baseSize * r * r),
    h1:       round(baseSize * r * r * r),
    display:  round(baseSize * r * r * r * r),
    ratio,
    ratioValue: r,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION TOOL PROFILES
// ─────────────────────────────────────────────────────────────────────────────

const TOOL_PROFILES = {
  canva: {
    name: 'Canva',
    pageSize: '1080 × 1350px (Instagram Portrait) or 816 × 1056px (US Letter PDF)',
    fontNote: 'Use Canva-compatible Google Fonts only. Avoid custom font uploads on free plans.',
    workflow: `
CANVA IMPLEMENTATION WORKFLOW:
1. Open Canva → Create Design → select your page size above.
2. Go to Brand Kit → upload your hex colors as brand colors.
3. Set your two chosen fonts as Primary and Secondary in Brand Kit.
4. Search for a template matching your design mood, then STRIP all content.
5. Build each component (callout, chapter header, checklist) as a separate reusable template.
6. Duplicate approved pages — never redesign from scratch.
7. Export as PDF Print (300dpi) for digital delivery.`,
  },
  figma: {
    name: 'Figma',
    pageSize: '816 × 1056px (US Letter) or 595 × 842px (A4)',
    fontNote: 'Install Google Fonts plugin. Use Text Styles for all typography tokens.',
    workflow: `
FIGMA IMPLEMENTATION WORKFLOW:
1. Create a new file → set Frame to your chosen page size.
2. Define all colors as Color Styles in the right panel.
3. Create Text Styles for each typographic role (Display, H1, H2, Body, Caption).
4. Build components in a dedicated Components page.
5. Use Auto Layout for all repeating elements.
6. Export pages as PDF via Share → Export.`,
  },
  'adobe-express': {
    name: 'Adobe Express',
    pageSize: '816 × 1056px (US Letter PDF)',
    fontNote: 'Use Adobe Fonts included in Express subscription.',
    workflow: `
ADOBE EXPRESS IMPLEMENTATION WORKFLOW:
1. Create a new project → Custom Size → enter page dimensions.
2. Set brand colors under Brand → add hex codes.
3. Upload or select fonts from Adobe Fonts library.
4. Use the grid and alignment guides to maintain spacing.
5. Download as PDF.`,
  },
  indesign: {
    name: 'InDesign',
    pageSize: '6 × 9in (standard ebook) or 8.5 × 11in (workbook)',
    fontNote: 'Full font support. Use Character Styles and Paragraph Styles for all typographic tokens.',
    workflow: `
INDESIGN IMPLEMENTATION WORKFLOW:
1. File → New Document → set page size, margins, columns.
2. Open Character Styles and Paragraph Styles panels — define every typographic role.
3. Create a master page for repeating elements (header, footer, page number).
4. Place and style content using defined styles only. No manual overrides.
5. Export → Adobe PDF (Interactive or Print).`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PRICE POSITIONING → DESIGN INTELLIGENCE
// ─────────────────────────────────────────────────────────────────────────────

const PRICE_TO_DESIGN = {
  quick:    { label: 'Quick Win ($7–$27)',    density: 'comfortable', mood: 'accessible and approachable', spacing: 'generous padding to avoid cognitive load', hierarchy: 'bold headers, very short paragraphs, high white space' },
  mid:      { label: 'Mid-Tier ($37–$97)',    density: 'standard',    mood: 'professional and structured', spacing: 'balanced information density', hierarchy: 'clear section breaks, moderate content depth per page' },
  premium:  { label: 'Premium ($147–$497)',   density: 'editorial',   mood: 'restrained executive aesthetic', spacing: 'precise grid-based spacing, editorial rhythm', hierarchy: 'understated typography, strong visual logic, confident white space' },
  flagship: { label: 'Flagship ($497–$997+)', density: 'masterclass', mood: 'authoritative and luxurious', spacing: 'maximum breathing room, museum-level spacing', hierarchy: 'publication-grade hierarchy, zero visual noise' },
};

// ─────────────────────────────────────────────────────────────────────────────
// TONE → TYPOGRAPHY PERSONALITY
// ─────────────────────────────────────────────────────────────────────────────

const TONE_TO_TYPOGRAPHY = {
  'Authoritative': { display: 'Playfair Display', body: 'Inter', pairing: 'Editorial serif headline + neutral sans body. Creates authority and readability.', avoid: 'Avoid script or decorative fonts — they undermine authority.' },
  'Conversational': { display: 'DM Sans',        body: 'Source Sans 3', pairing: 'Geometric sans throughout. Friendly, open, and approachable.', avoid: 'Avoid heavy serifs — they feel too academic for conversational tone.' },
  'Analytical':    { display: 'IBM Plex Sans',   body: 'IBM Plex Serif', pairing: 'Technical sans headline + readable serif body. Data-forward and precise.', avoid: 'Avoid decorative or rounded fonts.' },
  'Visionary':     { display: 'Space Grotesk',   body: 'Inter',          pairing: 'Distinctive geometric display + neutral body. Forward-thinking and modern.', avoid: 'Avoid classical serif — it conflicts with visionary positioning.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// FRAMEWORK → LAYOUT ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────

const FRAMEWORK_TO_LAYOUT = {
  'Action-Oriented':  'Lead every section with a numbered action. Use checklist components after each lesson. Section headers must include a verb.',
  'First Principles':  'Open each chapter with a foundational question. Use callout boxes for "Core Truth" statements. Use tables for concept breakdowns.',
  'Narrative/Story':   'Begin every chapter with a story paragraph (italic, slightly larger than body). Use pull quotes to extract emotional peaks.',
  '80/20 Rule':        'Use a "Power 20%" callout box in every chapter. Bold the highest-leverage insight per section. Reduce overall chapter count — depth over breadth.',
};

// ─────────────────────────────────────────────────────────────────────────────
// ATMOSPHERE RULES ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function buildAtmosphereRules(priceKey, tone, framework) {
  const price = PRICE_TO_DESIGN[priceKey] || PRICE_TO_DESIGN['mid'];
  return `
ATMOSPHERE RULES — ENFORCE THESE IN EVERY PAGE:
-------------------------------------------------
MUST DO:
✓ Maintain ${price.mood} throughout every component.
✓ Preserve the established typography hierarchy — never manually override font sizes.
✓ Use only the defined color palette below — zero improvisation on color.

MUST NOT DO:
✗ Do not mix design approaches mid-document (no "clean modern" next to "rustic warmth").
✗ Do not reduce spacing when content gets long — reduce content instead.
✗ Do not use more than 2 font families in the entire document.

EMOTIONAL DESIGN DIRECTION:
The reader should feel ${price.mood}.
Every design decision must serve readability and ${price.density} information density.
Typography is the primary trust signal — treat it accordingly.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPACING SYSTEM ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function buildSpacingSystem(priceKey) {
  const price = PRICE_TO_DESIGN[priceKey] || PRICE_TO_DESIGN['mid'];
  const unit = priceKey === 'flagship' ? 8 : priceKey === 'premium' ? 8 : 6;
  return `
SPACING SYSTEM:
---------------
Base Unit:         ${unit}px
Spacing Scale:     ${unit}px / ${unit*2}px / ${unit*3}px / ${unit*4}px / ${unit*6}px / ${unit*8}px
Paragraph Spacing: ${unit*2}px between paragraphs
Section Spacing:   ${unit*6}px between major sections
Component Spacing: ${unit*3}px internal padding for callouts/tables
Vertical Rhythm:   Line-height × base = baseline grid
Density Mode:      ${price.density} — ${price.hierarchy}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT LIBRARY GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

function buildComponentLibrary(colorAccent, framework) {
  return `
COMPONENT LIBRARY — IMPLEMENT EXACTLY AS SPECIFIED:
-----------------------------------------------------
CALLOUT BOX:
  Background:  ${colorAccent}15 (accent at 8% opacity)
  Border-left: 3px solid ${colorAccent}
  Padding:     16px 20px
  Label:       10px ALL CAPS, accent color, tracking 0.12em
  Body:        13–14px, standard body font, 1.6 line height
  Usage:       key insights, warnings, "Pro Tip" moments

PULL QUOTE:
  Font:        Display font, 20–24px, italic, 1.3 line height
  Color:       Primary text at 90% opacity
  Border:      Left 2px solid accent, no box
  Padding:     0 0 0 24px
  Usage:       Extract the single most powerful sentence per chapter

CHECKLIST:
  Marker:      ☐ or □ in accent color
  Item Font:   Body font, 14px, regular weight
  Spacing:     10px between items
  Usage:       End of every action-oriented section (per "${framework}" framework)

TABLE:
  Header BG:   Darkest background color
  Header Font: 11px ALL CAPS, accent color, bold
  Row BG:      Alternating neutral shades
  Border:      1px solid divider color
  Usage:       Comparisons, feature breakdowns, side-by-sides

CHAPTER OPENER:
  Chapter Number: Display font, 72–96px, 8% opacity
  Chapter Title:  H1 spec
  Chapter Intro:  18px, body font, 1.7 line height
  Spacing:        Full bleed background color, 48px top padding

DIVIDER:
  Height:     1px
  Color:      Divider color (from palette)
  Margin:     32px top/bottom
  Usage:      Between major sections within a chapter`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SPECIFICATION COMPILER
// ─────────────────────────────────────────────────────────────────────────────

export function compileMasterPrompt({
  productTitle,
  productSubtitle,
  productDescription,
  productAudience = '',
  productPricing  = '',
  productScore    = '',
  productIndex,
  style,
  theme,
  depth,
  tone,
  framework,
  implementationTool = 'canva',
  pricePositioning   = 'mid',
  brandAdjectives    = '',
  scaleRatio         = 'major-second',
}) {
  const toneTypo    = TONE_TO_TYPOGRAPHY[tone?.name] || TONE_TO_TYPOGRAPHY['Authoritative'];
  const typeScale   = buildTypeScale(16, scaleRatio);
  const toolProfile = TOOL_PROFILES[implementationTool] || TOOL_PROFILES['canva'];
  const priceDesign = PRICE_TO_DESIGN[pricePositioning]  || PRICE_TO_DESIGN['mid'];
  const accentHex   = theme?.accent || '#2D7DFF';
  const primaryHex  = theme?.primary || '#111318';
  const frameworkLayout = FRAMEWORK_TO_LAYOUT[framework?.name] || FRAMEWORK_TO_LAYOUT['Action-Oriented'];
  const atmosphereRules = buildAtmosphereRules(pricePositioning, tone?.name, framework?.name);
  const spacingSystem   = buildSpacingSystem(pricePositioning);
  const componentLib    = buildComponentLibrary(accentHex, framework?.name);

  return `
You are an elite design systems architect, editorial director, and professional ebook ghostwriter.

Your task is to produce the COMPLETE FINAL CONTENT for a premium digital product.
This is NOT a draft. This is the final, publication-ready product.

Gapian AI has pre-engineered the following specification system for you.
You must follow it with absolute precision. Do not improvise.

==================================================
PRODUCT IDENTITY
==================================================
Title:              ${productTitle || 'Untitled Product'}
Subtitle:           ${productSubtitle || ''}
Description:        ${productDescription || ''}
Target Audience:    ${productAudience || 'Professional creators and entrepreneurs'}
Price Positioning:  ${priceDesign.label}
Market Score:       ${productScore}/10
Brand Adjectives:   ${brandAdjectives || 'premium, restrained, authoritative'}
Implementation:     ${toolProfile.name}

==================================================
DOMAIN 1 — TYPOGRAPHY SYSTEM
==================================================
Typography Personality: ${toneTypo.pairing}
Avoid:                  ${toneTypo.avoid}

MODULAR TYPE SCALE (ratio ${typeScale.ratioValue} — ${scaleRatio}):
  Display:    ${typeScale.display}px — ${toneTypo.display}, Black / 900
  H1:         ${typeScale.h1}px — ${toneTypo.display}, Bold / 700
  H2:         ${typeScale.h2}px — ${toneTypo.display}, SemiBold / 600
  H3:         ${typeScale.h3}px — ${toneTypo.body}, SemiBold / 600
  Body:       ${typeScale.body}px — ${toneTypo.body}, Regular / 400, line-height 1.7
  Caption:    ${typeScale.caption}px — ${toneTypo.body}, Regular / 400, tracking +0.03em
  ALL CAPS:   ${typeScale.caption}px — ${toneTypo.body}, Bold / 700, tracking +0.12em

LINE HEIGHT SYSTEM:
  Display/H1: 1.1 — tight cinematic leading
  H2/H3:      1.3 — structured editorial leading
  Body:       1.7 — maximum reading comfort
  Captions:   1.4 — compact but readable

==================================================
DOMAIN 2 — COLOR HIERARCHY
==================================================
PRIMARY BACKGROUND:   ${primaryHex}
SECONDARY BACKGROUND: ${primaryHex}DD
ACCENT:               ${accentHex}
PRIMARY TEXT:         #F5F7FA — main readable content
SECONDARY TEXT:       #A0A7B4 — supporting labels and captions
MUTED TEXT:           #6E7685 — footers, metadata, timestamps
DIVIDER:              #202635 — borders and section separators
CALLOUT BG:           ${accentHex}15 — callout boxes, highlighted regions
HIGHLIGHT:            ${accentHex}30 — inline emphasis backgrounds

Color Ratio:
  70% — dark neutrals (backgrounds and primary surfaces)
  20% — grayscale (text hierarchy)
  10% — accent (${accentHex}) for interactive and hierarchy signals

DO NOT introduce any color not listed above.

==================================================
DOMAIN 3 — GRID & LAYOUT SYSTEM
==================================================
Page Dimensions:      ${toolProfile.pageSize}
Outer Margin:         48px left/right (desktop PDF) or 32px (mobile)
Top Margin:           40px
Bottom Margin:        56px (allow space for page number)
Body Text Width:      ${implementationTool === 'canva' ? '65–75% of page width' : '480–520px'}
Column System:        Single-column body text; 2-column for comparison tables
Baseline Grid:        8px base unit
Chapter Opener:       Full-bleed page (no margin), centered title
Image Width:          100% of body text column

READING EXPERIENCE:
  Max Characters/Line: 65–75 (optimal reading comfort)
  Avoid:               Justified text — use left-aligned for all body copy

==================================================
DOMAIN 4 — COMPONENT LIBRARY
==================================================
${componentLib}

==================================================
DOMAIN 5 — SPACING SYSTEM
==================================================
${spacingSystem}

==================================================
DOMAIN 6 — ATMOSPHERE RULES
==================================================
${atmosphereRules}

==================================================
CONTENT FRAMEWORK — ${framework?.name || 'Action-Oriented'}
==================================================
${frameworkLayout}

==================================================
CONTENT DEPTH & VOICE
==================================================
Voice & Tone:   ${tone?.name || 'Authoritative'}
Target Depth:   ${depth?.name || 'Standard Playbook'}
Style:          ${style?.name || 'Inter'}

==================================================
PRODUCT STRUCTURE — FOLLOW THIS EXACTLY
==================================================
${productIndex || ''}

==================================================
WRITING REQUIREMENTS (CRITICAL — READ BEFORE EVERY PARAGRAPH)
==================================================
1. SPECIFICITY ENFORCEMENT:
   — Every sentence must be specific to this product topic.
   — If a sentence could apply to ANY product, delete it and rewrite.
   — Every example must use real numbers, real scenarios, real outcomes.

2. BANNED PHRASES (never use):
   — "In today's digital world"
   — "It's important to note that"
   — "leverage", "synergy", "holistic", "game-changer"

3. QUALITY ENFORCEMENT:
   — Open every chapter with a cinematic hook (story, statistic, bold claim).
   — Every conceptual tip must be followed by a real-world example.
   — Every chapter must end with a summary and hook to next chapter.

4. TRUST SIGNAL: Write like the world's best expert on this specific topic.

==================================================
PDF FORMATTING MARKERS (use these exactly)
==================================================
[COVER PAGE]          — Product cover with design brief
[TABLE OF CONTENTS]   — Chapter list with page estimates
[CHAPTER X: TITLE]    — Chapter opener
[SECTION: Title]      — H2 section within chapter
[CALLOUT: Label | Content] — Callout box
[PULL QUOTE: Text]    — Pull quote
[CHECKLIST: Title]    — Checklist block
[TABLE: Title]        — Table component
[CHAPTER SUMMARY]     — End of chapter summary
[NEXT STEP → Chapter X: Title]
[PAGE BREAK]

==================================================
IMPLEMENTATION TOOL: ${toolProfile.name}
==================================================
${toolProfile.workflow}
Font Note: ${toolProfile.fontNote}

==================================================
COVER DESIGN BRIEF (append at end of document)
==================================================
[COVER DESIGN BRIEF]
Title:    ${productTitle || 'Untitled Product'}
Palette:  Primary ${primaryHex} / Accent ${accentHex}
Mood:     ${brandAdjectives || 'premium, restrained, authoritative'}

IDEOGRAM / MIDJOURNEY PROMPT:
"Premium digital product cover for '${productTitle}'. ${priceDesign.mood} aesthetic.
Color palette: ${primaryHex} background with ${accentHex} accent.
Typography-focused composition, clean typography space for title placement.
${toolProfile.name}-production-ready. Cinematic studio lighting. 8K resolution. --ar 4:5"

${toolProfile.name} SEARCH TERMS:
1. "${tone?.name?.toLowerCase() || 'professional'} ebook template"
2. "${priceDesign.density} dark pdf template"
3. "minimal digital product cover ${tone?.name?.toLowerCase() || 'professional'}"
[END COVER DESIGN BRIEF]

==================================================
QUALITY STANDARD
==================================================
This product must justify its ${priceDesign.label} price point.
Every paragraph must earn its place.
Write the COMPLETE product — every chapter, every section, fully.
Do NOT summarize. Do NOT stop early.
Begin with [COVER PAGE], then [TABLE OF CONTENTS], then write every chapter in full.
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// BLUEPRINT INDEX FORMATTER
// ─────────────────────────────────────────────────────────────────────────────

export function formatIndexBlock(blueprint) {
  if (!blueprint) return '';
  const lines = [];

  if (blueprint.overview) {
    lines.push('PRODUCT OVERVIEW');
    lines.push('----------------');
    const o = blueprint.overview;
    if (o.goal)           lines.push(`Goal: ${o.goal}`);
    if (o.audience)       lines.push(`Audience: ${o.audience}`);
    if (o.problemsSolved) lines.push(`Problems Solved: ${Array.isArray(o.problemsSolved) ? o.problemsSolved.join(', ') : o.problemsSolved}`);
    if (o.transformation) lines.push(`Transformation: ${o.transformation}`);
    if (o.monetization)   lines.push(`Monetization: ${o.monetization}`);
    if (o.positioning)    lines.push(`Positioning: ${o.positioning}`);
    lines.push('');
  }

  if (blueprint.chapters?.length) {
    lines.push('COMPLETE PRODUCT INDEX');
    lines.push('----------------------');
    blueprint.chapters.forEach((ch, i) => {
      lines.push(`Chapter ${i + 1}: ${ch.title}`);
      if (ch.subtitle) lines.push(`  Subtitle: ${ch.subtitle}`);
      ch.modules?.forEach((mod, j) => {
        lines.push(`  Module ${j + 1}: ${mod.title}`);
        mod.sections?.forEach(sec => lines.push(`    — ${sec}`));
      });
      if (ch.checklist) lines.push(`  ☐ Checklist: ${ch.checklist}`);
      lines.push('');
    });
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUDE URL BUILDER
// ─────────────────────────────────────────────────────────────────────────────

const CLAUDE_URL_LIMIT = 4000;

export function buildClaudeIntent(prompt) {
  const trimmed = prompt.trim();
  if (trimmed.length <= CLAUDE_URL_LIMIT) {
    return { method: 'url', url: `https://claude.ai/new?q=${encodeURIComponent(trimmed)}` };
  }
  return { method: 'clipboard', url: 'https://claude.ai/new' };
}
