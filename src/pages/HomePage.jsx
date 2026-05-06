import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

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
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.4 }}
  className="
    relative
    mx-auto
    flex
    max-w-4xl
    flex-col
    items-center
    justify-center
    pt-10
    text-center
  "
>

  {/* Soft Ambient Glow */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-[100px]" />
  </div>

  {/* Small Label */}
  

  {/* Heading */}
  <motion.h1
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      delay: 0.1
    }}
    className="
      relative
      mt-7
      max-w-3xl
      text-4xl
      font-semibold
      leading-[1]
      tracking-[-0.05em]
      text-[#F8FAFC]
      sm:text-5xl
    "
  >
    Discover digital product ideas
    <span className="block mt-2 text-[#A5C4FF]">
      powered by AI intelligence.
    </span>
  </motion.h1>

  {/* Description */}
  <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.4,
    delay: 0.18
  }}
  className="
    relative
    mt-6
    max-w-xl
    text-[14px]
    leading-7
    text-[#94A3B8]
    sm:text-[15px]
  "
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
    transition={{
      duration: 0.4,
      delay: 0.26
    }}
    className="
      relative
      mt-8
      rounded-full
      border
      border-white/[0.06]
      bg-white/[0.03]
      px-5
      py-2.5
      text-sm
      text-[#CBD5E1]
      transition-all
      duration-300
      hover:border-[#3B82F6]/30
      hover:bg-[#3B82F6]/[0.05]
      hover:text-white
    "
  >
    Explore trending topics
  </motion.button>
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
                    font-display
                    font-semibold
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