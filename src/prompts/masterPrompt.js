/**
 * GAPIAN MASTER PROMPT SYSTEM
 * ============================================================
 * Core prompt compilation engine.
 * Injects all Gapian-generated data + user selections into a
 * final, ready-to-use Claude AI prompt.
 */

const MASTER_TEMPLATE = `
You are an elite digital product ghostwriter, course architect, and PDF designer.
Your task is to produce the COMPLETE FINAL CONTENT for a premium digital product.

This is NOT a draft. This is the final, publication-ready product.
Write at the highest level of quality, insight, and value.
The buyer paid real money for this. Make them feel it.

==================================================
PRODUCT IDENTITY
==================================================
Product Title:       {PRODUCT_TITLE}
Product Subtitle:    {PRODUCT_SUBTITLE}
Description:         {PRODUCT_DESCRIPTION}
Target Audience:     {PRODUCT_AUDIENCE}
Pricing:             {PRODUCT_PRICING}
Market Score:        {PRODUCT_SCORE}/10

==================================================
CONTENT SPECIFICATIONS
==================================================
Style:               {STYLE_NAME}
Color Theme:         {COLOR_THEME}
Target Length:       {PAGE_COUNT}

==================================================
STYLE DIRECTION
==================================================
{STYLE_BLOCK}

==================================================
VISUAL & THEME DIRECTION
==================================================
{THEME_BLOCK}

==================================================
DEPTH & SCOPE DIRECTION
==================================================
{DEPTH_BLOCK}

==================================================
PRODUCT STRUCTURE (Follow This Exactly)
==================================================
{INDEX_BLOCK}

==================================================
WRITING REQUIREMENTS & GUARDRAILS (CRITICAL)
==================================================
1. QUALITY ENFORCEMENT — READ BEFORE EVERY PARAGRAPH:
   - If a sentence could apply to ANY topic, delete it and rewrite specifically.
   - Every example must use real numbers, real names, real scenarios.
   - NEVER use these words: "In today's digital world", "It's important to note that", "leverage", "synergy", "holistic".
   - After every conceptual tip, immediately follow with a concrete example of it working in real life.
2. Follow the product index EXACTLY — every chapter, module, and section must be written fully.
3. Every chapter opens with a cinematic hook — a story, a striking statistic, or a bold statement.
4. Every concept is explained with depth — no surface-level fluff.
5. Every chapter ends with a summary and a hook to the next chapter.
6. Use the style direction for tone, formatting, and structure.
7. Include worksheets, checklists, and exercises per the depth direction.
8. The product must feel like premium content — not AI filler. Treat the reader as an intelligent adult.

==================================================
CHAIN OF THOUGHT: RESEARCH & STRATEGY BRIEF
==================================================
Before writing ANY content, first output a [STRATEGY BRIEF] block where you brainstorm:
1. The 3 biggest mistakes the target audience currently makes.
2. The single biggest insight that separates amateurs from experts in this space.
3. 3 contrarian takes on this topic that will surprise readers.
4. The emotional journey the reader should experience from Chapter 1 to the end.
Only after completing this brief, begin writing the Cover Page and Content.

==================================================
PDF FORMATTING RULES (CRITICAL)
==================================================
Use these exact markers so the content can be styled into a premium PDF:

COVER PAGE (write this first):
┌─────────────────────────────────────────────────┐
│ [COVER PAGE]                                     │
│ Title: {PRODUCT_TITLE}                           │
│ Subtitle: {PRODUCT_SUBTITLE}                     │
│ Color Theme: {COLOR_THEME}                       │
│ Design Direction: {COVER_DESIGN_DIRECTION}       │
│ [END COVER]                                      │
└─────────────────────────────────────────────────┘

TABLE OF CONTENTS:
Use [TABLE OF CONTENTS] marker, then list every chapter with page estimates.
Format: Chapter X: Title ......... p.XX

CHAPTER STRUCTURE:
- [CHAPTER X: CHAPTER TITLE]
- Opening hook (2-3 paragraphs)
- [SECTION: Section Title] for each H2
- [CALLOUT: Label | Content] for highlighted insights
- [WORKSHEET: Title] followed by structured fields
- [CHECKLIST: Title] followed by ☐ items
- [QUOTE: "Quote text" — Attribution]
- [CHAPTER SUMMARY]
- [NEXT STEP → Chapter X: Title]
- [PAGE BREAK]

BONUS SECTIONS:
- [BONUS: Title]
- [BONUS TYPE: worksheet/template/swipe-file/prompt-pack]

APPENDIX & RESOURCES:
- [APPENDIX: Title]
- [RESOURCE: Name | URL/Description]

==================================================
COVER DESIGN BRIEF (for Canva/Ideogram)
==================================================
After writing the full product, append this exact section:

[COVER DESIGN BRIEF]
Title: {PRODUCT_TITLE}
Theme: {COLOR_THEME}

IDEOGRAM.AI PROMPT:
"A premium digital product cover for a book titled '{PRODUCT_TITLE}'. 
Design aesthetic: {STYLE_NAME}, {COLOR_THEME}. 
{COVER_DESIGN_DIRECTION} 
Clean, luxury design. Professional. Typography focused. Masterpiece."

CANVA WORKFLOW:
1. Search Canva for: [List 3 specific template search terms based on theme]
2. Use Hex Colors: [List 3 main hex colors for this theme]
[END COVER DESIGN BRIEF]

==================================================
QUALITY STANDARD
==================================================
This product must be worth every penny of its $97-$497 price tag.
Write like you are the world's best expert on this topic.
Every paragraph must earn its place. Expand anything that feels thin.

Begin with the [STRATEGY BRIEF] block, then [COVER PAGE], then [TABLE OF CONTENTS], then write every chapter in full.
Do NOT stop early. Do NOT summarize. Write the COMPLETE product.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Cover design direction per theme
// ─────────────────────────────────────────────────────────────────────────────

const COVER_DIRECTIONS = {
  'black-gold':      'Matte black background with elegant gold foil-effect title typography, thin gold rule dividers, and a subtle abstract geometric pattern in dark gold',
  'matte-black':     'Pure black background with crisp white all-caps title, bold typographic layout with strong visual weight, minimal and iconic like a luxury brand',
  'purple-neon':     'Deep charcoal background with electric violet glow effects around the title, neon accent lines, and a subtle grid or circuit pattern beneath',
  'emerald-luxury':  'Deep forest green background with emerald and gold title treatment, organic leaf or geometric pattern in dark green, premium editorial feel',
  'dark-navy':       'Deep navy background with bright blue gradient title, clean sans-serif typography, subtle horizontal rule elements and a professional corporate aesthetic',
  'white-blue':      'Clean white background with a bold blue headline, modern sans-serif layout, thin blue rule accents and a minimal geometric pattern',
  'beige-minimal':   'Warm off-white background with amber and earthy typography, elegant serif font, botanical or minimal geometric accent illustration',
  'royal-red':       'Deep crimson background with gold title typography, regal border treatment, and subtle texture suggesting premium print quality',
  'default':         'Professional dark background with high-contrast title typography and elegant accent elements matching the selected color theme',
};

// ─────────────────────────────────────────────────────────────────────────────
// Compiler
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compiles the final master prompt with all Gapian-generated data injected.
 *
 * @param {object} params
 * @param {string} params.productTitle
 * @param {string} params.productSubtitle
 * @param {string} params.productDescription
 * @param {string} [params.productAudience]
 * @param {string} [params.productPricing]
 * @param {number} [params.productScore]
 * @param {string} params.productIndex       — Formatted index from Step 2 blueprint
 * @param {object} params.style              — Style config object
 * @param {object} params.theme              — Theme config object
 * @param {object} params.depth              — Depth config object
 * @returns {string}
 */
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
}) {
  const coverDirection = COVER_DIRECTIONS[theme?.id] || COVER_DIRECTIONS['default'];

  return MASTER_TEMPLATE
    .replaceAll('{PRODUCT_TITLE}',       productTitle       || 'Untitled Product')
    .replaceAll('{PRODUCT_SUBTITLE}',    productSubtitle    || '')
    .replaceAll('{PRODUCT_DESCRIPTION}', productDescription || '')
    .replaceAll('{PRODUCT_AUDIENCE}',    productAudience    || 'Creators and entrepreneurs')
    .replaceAll('{PRODUCT_PRICING}',     productPricing     || 'TBD')
    .replaceAll('{PRODUCT_SCORE}',       String(productScore || ''))
    .replaceAll('{PRODUCT_INDEX}',       productIndex       || '')
    .replaceAll('{STYLE_BLOCK}',         style?.styleBlock?.trim()  || '')
    .replaceAll('{THEME_BLOCK}',         theme?.themeBlock?.trim()  || '')
    .replaceAll('{DEPTH_BLOCK}',         depth?.depthBlock?.trim()  || '')
    .replaceAll('{STYLE_NAME}',          style?.name  || 'Standard')
    .replaceAll('{COLOR_THEME}',         theme?.name  || 'Default')
    .replaceAll('{PAGE_COUNT}',          depth?.label || 'Auto')
    .replaceAll('{COVER_DESIGN_DIRECTION}', coverDirection);
}

// ─────────────────────────────────────────────────────────────────────────────
// Blueprint index formatter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats the blueprint object into a clean string for prompt injection.
 */
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
        mod.sections?.forEach(sec => lines.push(`    - ${sec}`));
      });
      if (ch.checklist) lines.push(`  ☐ Checklist: ${ch.checklist}`);
      lines.push('');
    });
  }

  if (blueprint.bonuses?.length) {
    lines.push('BONUS CONTENT');
    lines.push('-------------');
    blueprint.bonuses.forEach((b, i) => {
      lines.push(`Bonus ${i + 1}: ${b.title} [${b.type || 'bonus'}]`);
      if (b.description) lines.push(`  ${b.description}`);
    });
    lines.push('');
  }

  if (blueprint.positioning) {
    lines.push('PRODUCT POSITIONING');
    lines.push('-------------------');
    const p = blueprint.positioning;
    if (p.level)        lines.push(`Level: ${p.level}`);
    if (p.premiumAngle) lines.push(`Premium Angle: ${p.premiumAngle}`);
    if (p.authority)    lines.push(`Authority: ${p.authority}`);
    if (p.perception)   lines.push(`Value Perception: ${p.perception}`);
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Claude URL builder
// ─────────────────────────────────────────────────────────────────────────────

const CLAUDE_URL_LIMIT = 4000; // chars — safe limit for Claude URL param

/**
 * Tries to open Claude AI with the prompt pre-filled in the URL.
 * Falls back to copying to clipboard + opening blank Claude tab if too long.
 *
 * @param {string} prompt — the compiled master prompt
 * @returns {{ method: 'url' | 'clipboard', url: string }}
 */
export function buildClaudeIntent(prompt) {
  const trimmed = prompt.trim();

  if (trimmed.length <= CLAUDE_URL_LIMIT) {
    const encoded = encodeURIComponent(trimmed);
    return {
      method: 'url',
      url: `https://claude.ai/new?q=${encoded}`,
    };
  }

  // Prompt is too long for URL — use clipboard + blank tab
  return {
    method: 'clipboard',
    url: 'https://claude.ai/new',
  };
}
