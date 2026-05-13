import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { AlertCircle } from 'lucide-react';

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import SearchBar from '../components/SearchBar.jsx';
import GuideModal from '../components/GuideModal.jsx';
import ResultCard from '../components/ResultCard.jsx';
import LoaderCard from '../components/LoaderCard.jsx';

import { fetchProductIdeas } from '../services/geminiService.js';

const INITIAL_QUERY = 'I am looking for ';

// ---------------------------------------------------------------------------
// Derived view states
// ---------------------------------------------------------------------------
//   idle     → hero section visible, no results
//   loading  → loader cards visible
//   complete → result cards visible
//   error    → error banner visible

function HomePage() {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [quantity, setQuantity] = useState(5);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'complete' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const [showTrends, setShowTrends] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isComplete = status === 'complete';
  const showHero = status === 'idle';

  // Stable placeholder array for skeleton cards
  const placeholderCards = useMemo(
    () =>
      Array.from({ length: Math.max(quantity, 3) }, (_, i) => ({
        id: `loader-${i}`
      })),
    [quantity]
  );

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setShowTrends(false);
    setStatus('loading');
    setResults([]);
    setErrorMessage('');

    try {
      const ideas = await fetchProductIdeas(trimmed, quantity);
      setResults(ideas);
      setStatus('complete');
    } catch (error) {
      console.error('[Gapian] Search failed:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  }, [query, quantity]);

  const handleSelectTrend = useCallback((topic) => {
    setQuery(`I am looking for ${topic}`);
    setShowTrends(false);
  }, []);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setResults([]);
    setErrorMessage('');
  }, []);

  return (
    <DashboardLayout onGuide={() => setShowGuide(true)}>
      <div className="relative min-h-[calc(100vh-220px)]">

        <AnimatePresence mode="wait">

          {/* ── HERO (idle) ─────────────────────────────────────────── */}
          {showHero && (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative mx-auto flex max-w-4xl flex-col items-center justify-center pt-10 text-center"
            >
              {/* Soft Ambient Glow */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-[100px]" />
              </div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative mt-7 max-w-3xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-[#F8FAFC] sm:text-5xl"
              >
                Discover digital product ideas
                <span className="mt-2 block text-[#A5C4FF]">
                  powered by AI intelligence.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="relative mt-6 max-w-xl text-[14px] leading-7 text-[#94A3B8] sm:text-[15px]"
              >
                <TypeAnimation
                  sequence={[
                    'Generate premium creator-focused concepts, positioning headlines, and marketable digital product opportunities instantly.',
                    1000
                  ]}
                  speed={75}
                  cursor={true}
                  repeat={0}
                  className="text-[#94A3B8]"
                />
              </motion.div>

              {/* CTA */}
              <motion.button
                type="button"
                onClick={() => setShowTrends(true)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.26 }}
                className="relative mt-8 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm text-[#CBD5E1] transition-all duration-300 hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/[0.05] hover:text-white"
              >
                Explore trending topics
              </motion.button>
            </motion.section>
          )}

          {/* ── LOADING (skeleton cards) ─────────────────────────────── */}
          {isLoading && (
            <motion.section
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <p className="text-sm text-[#7DA2FF]">Generating {quantity} concepts…</p>
                <h2 className="text-4xl font-display font-semibold tracking-[-0.05em] text-[#F8FAFC]">
                  Working on it
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {placeholderCards.map((item) => (
                  <LoaderCard key={item.id} />
                ))}
              </div>
            </motion.section>
          )}

          {/* ── RESULTS ──────────────────────────────────────────────── */}
          {isComplete && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <p className="text-sm text-[#7DA2FF]">
                  {results.length} concepts generated
                </p>
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-display font-semibold tracking-[-0.05em] text-[#F8FAFC]">
                    Generated concepts
                  </h2>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 transition-all hover:bg-white/10 hover:text-white"
                  >
                    New search
                  </button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {results.map((item) => (
                  <ResultCard key={item.id} idea={item} />
                ))}
              </div>
            </motion.section>
          )}

          {/* ── ERROR ────────────────────────────────────────────────── */}
          {isError && (
            <motion.section
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center gap-6 pt-16 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                <AlertCircle size={28} className="text-red-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-[#F8FAFC]">
                  Something went wrong
                </h2>
                <p className="max-w-md text-sm leading-6 text-[#94A3B8]">
                  {errorMessage || 'The Gemini API request failed. Check your API key and try again.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-white/10 hover:text-white"
              >
                Try again
              </button>
            </motion.section>
          )}

        </AnimatePresence>
      </div>

      {/* Search */}
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onSearch={handleSearch}
        isLoading={isLoading}
        showTrends={showTrends}
        setShowTrends={setShowTrends}
        onSelectTrend={handleSelectTrend}
      />

      {/* Guide */}
      <GuideModal
        open={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </DashboardLayout>
  );
}

export default HomePage;