import {
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

import {
  motion,
  AnimatePresence
} from 'framer-motion';

const trendingTopics = [
  'Fitness',
  'AI',
  'Productivity',
  'Finance',
  'Education'
];

function SearchBar({
  query,
  onQueryChange,
  quantity,
  onQuantityChange,
  onSearch,
  isLoading,
  showTrends,
  setShowTrends,
  onSelectTrend
}) {
  return (
    <>
      {/* SEARCH BAR */}
      <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-1">
        <div className="mx-auto w-full max-w-3xl">

          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              bg-[#0B1220]/88
              backdrop-blur-3xl
            "
          >

            {/* Ambient Glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_45%)]" />
            </div>

            {/* CONTENT */}
            <div className="relative px-5 py-4">

              {/* INPUT ROW */}
              <div className="flex items-center gap-3">

                {/* INPUT */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(event) =>
                      onQueryChange(event.target.value)
                    }
                    placeholder="I am looking for..."
                    className="
                      w-full
                      bg-transparent
                      text-[15px]
                      text-[#F8FAFC]
                      placeholder:text-[#64748B]
                      outline-none
                    "
                  />
                </div>

                {/* GENERATE */}
                <button
                  type="button"
                  onClick={onSearch}
                  disabled={!query.trim() || isLoading}
                  className="
                    inline-flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#3B82F6]
                    text-white
                    transition-all
                    duration-300
                    hover:bg-[#2563EB]
                    disabled:opacity-50
                  "
                >
                  <ArrowUpRight size={15} />
                </button>
              </div>

              {/* CONTROLS */}
              <div className="mt-4 flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-2 overflow-hidden">

                  {/* TRENDS BUTTON */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowTrends(!showTrends)
                    }
                    className="
                      inline-flex
                      h-8
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/[0.06]
                      bg-white/[0.03]
                      px-3
                      text-xs
                      text-[#CBD5E1]
                      transition-all
                      duration-300
                      hover:border-[#3B82F6]/30
                      hover:bg-[#3B82F6]/[0.05]
                      hover:text-white
                      shrink-0
                    "
                  >
                    <Sparkles
                      size={13}
                      className="text-[#7DA2FF]"
                    />

                    <span>Trends</span>
                  </button>

                  {/* DESKTOP TREND OPTIONS */}
                  <div className="hidden md:block">
                    <AnimatePresence>
                      {showTrends && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            x: -20
                          }}
                          animate={{
                            opacity: 1,
                            x: 0
                          }}
                          exit={{
                            opacity: 0,
                            x: -20
                          }}
                          transition={{
                            duration: 0.25
                          }}
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          {trendingTopics.map((topic) => (
                            <button
                              key={topic}
                              type="button"
                              onClick={() =>
                                onSelectTrend(topic)
                              }
                              className="
                                whitespace-nowrap
                                rounded-full
                                border
                                border-white/[0.06]
                                bg-white/[0.03]
                                px-3
                                py-1.5
                                text-xs
                                text-[#CBD5E1]
                                transition-all
                                duration-300
                                hover:border-[#3B82F6]/30
                                hover:bg-[#3B82F6]/[0.05]
                                hover:text-white
                              "
                            >
                              {topic}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* OUTPUT SELECTOR */}
                <div
                  className="
                    flex
                    h-8
                    items-center
                    rounded-full
                    border
                    border-white/[0.06]
                    bg-white/[0.03]
                    px-3
                    shrink-0
                  "
                >
                  <select
                    value={quantity}
                    onChange={(event) =>
                      onQuantityChange(
                        Number(event.target.value)
                      )
                    }
                    className="
                      bg-transparent
                      text-xs
                      text-[#CBD5E1]
                      outline-none
                    "
                  >
                    {[3, 5, 10, 20].map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-[#0B1220]"
                      >
                        {option} outputs
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE GLOBAL MODAL */}
      <AnimatePresence>
        {showTrends && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[999]
              flex
              items-center
              justify-center
              bg-black/60
              backdrop-blur-md
              md:hidden
            "
            onClick={() => setShowTrends(false)}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20
              }}
              transition={{
                duration: 0.22
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                relative
                w-[88%]
                max-w-[340px]
                overflow-hidden
                rounded-[30px]
                border
                border-white/[0.06]
                bg-[#0B1220]/96
                p-4
                shadow-2xl
                backdrop-blur-3xl
              "
            >

              {/* Glow */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_50%)]" />
              </div>

              {/* Header */}
              <div className="relative mb-4">
                <h3
                  className="
                    text-center
                    text-[15px]
                    font-medium
                    tracking-[-0.03em]
                    text-[#F8FAFC]
                  "
                >
                  Trending Topics
                </h3>
              </div>

              {/* Topics */}
              <div className="relative flex flex-col gap-2">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      onSelectTrend(topic);
                      setShowTrends(false);
                    }}
                    className="
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-white/[0.03]
                      px-4
                      py-3
                      text-left
                      text-sm
                      text-[#CBD5E1]
                      transition-all
                      duration-300
                      hover:border-[#3B82F6]/30
                      hover:bg-[#3B82F6]/[0.05]
                      hover:text-white
                    "
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SearchBar;