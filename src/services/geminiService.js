// Available models — ordered best → fastest fallback
// Replace your old array with this one:
// Updated for 2026 support
const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3-flash'
];

// In-memory cache (per session)
const cache = new Map();

/**
 * Shared fetch helper — routes through Vertex AI endpoints
 * This implementation targets the Vertex AI REST API which consumes GCP credits.
 */
async function callGemini(prompt, extraConfig = {}) {
  // --- PRODUCTION ROUTING ---
  // If in Production, use the Backend API route instead of the local bridge
  if (import.meta.env.PROD) {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server Error');
      return data.text;
    } catch (err) {
      console.error('Production API Error:', err);
      throw err;
    }
  }
  // --------------------------

  const projectId = import.meta.env.VITE_GCP_PROJECT_ID;
  const location = import.meta.env.VITE_GCP_LOCATION || 'us-central1';

  if (projectId === 'your-project-id' || !projectId) {
    throw new Error('GCP Project ID not configured. Please set VITE_GCP_PROJECT_ID in your .env file.');
  }

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 4096,
      ...extraConfig,
    },
  };

  // Note: For client-side requests to Vertex AI, we need an OAuth2 token.
  // In a local/dev environment, we use a bridge or proxy that uses ADC.
  const token = await getAuthToken();

  const httpErrors = [];
  for (const model of GEMINI_MODELS) {
    const domain = location === 'global' ? 'aiplatform.googleapis.com' : `${location}-aiplatform.googleapis.com`;
    const url = `https://${domain}/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

    let responseText;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      responseText = await res.text();

      if (!res.ok) {
        let detail = responseText;
        try { detail = JSON.parse(responseText)?.error?.message || responseText; } catch { }
        if (res.status === 404) {
          httpErrors.push(`[${model}] 404: Not Found. Ensure Vertex AI API is enabled in project "${projectId}" and the model "${model}" is available in "${location}".`);
          continue;
        }
        if (res.status === 429) throw new Error('Rate limit reached on Vertex AI.');
        if (res.status === 401) throw new Error('Authentication failed. Ensure your GCP token is valid.');
        httpErrors.push(`[${model}] ${res.status}: ${detail}`);
        continue;
      }
    } catch (err) {
      if (err.message.includes('Rate limit')) throw err;
      httpErrors.push(`[${model}] Network/Auth: ${err.message}`);
      continue;
    }
    return extractText(responseText);
  }
  throw new Error(`Vertex AI calls failed:\n${httpErrors.join('\n')}`);
}

/**
 * Helper to get a valid GCP Access Token.
 * In a real-world app, this would come from a backend or Firebase Auth.
 * For this refactor, we look for VITE_GCP_ACCESS_TOKEN or use a local bridge.
 */
async function getAuthToken() {
  // 1. Check if token is directly provided (for quick testing)
  const manualToken = import.meta.env.VITE_GCP_ACCESS_TOKEN;
  if (manualToken) return manualToken;

  // 2. Otherwise, attempt to fetch from a local bridge (Vertex Proxy)
  // This bridge uses ADC (Application Default Credentials) on your machine.
  try {
    const res = await fetch('http://localhost:3002/token');
    if (res.ok) {
      const data = await res.json();
      return data.token;
    }
  } catch (e) {
    // Bridge not running
  }

  throw new Error('No authentication method found for Vertex AI. Please run the Vertex Bridge (npm run bridge) or provide VITE_GCP_ACCESS_TOKEN.');
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Main idea generation (enriched schema)
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchProductIdeas(prompt, count, options = {}) {
  const { creatorType = '' } = options;
  const cacheKey = `ideas:${prompt}:${count}:${creatorType}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const creatorHint = creatorType ? ` The creator type is: ${creatorType}.` : '';

  const prompt_ = [
    `You are a digital product strategist.${creatorHint}`,
    `Generate exactly ${count} premium digital product ideas for: "${prompt}".`,
    '',
    'Return ONLY a valid JSON array. Each item MUST have these fields:',
    '  "title"       — product name (4-8 words)',
    '  "headline"    — punchy positioning statement (10-18 words)',
    '  "description" — launch-ready description (2-3 sentences)',
    '  "score"       — market opportunity integer 1-10',
    '  "tags"        — array of 1-3 category strings e.g. ["SaaS","Productivity"]',
    '  "pricing"     — suggested pricing string e.g. "$29/mo or $149 one-time"',
    '  "audience"    — one-sentence target audience description',
    '',
    'No markdown, no code fences, no extra text.',
  ].join('\n');

  const raw = await callGemini(prompt_);
  const ideas = parseArray(raw).map((item, i) => normalizeIdea(item, prompt, i));

  cache.set(cacheKey, ideas);
  return ideas;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. On-demand deep-dive for a single idea
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchIdeaDetails(idea) {
  const cacheKey = `details:${idea.id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const prompt = [
    `Analyze this digital product idea: "${idea.title}" — ${idea.headline}`,
    '',
    'Return ONLY a valid JSON object with these fields:',
    '  "competitors"     — array of 4 existing competitor names (strings)',
    '  "gap"             — one sentence on your unique differentiation',
    '  "roadmap"         — object with keys "day30", "day60", "day90", each an array of 3 action strings',
    '  "seoKeywords"     — array of 8 SEO keyword strings',
    '  "emailSubjects"   — array of 5 email subject line strings',
    '  "twitterThread"   — array of 5 tweet strings (each max 280 chars)',
    '  "revenueEstimate" — string like "$3,000-$10,000/mo at 200 users"',
    '',
    'No markdown, no extra text.',
  ].join('\n');

  const raw = await callGemini(prompt, { temperature: 0.7 });
  const result = parseObject(raw);
  cache.set(cacheKey, result);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Generate a full product blueprint from an idea (STEP 2)
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchProductBlueprint(idea) {
  const cacheKey = `blueprint:${idea.id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const prompt = [
    `You are an elite digital product architect.`,
    `Create a COMPLETE, PROFESSIONAL PRODUCT BLUEPRINT for this digital product:`,
    `Title: "${idea.title}"`,
    `Subtitle: "${idea.headline}"`,
    `Description: "${idea.description}"`,
    `Target Audience: "${idea.audience}"`,
    ``,
    `Return ONLY a valid JSON object with this EXACT structure:`,
    `{`,
    `  "overview": {`,
    `    "goal": "string — the single core outcome this product delivers",`,
    `    "audience": "string — specific audience description",`,
    `    "problemsSolved": ["string", "string", "string"],`,
    `    "transformation": "string — the before/after transformation",`,
    `    "monetization": "string — monetization potential description",`,
    `    "positioning": "string — market positioning statement"`,
    `  },`,
    `  "chapters": [`,
    `    {`,
    `      "title": "string",`,
    `      "subtitle": "string",`,
    `      "modules": [`,
    `        {`,
    `          "title": "string",`,
    `          "sections": ["string", "string", "string"]`,
    `        }`,
    `      ],`,
    `      "checklist": "string — name of the chapter checklist"`,
    `    }`,
    `  ],`,
    `  "bonuses": [`,
    `    {`,
    `      "title": "string",`,
    `      "description": "string",`,
    `      "type": "worksheet|template|swipe-file|prompt-pack|resource|checklist"`,
    `    }`,
    `  ],`,
    `  "positioning": {`,
    `    "level": "Beginner|Intermediate|Advanced|All Levels",`,
    `    "premiumAngle": "string — why this commands a premium price",`,
    `    "authority": "string — authority positioning statement",`,
    `    "perception": "string — perceived value description"`,
    `  }`,
    `}`,
    ``,
    `Requirements:`,
    `- Generate exactly 6-8 chapters`,
    `- Each chapter must have 2-3 modules`,
    `- Each module must have 3-4 sections`,
    `- Generate exactly 4-5 bonuses`,
    `- Make every field specific to the product concept — no generic placeholders`,
    `- No markdown, no code fences, no extra text.`,
  ].join('\n');

  const raw = await callGemini(prompt, { temperature: 0.7, maxOutputTokens: 8192 });
  const result = parseObject(raw);
  cache.set(cacheKey, result);
  return result;
}


export async function fetchRefinedIdeas(ideas, instruction, count) {
  const existing = ideas.map(i => i.title).join(', ');
  const prompt = [
    `You previously generated these product ideas: ${existing}.`,
    `Now refine them based on this instruction: "${instruction}".`,
    `Return exactly ${count} improved ideas as a JSON array with the same fields:`,
    '  "title", "headline", "description", "score" (1-10), "tags" (array), "pricing", "audience"',
    'No markdown, no extra text.',
  ].join('\n');

  const raw = await callGemini(prompt);
  return parseArray(raw).map((item, i) => normalizeIdea(item, instruction, i));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Compare two ideas head-to-head
// ─────────────────────────────────────────────────────────────────────────────
export async function compareIdeas(ideaA, ideaB) {
  const cacheKey = `compare:${ideaA.id}:${ideaB.id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const prompt = [
    `Compare these two digital product ideas head-to-head:`,
    `A: "${ideaA.title}" — ${ideaA.headline}`,
    `B: "${ideaB.title}" — ${ideaB.headline}`,
    '',
    'Return ONLY a valid JSON object with:',
    '  "winner"         — "A" or "B"',
    '  "summary"        — 2-sentence overall comparison',
    '  "categories"     — array of 5 objects: { "label": string, "a": string, "b": string, "winner": "A"|"B" }',
    '    Use labels: "Market Size", "Competition", "Monetization", "Build Difficulty", "Time to Revenue"',
    '  "recommendation" — 2-sentence final recommendation',
    'No markdown, no extra text.',
  ].join('\n');

  const raw = await callGemini(prompt);
  const result = parseObject(raw);
  cache.set(cacheKey, result);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Manual Flow Generators
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchFontRecommendations(idea) {
  const cacheKey = `fonts:${idea.id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const prompt = [
    `You are a master digital product designer.`,
    `Recommend a premium 3-font typography pairing for this product:`,
    `Title: ${idea.title}`,
    `Audience: ${idea.audience}`,
    `Return ONLY a JSON object:`,
    `{`,
    `  "heading": {"name": "Font Name", "url": "https://fonts.google.com/specimen/...", "why": "Why this works"},`,
    `  "body": {"name": "Font Name", "url": "https://fonts.google.com/specimen/...", "why": "Why this works"},`,
    `  "accent": {"name": "Font Name", "url": "https://fonts.google.com/specimen/...", "why": "Why this works"}`,
    `}`,
    `No markdown.`
  ].join('\n');

  const raw = await callGemini(prompt, { temperature: 0.7 });
  const result = parseObject(raw);
  cache.set(cacheKey, result);
  return result;
}

export async function fetchColorPalette(idea) {
  const cacheKey = `colors:${idea.id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const prompt = [
    `You are a master digital product designer.`,
    `Recommend a premium color palette for this product:`,
    `Title: ${idea.title}`,
    `Audience: ${idea.audience}`,
    `Return ONLY a JSON object:`,
    `{`,
    `  "primary": "#HEX",`,
    `  "secondary": "#HEX",`,
    `  "accent": "#HEX",`,
    `  "background": "#HEX",`,
    `  "text": "#HEX",`,
    `  "rationale": "2-3 sentences explaining the psychological impact",`,
    `  "mood": "Short mood description"`,
    `}`,
    `No markdown.`
  ].join('\n');

  const raw = await callGemini(prompt, { temperature: 0.7 });
  const result = parseObject(raw);
  cache.set(cacheKey, result);
  return result;
}

export async function fetchCoverDesignPrompts(idea, theme) {
  const cacheKey = `cover:${idea.id}:${theme.name}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const prompt = [
    `You are a master digital product designer and AI prompt engineer.`,
    `Create cover design image prompts for this product:`,
    `Title: ${idea.title}`,
    `Subtitle: ${idea.headline}`,
    `Color Theme: ${theme.name}`,
    `Return ONLY a JSON object:`,
    `{`,
    `  "front": "Ideogram.ai prompt for the front cover. Make it premium, describe lighting, typography, background.",`,
    `  "back": "Ideogram.ai prompt for the back cover or background texture.",`,
    `  "composition": "Short description of the layout",`,
    `  "canvaSearch": ["search term 1", "search term 2", "search term 3"]`,
    `}`,
    `No markdown.`
  ].join('\n');

  const raw = await callGemini(prompt, { temperature: 0.7 });
  const result = parseObject(raw);
  cache.set(cacheKey, result);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core parsers & helpers
// ─────────────────────────────────────────────────────────────────────────────
function stripFences(text) {
  return text.trim()
    .replace(/^```json\s*/im, '').replace(/^```\s*/im, '').replace(/```\s*$/im, '')
    .trim();
}

function parseArray(text) {
  const s = stripFences(text);
  let parsed = tryParse(s);
  if (Array.isArray(parsed)) return parsed;

  // bracket extraction
  const start = s.indexOf('[');
  if (start !== -1) {
    let depth = 0, end = -1;
    for (let i = start; i < s.length; i++) {
      if (s[i] === '[') depth++;
      else if (s[i] === ']' && --depth === 0) { end = i; break; }
    }
    if (end > start) { parsed = tryParse(s.slice(start, end + 1)); if (Array.isArray(parsed)) return parsed; }
  }
  throw new Error('Could not parse AI response as JSON array.\nRaw: ' + text.slice(0, 300));
}

function parseObject(text) {
  const s = stripFences(text);
  let parsed = tryParse(s);
  if (parsed && typeof parsed === 'object') return parsed;

  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start !== -1 && end > start) { parsed = tryParse(s.slice(start, end + 1)); if (parsed) return parsed; }
  throw new Error('Could not parse AI response as JSON object.\nRaw: ' + text.slice(0, 300));
}

function tryParse(text) { try { return JSON.parse(text); } catch { return null; } }

function normalizeIdea(item, prompt, index) {
  const score = Number(item?.score);
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    title: str(item?.title) || `${prompt} Idea ${index + 1}`,
    headline: str(item?.headline) || 'A premium digital product concept.',
    description: str(item?.description) || 'A refined concept for modern creators.',
    score: Number.isFinite(score) && score >= 1 && score <= 10 ? score : 7,
    tags: Array.isArray(item?.tags) ? item.tags.filter(Boolean).slice(0, 3) : [],
    pricing: str(item?.pricing) || 'TBD',
    audience: str(item?.audience) || 'Creators and entrepreneurs.',
  };
}

function str(v) { return typeof v === 'string' && v.trim() ? v.trim() : ''; }

function extractText(responseText) {
  try {
    const json = JSON.parse(responseText);
    // Vertex AI response structure: candidates[0].content.parts[0].text
    return json.candidates[0].content.parts[0].text;
  } catch (e) {
    throw new Error('Failed to extract text from Vertex response. Raw: ' + responseText);
  }
}
