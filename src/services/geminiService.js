const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function fetchProductIdeas(prompt, count) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.');
    return createFallbackIdeas(prompt, count);
  }

  const url = `${GEMINI_ENDPOINT}?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `Generate premium digital product ideas for the niche: ${prompt}. Return ONLY valid JSON array with fields: title, headline, description.`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();
    console.log('[Gemini API] Raw response:', responseText);

    if (!response.ok) {
      console.error('Gemini API error', response.status, responseText);
      return createFallbackIdeas(prompt, count);
    }

    const parsedIdeas = await extractIdeasFromResponse(responseText);
    console.log('[Gemini API] Extracted ideas:', parsedIdeas);
    const finalResult = parseIdeas(parsedIdeas, prompt, count);
    console.log('[Gemini API] Final output:', finalResult);
    return finalResult;
  } catch (error) {
    console.error('Gemini request failed', error);
    return createFallbackIdeas(prompt, count);
  }
}

async function extractIdeasFromResponse(responseText) {
  const trimmed = responseText.trim();
  console.log('[Gemini Parser] Trimmed response:', trimmed.substring(0, 200) + '...');

  // Try raw JSON parse first.
  const parsed = tryParseJson(trimmed);
  if (Array.isArray(parsed)) {
    console.log('[Gemini Parser] ✓ Parsed as direct JSON array');
    return parsed;
  }

  if (parsed && typeof parsed === 'object') {
    console.log('[Gemini Parser] Response is an object, extracting text...');
    const candidateText = extractTextFromGeminiObject(parsed);
    if (typeof candidateText === 'string') {
      console.log('[Gemini Parser] Extracted text:', candidateText.substring(0, 200) + '...');
      const candidateParsed = tryParseJson(candidateText);
      if (Array.isArray(candidateParsed)) {
        console.log('[Gemini Parser] ✓ Parsed extracted text as JSON array');
        return candidateParsed;
      }
      console.log('[Gemini Parser] Trying safe parse on extracted text...');
      return safeParseJsonArray(candidateText);
    }
  }

  console.log('[Gemini Parser] Trying safe parse on trimmed response...');
  return safeParseJsonArray(trimmed);
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractTextFromGeminiObject(data) {
  if (Array.isArray(data.candidates) && data.candidates.length > 0) {
    const firstCandidate = data.candidates[0];

    if (typeof firstCandidate?.content === 'string') {
      return firstCandidate.content;
    }

    if (Array.isArray(firstCandidate?.content) && firstCandidate.content.length > 0) {
      const firstContent = firstCandidate.content[0];
      return firstContent?.text || firstContent?.content || null;
    }

    if (Array.isArray(firstCandidate?.output) && firstCandidate.output.length > 0) {
      const firstOutput = firstCandidate.output[0];
      if (typeof firstOutput?.content === 'string') {
        return firstOutput.content;
      }
      if (Array.isArray(firstOutput?.content) && firstOutput.content.length > 0) {
        return firstOutput.content[0]?.text || firstOutput.content[0]?.content || null;
      }
      return firstOutput?.text || firstOutput?.content || null;
    }
  }

  if (Array.isArray(data.output) && data.output.length > 0) {
    const firstOutput = data.output[0];
    if (typeof firstOutput?.content === 'string') {
      return firstOutput.content;
    }
    if (Array.isArray(firstOutput?.content) && firstOutput.content.length > 0) {
      return firstOutput.content[0]?.text || firstOutput.content[0]?.content || null;
    }
    return firstOutput?.text || firstOutput?.content || null;
  }

  if (typeof data.response === 'string') {
    return data.response;
  }

  if (typeof data.content === 'string') {
    return data.content;
  }

  return null;
}

function safeParseJsonArray(text) {
  const cleaned = text.trim();

  if (!cleaned) {
    return [];
  }

  const direct = tryParseJson(cleaned);
  if (Array.isArray(direct)) {
    return direct;
  }

  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    const snippet = cleaned.slice(start, end + 1);
    return tryParseJson(snippet) || [];
  }

  return [];
}

function parseIdeas(rawIdeas, prompt, count) {
  if (!Array.isArray(rawIdeas) || rawIdeas.length === 0) {
    return createFallbackIdeas(prompt, count);
  }

  return rawIdeas.slice(0, count).map((item, index) => ({
    id: `${Date.now()}-${index}`,
    title: item?.title || `Premium product idea ${index + 1}`,
    headline:
      item?.headline || 'A premium positioning headline designed for modern creators.',
    description:
      item?.description ||
      'A refined digital product concept focused on market-ready positioning and creator-first differentiation.'
  }));
}

function createFallbackIdeas(prompt, count) {
  return Array.from({ length: count }).map((_, index) => ({
    id: `fallback-${Date.now()}-${index}`,
    title: `${prompt} Concept ${index + 1}`,
    headline: 'Premium idea derived from your prompt when Gemini could not return valid JSON.',
    description:
      'Fallback concept used when the Gemini API response could not be parsed safely. Replace this with a real idea once the API returns a valid JSON array.'
  }));
}
