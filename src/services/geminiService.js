// Confirmed-available models for this API key (verified via ListModels).
// Ordered best → fastest fallback.
const GEMINI_MODELS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent',
];

/**
 * Fetch digital product ideas from Gemini API.
 * Tries each model in GEMINI_MODELS until one succeeds.
 *
 * @param {string} prompt
 * @param {number} count
 * @returns {Promise<Array<{id:string, title:string, headline:string, description:string}>>}
 */
export async function fetchProductIdeas(prompt, count) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file.');
  }

  const body = {
    contents: [
      {
        parts: [
          {
            text: [
              `You are a digital product strategist. Generate exactly ${count} premium digital product ideas for this niche or query: "${prompt}".`,
              '',
              'Return ONLY a valid JSON array with no extra text, no markdown, no code fences.',
              'Each item must have exactly these three fields:',
              '  "title"       — short product name (4–8 words)',
              '  "headline"    — punchy positioning statement (10–18 words)',
              '  "description" — concise launch-ready description (2–3 sentences)',
              '',
              'Example format:',
              '[',
              '  {',
              '    "title": "AI Fitness Planner",',
              '    "headline": "The smartest way to build a personalized workout business.",',
              '    "description": "An AI-driven fitness planning tool that creates bespoke workout and nutrition plans for clients. Designed for personal trainers and coaches who want to scale their services without sacrificing quality."',
              '  }',
              ']'
            ].join('\n')
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048
    }
  };

  const errors = [];

  // Try each model in order — stop at the first success
  for (const modelUrl of GEMINI_MODELS) {
    const url = `${modelUrl}?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const responseText = await response.text();

      if (!response.ok) {
        // 404 = model not available for this key — try next
        // Other errors we still skip and try next model
        let detail = responseText;
        try {
          detail = JSON.parse(responseText)?.error?.message || responseText;
        } catch { /* use raw */ }
        errors.push(`[${modelUrl.match(/models\/([^:]+)/)?.[1] ?? 'unknown'}] ${response.status}: ${detail}`);
        console.warn(`Gemini model unavailable, trying next…`, errors.at(-1));
        continue;
      }

      // Success — parse and return
      console.info(`Gemini: using model ${modelUrl.match(/models\/([^:]+)/)?.[1]}`);
      return extractAndParseIdeas(responseText, prompt, count);

    } catch (networkError) {
      errors.push(`[network] ${networkError?.message}`);
      console.warn('Gemini network error, trying next model…', networkError);
      continue;
    }
  }

  // All models failed
  throw new Error(
    `All Gemini models failed for this API key. Last errors:\n${errors.slice(-3).join('\n')}`
  );
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

function extractAndParseIdeas(responseText, prompt, count) {
  let envelope = null;
  try {
    envelope = JSON.parse(responseText);
  } catch {
    return parseJsonArray(responseText, prompt, count);
  }

  // Standard Gemini response: candidates[0].content.parts[0].text
  const text = envelope?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

  if (typeof text === 'string') {
    return parseJsonArray(text, prompt, count);
  }

  return parseJsonArray(responseText, prompt, count);
}

function parseJsonArray(text, prompt, count) {
  const cleaned = text.trim();

  // Strip markdown code fences if present
  const stripped = cleaned
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // Try direct parse
  let parsed = tryParse(stripped);
  if (Array.isArray(parsed)) {
    return normalizeIdeas(parsed, prompt, count);
  }

  // Try bracket extraction
  const start = stripped.indexOf('[');
  const end = stripped.lastIndexOf(']');
  if (start !== -1 && end > start) {
    parsed = tryParse(stripped.slice(start, end + 1));
    if (Array.isArray(parsed)) {
      return normalizeIdeas(parsed, prompt, count);
    }
  }

  throw new Error(
    'Gemini returned a response that could not be parsed as JSON. ' +
    'Raw: ' + text.slice(0, 300)
  );
}

function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeIdeas(rawItems, prompt, count) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error('Gemini returned an empty array.');
  }

  return rawItems.slice(0, count).map((item, index) => ({
    id: `${Date.now()}-${index}`,
    title:
      typeof item?.title === 'string' && item.title.trim()
        ? item.title.trim()
        : `${prompt} Idea ${index + 1}`,
    headline:
      typeof item?.headline === 'string' && item.headline.trim()
        ? item.headline.trim()
        : 'A premium digital product concept for modern creators.',
    description:
      typeof item?.description === 'string' && item.description.trim()
        ? item.description.trim()
        : 'A refined concept focused on market-ready positioning and creator-first differentiation.'
  }));
}
