import { useCallback, useMemo, useState, useEffect } from 'react';
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
import CompareModal        from '../components/CompareModal.jsx';
import IdeaExpandModal     from '../components/IdeaExpandModal.jsx';
import ProductCreationFlow from '../components/ProductCreationFlow.jsx';
import StepTypeSelector from '../components/flow/unified/StepTypeSelector.jsx';

import { fetchProductIdeas, fetchRefinedIdeas } from '../services/geminiService.js';
import { useSavedIdeas }    from '../hooks/useSavedIdeas.js';
import { useSearchHistory } from '../hooks/useSearchHistory.js';
import { isOnboardingDone, getWorkspaceState, saveWorkspaceState } from '../services/storageService.js';
import { exportCSV, exportPDF } from '../utils/exportUtils.js';
import { useBackButton } from '../hooks/useBackButton.js';

function HomePage() {
  const initialWorkspace = getWorkspaceState();
  
  const [status, setStatus] = useState(initialWorkspace.results?.length > 0 ? 'complete' : 'welcome');
  const [query, setQuery] = useState(initialWorkspace.query || 'I am looking for ');
  const [quantity, setQuantity] = useState(5);
  const [creatorType, setCreatorType] = useState(null);

  const [results, setResults] = useState(initialWorkspace.results || []);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const [showTrends, setShowTrends] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showOnboard, setShowOnboard] = useState(() => !isOnboardingDone());

  const [activeTag, setActiveTag] = useState(null);
  const [expandedIdea, setExpandedIdea] = useState(null);
  const [activeIdeaForCreation, setActiveIdeaForCreation] = useState(null);

  const [compareSet, setCompareSet] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const { isSaved, toggleSave, getSaved, unsaveById } = useSavedIdeas();
  const { history, addEntry, removeEntry } = useSearchHistory();

  useBackButton(showGuide, () => setShowGuide(false));
  useBackButton(showVault, () => setShowVault(false));
  useBackButton(showOnboard, () => setShowOnboard(false));
  useBackButton(showCompare, () => setShowCompare(false));
  useBackButton(!!expandedIdea, () => setExpandedIdea(null));
  useBackButton(!!activeIdeaForCreation, () => setActiveIdeaForCreation(null));

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isComplete = status === 'complete';

  useEffect(() => {
    if (status === 'complete' || status === 'search_input') {
      saveWorkspaceState({ results, query });
    }
  }, [results, query, status]);

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

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
    }, 10);
    setShowTrends(false); setShowHistory(false);
    setStatus('loading'); setResults([]); setErrorMsg(''); setActiveTag(null); setCompareSet([]);
    try {
      const typeLabel = creatorType?.title || '';
      const ideas = await fetchProductIdeas(trimmed, quantity, { creatorType: typeLabel });
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
    setStatus('welcome'); setResults([]); setErrorMsg(''); setActiveTag(null); setCompareSet([]); setCreatorType(null);
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

  if (activeIdeaForCreation) {
    return (
      <ProductCreationFlow
        key="creation-flow"
        idea={{ ...activeIdeaForCreation, creatorType: creatorType?.title }}
        onClose={() => setActiveIdeaForCreation(null)}
      />
    );
  }

  return (
    <DashboardLayout onGuide={() => setShowGuide(true)} onVault={() => setShowVault(true)} onHistory={() => setShowHistory(h => !h)}>
      <div className="relative min-h-[calc(100vh-220px)]">
        <AnimatePresence mode="wait">

          {/* ── WELCOME ─────────────────────────────────────────────────── */}
          {status === 'welcome' && (
            <motion.section key="welcome"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mx-auto flex max-w-3xl flex-col items-center justify-center px-5 pt-20 text-center sm:pt-28"
            >
              {/* Atmospheric glow */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(45,125,255,0.12),transparent_70%)]" />
              </div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
                className="relative mb-7 inline-flex items-center gap-2 rounded-full border border-[#2D7DFF]/20 bg-[#2D7DFF]/[0.06] px-4 py-1.5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#2D7DFF] shadow-[0_0_6px_rgba(45,125,255,0.9)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B8DFF]">AI Workflow Engineering Platform</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="relative text-[40px] font-bold leading-[1.1] tracking-tight text-[#F5F7FA] sm:text-[56px] lg:text-[64px]"
              >
                Engineer Premium
                <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4B8DFF 0%, #7AB6FF 100%)' }}>
                  Digital Products.
                </span>
              </motion.h1>

              {/* Subline */}
              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
                className="relative mt-6 max-w-lg text-[16px] leading-[1.75] text-[#A0A7B4]"
              >
                Gapian AI structures the workflow. Claude creates the product.
                Discover profitable ideas, engineer specification systems, and ship professional digital products.
              </motion.p>

              {/* CTA */}
              <motion.button
                type="button" onClick={() => setStatus('select_type')}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                className="relative mt-10 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#2D7DFF] px-10 py-4 text-[15px] font-bold text-white shadow-[0_0_40px_rgba(45,125,255,0.25)] transition-colors duration-300 hover:bg-[#4B8DFF]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Start Creating
              </motion.button>

              {/* Trust signals */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
                className="relative mt-12 flex flex-wrap items-center justify-center gap-6"
              >
                {['Design Specification Engine', 'Claude-Optimized Prompts', '6-Domain Architecture'].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2D7DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-[12px] font-medium text-[#6E7685]">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.section>
          )}

          {/* ── SELECT TYPE ───────────────────────────────────────────── */}
          {status === 'select_type' && (
            <motion.section key="select_type"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }} className="pt-4 sm:pt-6 pb-20"
            >
              <StepTypeSelector 
                data={{ productType: creatorType }}
                updateData={(key, val) => setCreatorType(val)}
                onCanContinue={() => {}} 
              />
              <div className="mx-auto flex max-w-5xl items-center justify-between px-5 sm:px-8">
                <button type="button" onClick={() => setStatus('welcome')}
                  className="text-[13px] font-medium text-[#6E7685] hover:text-white transition-colors">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('search_input')}
                  disabled={!creatorType}
                  className="flex items-center gap-2 rounded-xl bg-[#2D7DFF] px-8 py-3 text-[14px] font-bold text-white shadow-[0_0_20px_rgba(45,125,255,0.15)] transition-all hover:bg-[#4B8DFF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to Topic
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </motion.section>
          )}

          {/* ── SEARCH INPUT PROMPT ───────────────────────────────────── */}
          {status === 'search_input' && (
            <motion.section key="search_input"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex min-h-[40vh] flex-col items-center justify-center px-5 pt-16 text-center sm:pt-24"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#202635] bg-[#0B0B0F] px-4 py-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6E7685]">{creatorType?.title || 'Product'}</span>
                <span className="text-[#3A4352]">·</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2D7DFF]">Topic Input</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">What is your niche?</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#A0A7B4]">
                Enter a specific topic, industry, or audience. Gapian AI will discover profitable product opportunities.
              </p>
              {/* Quick topic chips */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {['Freelance Design', 'AI Productivity', 'Email Marketing', 'Personal Finance', 'Health & Wellness', 'SaaS Growth'].map(chip => (
                  <button key={chip} onClick={() => setQuery(`I am looking for ${chip}`)}
                    className="rounded-lg border border-[#202635] bg-[#050505] px-3 py-1.5 text-[12px] font-medium text-[#A0A7B4] transition-all hover:border-[#2D7DFF]/40 hover:bg-[#2D7DFF]/[0.05] hover:text-[#7AB6FF]">
                    {chip}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-[12px] text-[#3A4352]">Or type your own below ↓</p>
            </motion.section>
          )}

          {/* ── LOADING ───────────────────────────────────────────────── */}
          {isLoading && (
            <motion.section key="loading"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }} className="space-y-10 pt-4 sm:pt-6"
            >
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#2D7DFF]">Generating {quantity} concepts…</p>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
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
                <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-[#202635]">
                  <motion.div
                    className="h-full rounded-full bg-[#2D7DFF]"
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
              transition={{ duration: 0.35 }} className="space-y-6 pt-4 sm:pt-6 pb-20"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D7DFF]">{filteredResults.length} concepts{activeTag ? ` · ${activeTag}` : ''}</p>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Generated concepts</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {compareSet.length === 2 && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setShowCompare(true)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#2D7DFF]/50 bg-[#2D7DFF]/10 px-4 py-2 text-[13px] font-bold text-[#4B8DFF] transition-all hover:bg-[#2D7DFF]/20"
                    >
                      <SquareStack size={13} />Compare
                    </motion.button>
                  )}
                  <button type="button" onClick={() => exportPDF(results)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#202635] bg-[#050505] px-4 py-2 text-[13px] font-bold text-[#A0A7B4] transition-all hover:border-[#3A4352] hover:text-white">
                    <Download size={13} />PDF
                  </button>
                  <button type="button" onClick={() => exportCSV(results)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#202635] bg-[#050505] px-4 py-2 text-[13px] font-bold text-[#A0A7B4] transition-all hover:border-[#3A4352] hover:text-white">
                    <Download size={13} />CSV
                  </button>
                  <button type="button" onClick={handleReset}
                    className="rounded-lg border border-[#202635] bg-[#0B0B0F] px-4 py-2 text-[13px] font-bold text-[#D9DEE7] transition-all hover:border-[#3A4352] hover:text-white">
                    New search
                  </button>
                </div>
              </div>

              <FilterBar tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />

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
                    onCreateProduct={setActiveIdeaForCreation}
                  />
                ))}
              </div>

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
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <AlertCircle size={28} className="text-red-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">Something went wrong</h2>
                <p className="max-w-md whitespace-pre-line text-[14px] leading-relaxed text-[#A0A7B4]">
                  {errorMsg || 'The AI generation failed. Check your API bridge and try again.'}
                </p>
              </div>
              <button type="button" onClick={handleReset}
                className="rounded-lg border border-[#202635] bg-[#0B0B0F] px-6 py-3 text-[14px] font-bold text-[#D9DEE7] transition-all hover:border-[#3A4352] hover:text-white">
                Start Over
              </button>
            </motion.section>
          )}

        </AnimatePresence>
      </div>

      {/* ── SEARCH BAR (Fixed Bottom) ─────────────────────────────────── */}
      {status !== 'welcome' && status !== 'select_type' && (
        <SearchBar
          query={query}           onQueryChange={setQuery}
          quantity={quantity}     onQuantityChange={setQuantity}
          creatorType={creatorType?.title || ''} onCreatorTypeChange={() => {}}
          onSearch={handleSearch} isLoading={isLoading}
          showTrends={showTrends} setShowTrends={setShowTrends} onSelectTrend={handleSelectTrend}
          showHistory={showHistory} setShowHistory={setShowHistory}
          history={history}       onSelectHistory={handleSelectHistory} onRemoveHistory={removeEntry}
        />
      )}

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