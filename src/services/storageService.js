const KEYS = {
  SAVED_IDEAS:    'gapian_saved_ideas',
  SEARCH_HISTORY: 'gapian_search_history',
  RATINGS:        'gapian_ratings',
  ONBOARDING:     'gapian_onboarding_done',
};

function read(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

// ── Saved Ideas ──────────────────────────────────────────────────────────────
export const getSavedIdeas   = ()       => read(KEYS.SAVED_IDEAS, []);
export const isIdeaSaved     = (id)     => getSavedIdeas().some(i => i.id === id);
export const saveIdea        = (idea)   => {
  const list = getSavedIdeas();
  if (!list.find(i => i.id === idea.id)) write(KEYS.SAVED_IDEAS, [idea, ...list]);
};
export const unsaveIdea      = (id)     => write(KEYS.SAVED_IDEAS, getSavedIdeas().filter(i => i.id !== id));

// ── Search History ───────────────────────────────────────────────────────────
export const getSearchHistory  = ()        => read(KEYS.SEARCH_HISTORY, []);
export const addSearchHistory  = (entry)   => {
  const h = getSearchHistory().filter(x => x.query !== entry.query);
  write(KEYS.SEARCH_HISTORY, [entry, ...h].slice(0, 15));
};
export const removeHistoryItem = (query)   => write(KEYS.SEARCH_HISTORY, getSearchHistory().filter(h => h.query !== query));
export const clearSearchHistory = ()       => write(KEYS.SEARCH_HISTORY, []);

// ── Ratings ──────────────────────────────────────────────────────────────────
export const getRatings = ()          => read(KEYS.RATINGS, {});
export const getRating  = (id)        => getRatings()[id] ?? null;
export const setRating  = (id, val)   => {
  const r = getRatings();
  if (val === null) delete r[id]; else r[id] = val;
  write(KEYS.RATINGS, r);
};

// ── Workspace State ─────────────────────────────────────────────────────────
export const getWorkspaceState = () => read('gapian_workspace_state', { results: [], query: 'I am looking for ' });
export const saveWorkspaceState = (state) => write('gapian_workspace_state', state);

// ── Onboarding ───────────────────────────────────────────────────────────────
export const isOnboardingDone  = () => read(KEYS.ONBOARDING, false);
export const setOnboardingDone = () => write(KEYS.ONBOARDING, true);
