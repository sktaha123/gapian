// Available models — ordered best → fastest fallback
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// In-memory cache (per session)
const cache = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// Shared fetch helper — retries across models on HTTP / network failure only
// ─────────────────────────────────────────────────────────────────────────────
async function callGemini(apiKey, prompt, extraConfig = {}) {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      ...extraConfig,
    },
  };

  const httpErrors = [];
  for (const model of GEMINI_MODELS) {
    const url = `${BASE}/${model}:generateContent?key=${apiKey}`;
    let responseText;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      responseText = await res.text();
      if (!res.ok) {
        let detail = responseText;
        try { detail = JSON.parse(responseText)?.error?.message || responseText; } catch {}
        if (res.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.');
        httpErrors.push(`[${model}] ${res.status}: ${detail}`);
        continue;
      }
    } catch (err) {
      if (err.message.includes('Rate limit')) throw err;
      httpErrors.push(`[${model}] Network: ${err.message}`);
      continue;
    }
    // HTTP success — parse and return text content
    return extractText(responseText);
  }
  throw new Error(`All models failed:\n${httpErrors.join('\n')}`);
}

function extractText(responseText) {
  try {
    const envelope = JSON.parse(responseText);
    return envelope?.candidates?.[0]?.content?.parts?.[0]?.text ?? responseText;
  } catch {
    return responseText;
  }
}

function getApiKey() {
  const k = import.meta.env.VITE_GEMINI_API_KEY;
  if (!k) throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file or Vercel environment variables.');
  return k;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Main idea generation (enriched schema)
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchProductIdeas(prompt, count, options = {}) {
  const { language = 'English', creatorType = '' } = options;
  const cacheKey = `ideas:${prompt}:${count}:${language}:${creatorType}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const apiKey = getApiKey();
  const creatorHint = creatorType ? ` The creator type is: ${creatorType}.` : '';
  const langHint    = language !== 'English' ? ` Respond in ${language}.` : '';

  const prompt_ = [
    `You are a digital product strategist.${creatorHint}${langHint}`,
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

  const raw  = await callGemini(apiKey, prompt_);
  const ideas = parseArray(raw).map((item, i) => normalizeIdea(item, prompt, i));

  cache.set(cacheKey, ideas);
  return ideas;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. On-demand deep-dive for a single idea
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchIdeaDetails(idea) {
  const apiKey = getApiKey();
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

  const raw    = await callGemini(apiKey, prompt, { temperature: 0.7 });
  const result = parseObject(raw);
  cache.set(cacheKey, result);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Refine all results with a follow-up instruction
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchRefinedIdeas(ideas, instruction, count) {
  const apiKey = getApiKey();

  const existing = ideas.map(i => i.title).join(', ');
  const prompt = [
    `You previously generated these product ideas: ${existing}.`,
    `Now refine them based on this instruction: "${instruction}".`,
    `Return exactly ${count} improved ideas as a JSON array with the same fields:`,
    '  "title", "headline", "description", "score" (1-10), "tags" (array), "pricing", "audience"',
    'No markdown, no extra text.',
  ].join('\n');

  const raw = await callGemini(apiKey, prompt);
  return parseArray(raw).map((item, i) => normalizeIdea(item, instruction, i));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Compare two ideas head-to-head
// ─────────────────────────────────────────────────────────────────────────────
export async function compareIdeas(ideaA, ideaB) {
  const apiKey = getApiKey();
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

  const raw    = await callGemini(apiKey, prompt, { temperature: 0.6 });
  const result = parseObject(raw);
  cache.set(cacheKey, result);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parsing helpers
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
  const end   = s.lastIndexOf('}');
  if (start !== -1 && end > start) { parsed = tryParse(s.slice(start, end + 1)); if (parsed) return parsed; }
  throw new Error('Could not parse AI response as JSON object.\nRaw: ' + text.slice(0, 300));
}

function tryParse(text) { try { return JSON.parse(text); } catch { return null; } }

function normalizeIdea(item, prompt, index) {
  const score = Number(item?.score);
  return {
    id:          `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    title:       str(item?.title)       || `${prompt} Idea ${index + 1}`,
    headline:    str(item?.headline)    || 'A premium digital product concept.',
    description: str(item?.description) || 'A refined concept for modern creators.',
    score:       Number.isFinite(score) && score >= 1 && score <= 10 ? score : 7,
    tags:        Array.isArray(item?.tags) ? item.tags.filter(Boolean).slice(0, 3) : [],
    pricing:     str(item?.pricing)     || 'TBD',
    audience:    str(item?.audience)    || 'Creators and entrepreneurs.',
  };
}

function str(v) { return typeof v === 'string' && v.trim() ? v.trim() : ''; }
