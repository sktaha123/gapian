import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { AlertCircle, Download, SquareStack } from 'lucide-react';

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import SearchBar       from '../components/SearchBar.jsx';
import GuideModal      from '../components/GuideModal.jsx';
import ResultCard      from '../components/ResultCard.jsx';
import LoaderCard      from '../components/LoaderCard.jsx';
import FilterBar       from '../components/FilterBar.jsx';
import RefinementChat  from '../components/RefinementChat.jsx';
import SavedVault      from '../components/SavedVault.jsx';
import OnboardingModal from '../components/OnboardingModal.jsx';
import CompareModal    from '../components/CompareModal.jsx';


import IdeaExpandModal from '../components/IdeaExpandModal.jsx';

import { fetchProductIdeas, fetchRefinedIdeas } from '../services/geminiService.js';
import { useSavedIdeas }    from '../hooks/useSavedIdeas.js';
import { useSearchHistory } from '../hooks/useSearchHistory.js';
import { isOnboardingDone } from '../services/storageService.js';
import { exportCSV, exportPDF } from '../utils/exportUtils.js';


function HomePage() {
  // ── Search state ────────────────────────────────────────────────────────────
  const [query,       setQuery]       = useState('I am looking for ');
  const [quantity,    setQuantity]    = useState(5);
  const [creatorType, setCreatorType] = useState('');

  // ── Results state ───────────────────────────────────────────────────────────
  const [results,      setResults]      = useState([]);
  const [status,       setStatus]       = useState('idle');   // idle|loading|complete|error
  const [errorMsg,     setErrorMsg]     = useState('');
  const [isRefining,   setIsRefining]   = useState(false);

  // ── UI toggles ──────────────────────────────────────────────────────────────
  const [showTrends,   setShowTrends]   = useState(false);
  const [showHistory,  setShowHistory]  = useState(false);
  const [showGuide,    setShowGuide]    = useState(false);
  const [showVault,    setShowVault]    = useState(false);
  const [showOnboard,  setShowOnboard]  = useState(() => !isOnboardingDone());

  // ── Filter ──────────────────────────────────────────────────────────────────
  const [activeTag, setActiveTag] = useState(null);

  // ── Expand modal ────────────────────────────────────────────────────────────
  const [expandedIdea, setExpandedIdea] = useState(null);

  // ── Compare ─────────────────────────────────────────────────────────────────
  const [compareSet,  setCompareSet]  = useState([]);    // max 2 ideas
  const [showCompare, setShowCompare] = useState(false);

  // ── Hooks ───────────────────────────────────────────────────────────────────
  const { isSaved, toggleSave, getSaved, unsaveById } = useSavedIdeas();
  const { history, addEntry, removeEntry } = useSearchHistory();

  // ── Derived ─────────────────────────────────────────────────────────────────
  const isLoading  = status === 'loading';
  const isError    = status === 'error';
  const isComplete = status === 'complete';
  const showHero   = status === 'idle';

  const allTags = useMemo(() =>
    [...new Set(results.flatMap(r => r.tags || []))],
    [results]
  );

  const filteredResults = useMemo(() =>
    activeTag ? results.filter(r => r.tags?.includes(activeTag)) : results,
    [results, activeTag]
  );

  const placeholderCards = useMemo(
    () => Array.from({ length: Math.max(quantity, 3) }, (_, i) => ({ id: `loader-${i}` })),
    [quantity]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    // Robust reset for mobile/desktop
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
    }, 10);
    setShowTrends(false); setShowHistory(false);
    setStatus('loading'); setResults([]); setErrorMsg(''); setActiveTag(null); setCompareSet([]);
    try {
      const ideas = await fetchProductIdeas(trimmed, quantity, { creatorType });
      setResults(ideas);
      setStatus('complete');
      addEntry(trimmed, quantity);
    } catch (err) {
      console.error('[Gapian] Search failed:', err);
      setErrorMsg(err?.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  }, [query, quantity, creatorType, addEntry]);

  const handleRefine = useCallback(async (instruction) => {
    setIsRefining(true);
    try {
      const refined = await fetchRefinedIdeas(results, instruction, quantity);
      setResults(refined);
      setActiveTag(null);
      setCompareSet([]);
    } finally {
      setIsRefining(false);
    }
  }, [results, quantity]);

  const handleSelectTrend = useCallback((topic) => {
    setQuery(`I am looking for ${topic}`);
    setShowTrends(false);
  }, []);

  const handleSelectHistory = useCallback((q) => {
    setQuery(q);
  }, []);

  const handleReset = useCallback(() => {
    setStatus('idle'); setResults([]); setErrorMsg(''); setActiveTag(null); setCompareSet([]);
  }, []);

  const handleToggleCompare = useCallback((idea) => {
    setCompareSet(prev => {
      const exists = prev.find(i => i.id === idea.id);
      if (exists) return prev.filter(i => i.id !== idea.id);
      if (prev.length >= 2) return [prev[1], idea];
      return [...prev, idea];
    });
  }, []);

  const handleUnsave = useCallback((id) => {
    unsaveById(id);
  }, [unsaveById]);

  return (
    <DashboardLayout onGuide={() => setShowGuide(true)} onVault={() => setShowVault(true)} onHistory={() => setShowHistory(h => !h)}>
      <div className="relative min-h-[calc(100vh-220px)]">
        <AnimatePresence mode="wait">

          {/* ── HERO ─────────────────────────────────────────────────── */}
          {showHero && (
            <motion.section key="hero"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative mx-auto flex max-w-4xl flex-col items-center justify-center pt-10 text-center"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-[100px]" />
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                className="relative mt-7 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.04em] text-[#F8FAFC] sm:text-4xl lg:text-5xl"
              >
                Discover digital product ideas
                <span className="mt-2 block text-[#A5C4FF]">powered by AI intelligence.</span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
                className="relative mt-6 max-w-xl text-[14px] leading-7 text-[#94A3B8] sm:text-[15px]"
              >
                <TypeAnimation
                  sequence={['Generate premium creator-focused concepts, positioning headlines, and marketable digital product opportunities instantly.', 1000]}
                  speed={75} cursor repeat={0} className="text-[#94A3B8]"
                />
              </motion.div>
              <motion.button
                type="button" onClick={() => setShowTrends(true)}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }}
                className="relative mt-8 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm text-[#CBD5E1] transition-all duration-300 hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/[0.05] hover:text-white"
              >
                Explore trending topics
              </motion.button>
            </motion.section>
          )}

          {/* ── LOADING ───────────────────────────────────────────────── */}
          {isLoading && (
            <motion.section key="loading"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }} className="space-y-10 pt-4 sm:pt-6"
            >
              <div className="space-y-4">
                <p className="text-sm text-[#7DA2FF]">Generating {quantity} concepts…</p>
                <h2 className="text-2xl font-display font-semibold tracking-[-0.04em] text-[#F8FAFC] sm:text-3xl lg:text-4xl">
                  <TypeAnimation
                    sequence={[
                      'Working on it', 1000,
                      'Analyzing markets', 1000,
                      'Curating concepts', 1000,
                      'Crafting strategy', 1000,
                      'Finalizing ideas', 1000
                    ]}
                    repeat={Infinity}
                    cursor={false}
                  />
                </h2>
                {/* Progress bar */}
                <div className="h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: ['0%', '40%', '70%', '90%'] }}
                    transition={{ duration: 8, ease: 'easeInOut', times: [0, 0.3, 0.6, 1] }}
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {placeholderCards.map(item => <LoaderCard key={item.id} />)}
              </div>
            </motion.section>
          )}

          {/* ── RESULTS ───────────────────────────────────────────────── */}
          {isComplete && (
            <motion.section key="results"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }} className="space-y-6 pt-4 sm:pt-6"
            >
              {/* Header row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm text-[#7DA2FF]">{filteredResults.length} concepts{activeTag ? ` · ${activeTag}` : ''}</p>
                  <h2 className="text-2xl font-display font-semibold tracking-[-0.04em] text-[#F8FAFC] sm:text-3xl lg:text-4xl">Generated concepts</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Compare button */}
                  {compareSet.length === 2 && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setShowCompare(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-[13px] font-medium text-blue-300 transition-all hover:bg-blue-500/20"
                    >
                      <SquareStack size={13} />Compare 2
                    </motion.button>
                  )}
                  <button type="button" onClick={() => exportPDF(results)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-[13px] font-medium text-blue-300 transition-all hover:bg-blue-500/20">
                    <Download size={13} />PDF
                  </button>
                  <button type="button" onClick={() => exportCSV(results)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-slate-400 transition-all hover:bg-white/10 hover:text-white">
                    <Download size={13} />CSV
                  </button>
                  <button type="button" onClick={handleReset}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 transition-all hover:bg-white/10 hover:text-white">
                    New search
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <FilterBar tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />

              {/* Cards grid */}
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredResults.map(item => (
                  <ResultCard
                    key={item.id}
                    idea={item}
                    isSaved={isSaved(item.id)}
                    onToggleSave={toggleSave}
                    onExpand={setExpandedIdea}
                    isSelected={compareSet.some(c => c.id === item.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>

              {/* Refinement chat */}
              <RefinementChat ideas={results} count={quantity} onRefined={handleRefine} isLoading={isRefining} />
            </motion.section>
          )}

          {/* ── ERROR ─────────────────────────────────────────────────── */}
          {isError && (
            <motion.section key="error"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center gap-6 pt-16 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                <AlertCircle size={28} className="text-red-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-[#F8FAFC]">Something went wrong</h2>
                <p className="max-w-md whitespace-pre-line text-sm leading-6 text-[#94A3B8]">
                  {errorMsg || 'The Gemini API request failed. Check your API key and try again.'}
                </p>
              </div>
              <button type="button" onClick={handleReset}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-white/10 hover:text-white">
                Try again
              </button>
            </motion.section>
          )}

        </AnimatePresence>
      </div>

      {/* Search bar */}
      <SearchBar
        query={query}           onQueryChange={setQuery}
        quantity={quantity}     onQuantityChange={setQuantity}
        creatorType={creatorType} onCreatorTypeChange={setCreatorType}
        onSearch={handleSearch} isLoading={isLoading}
        showTrends={showTrends} setShowTrends={setShowTrends} onSelectTrend={handleSelectTrend}
        showHistory={showHistory} setShowHistory={setShowHistory}
        history={history}       onSelectHistory={handleSelectHistory} onRemoveHistory={removeEntry}
      />

      {/* Modals */}
      <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
      <OnboardingModal open={showOnboard} onClose={() => setShowOnboard(false)} />
      <SavedVault open={showVault} onClose={() => setShowVault(false)} getSaved={getSaved} onUnsave={handleUnsave} />

      <AnimatePresence>
        {expandedIdea && (
          <IdeaExpandModal key="expand" idea={expandedIdea} onClose={() => setExpandedIdea(null)} />
        )}
        {showCompare && compareSet.length === 2 && (
          <CompareModal key="compare" ideaA={compareSet[0]} ideaB={compareSet[1]} onClose={() => setShowCompare(false)} />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default HomePage;