import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import SearchBar from '../components/SearchBar.jsx';
import GuideModal from '../components/GuideModal.jsx';
import ResultCard from '../components/ResultCard.jsx';
import LoaderCard from '../components/LoaderCard.jsx';

import { fetchProductIdeas } from '../services/geminiService.js';

const initialQuery = 'I am looking for ';

function HomePage() {
  const [query, setQuery] = useState(initialQuery);
  const [quantity, setQuantity] = useState(5);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');

  const [showTrends, setShowTrends] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isLoading = status === 'loading';
  const hasResults = results.length > 0;

  const placeholderCards = useMemo(
    () =>
      Array.from(
        { length: Math.max(quantity, 3) },
        (_, index) => ({
          id: `loader-${index}`
        })
      ),
    [quantity]
  );

  const handleSearch = async () => {
    if (!query.trim()) return;

    setShowTrends(false);
    setStatus('loading');
    setResults([]);

    try {
      const ideas = await fetchProductIdeas(query, quantity);

      setResults(ideas);
      setStatus('complete');
    } catch (error) {
      console.error('Search failed', error);
      setStatus('error');
    }
  };

  const handleSelectTrend = (topic) => {
    setQuery(`I am looking for ${topic}`);
    setShowTrends(false);
  };

  return (
    <DashboardLayout onGuide={() => setShowGuide(true)}>
      <div className="relative min-h-[calc(100vh-220px)]">
        
        <AnimatePresence mode="wait">
          {!hasResults ? (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="
                mx-auto
                flex
                max-w-5xl
                flex-col
                items-center
                justify-center
                pt-20
                text-center
              "
            >
              {/* Small Label */}
              <p className="text-xs uppercase tracking-[0.28em] text-[#7DA2FF]">
                Creator Intelligence Platform
              </p>

              {/* Main Heading */}
              <h1
                className="
                  mt-8
                  max-w-5xl
                  text-5xl
                  font-medium
                  leading-[1.05]
                  tracking-[-0.06em]
                  text-[#F8FAFC]
                  sm:text-7xl
                "
              >
                Creator intelligence for modern digital products.
              </h1>

              {/* Supporting Text */}
              <p
                className="
                  mt-8
                  max-w-2xl
                  text-lg
                  leading-8
                  text-[#94A3B8]
                "
              >
                Generate premium digital product concepts,
                positioning headlines, and creator-focused launch ideas
                using a cinematic AI-native workspace.
              </p>

              {/* Trends CTA */}
              <button
                type="button"
                onClick={() => setShowTrends(true)}
                className="
                  mt-12
                  text-sm
                  text-[#7DA2FF]
                  transition-all
                  duration-300
                  hover:text-[#A5C4FF]
                "
              >
                Search trending topics
              </button>
            </motion.section>
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-10"
            >
              {/* Results Header */}
              <div className="space-y-4">
                <p className="text-sm text-[#7DA2FF]">
                  {results.length} concepts generated
                </p>

                <h2
                  className="
                    text-4xl
                    font-medium
                    tracking-[-0.05em]
                    text-[#F8FAFC]
                  "
                >
                  Generated concepts
                </h2>
              </div>

              {/* Loading */}
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {placeholderCards.map((item) => (
                    <LoaderCard key={item.id} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {results.map((item) => (
                    <ResultCard key={item.id} idea={item} />
                  ))}
                </div>
              )}
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