import { ArrowUpRight, Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // DEFINED HERE: Variables must be outside the JSX return block
  const snakeDashArray = "35 65"; 
  const animationProps = {
    initial: { strokeDashoffset: 100 },
    animate: { strokeDashoffset: 0 },
    transition: {
      duration: 10, 
      repeat: Infinity,
      ease: "linear"
    }
  };

  return (
    <>
      {/* SEARCH BAR CONTAINER */}
      <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-6 md:pb-2">
        <div className="mx-auto w-full max-w-3xl">
          
          {/* Main Container with BIG GLOWY Snake Effect */}
          <div className="relative rounded-[24px] p-[1px] overflow-hidden shadow-2xl">
            
            {/* 1. The Big Glowy Snake Layer (behind content) */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <svg className="h-full w-full overflow-visible">
                {/* A. The static base border (very subtle) */}
                <rect
                  width="100%"
                  height="100%"
                  rx="24"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                
                {/* B. The Glow Layer (thicker, blurred blue) */}
                <motion.rect
                  width="100%"
                  height="100%"
                  rx="24"
                  fill="none"
                  stroke="#3B82F6" // Blue-600
                  strokeWidth="4" // Thicker for glow base
                  strokeLinecap="round"
                  pathLength="100" 
                  strokeDasharray={snakeDashArray}
                  {...animationProps}
                  className="opacity-60 blur-[6px]"
                />

                {/* C. The Core Light Layer (thinner, bright blue) */}
                <motion.rect
                  width="100%"
                  height="100%"
                  rx="24"
                  fill="none"
                  stroke="#93C5FD" // Blue-300 (brighter core)
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  pathLength="100" 
                  strokeDasharray={snakeDashArray}
                  {...animationProps}
                />
              </svg>
            </div>

            {/* 2. Content Container (Masks the inner area) */}
            <div 
              className="
                relative 
                z-10 
                flex 
                flex-col 
                rounded-[23px] 
                bg-[#0B1220]/90 
                p-2 
                backdrop-blur-xl
              "
            >
              {/* TOP ROW: INPUT */}
              <div className="flex items-center gap-3 px-3 py-2">
                <Search size={18} className="text-slate-400 group-focus-within:text-blue-300" />
                
                <div className="flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="I am looking for..."
                    className="
                      w-full
                      bg-transparent
                      text-[15px]
                      font-medium
                      text-slate-100
                      placeholder:text-slate-500
                      outline-none
                    "
                  />
                </div>

                {/* GENERATE BUTTON */}
                <button
                  type="button"
                  onClick={onSearch}
                  disabled={!query.trim() || isLoading}
                  className="
                    inline-flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    text-white
                    transition-all
                    duration-300
                    hover:bg-blue-500
                    disabled:opacity-40
                    disabled:hover:bg-blue-600
                  "
                >
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* SEPARATOR */}
              <div className="mx-2 h-px bg-white/5" />

              {/* BOTTOM ROW: CONTROLS */}
              <div className="flex items-center justify-between px-2 pt-2 pb-1">
                
                {/* LEFT: TRENDS */}
                <div 
                  className="
                    flex 
                    items-center 
                    gap-2 
                    overflow-x-auto 
                    [&::-webkit-scrollbar]:hidden 
                    [-ms-overflow-style:none] 
                    [scrollbar-width:none]
                  "
                >
                  <button
                    type="button"
                    onClick={() => setShowTrends(!showTrends)}
                    className="
                      inline-flex
                      h-7
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/5
                      bg-white/5
                      px-3
                      text-xs
                      font-medium
                      text-slate-300
                      transition-all
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <Sparkles size={12} className="text-blue-400" />
                    <span>Trends</span>
                  </button>

                  {/* DESKTOP TREND PILLS */}
                  <div className="hidden md:block">
                    <AnimatePresence>
                      {showTrends && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, x: -10 }}
                          animate={{ opacity: 1, width: 'auto', x: 0 }}
                          exit={{ opacity: 0, width: 0, x: -10 }}
                          className="flex items-center gap-1.5 overflow-hidden"
                        >
                          {trendingTopics.map((topic) => (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => onSelectTrend(topic)}
                              className="
                                whitespace-nowrap
                                rounded-full
                                border
                                border-transparent
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                text-slate-400
                                transition-all
                                hover:bg-white/5
                                hover:text-slate-200
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

                {/* RIGHT: OUTPUT QUANTITY */}
                <div className="shrink-0 pl-2">
                  <select
                    value={quantity}
                    onChange={(event) => onQuantityChange(Number(event.target.value))}
                    className="
                      h-7
                      cursor-pointer
                      rounded-full
                      border
                      border-white/5
                      bg-transparent
                      px-2
                      text-xs
                      font-medium
                      text-slate-400
                      outline-none
                      transition-colors
                      hover:bg-white/5
                      hover:text-slate-200
                    "
                  >
                    {[3, 5, 10, 20].map((option) => (
                      <option key={option} value={option} className="bg-[#0B1220] text-slate-200">
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

      {/* MOBILE TRENDS MODAL */}
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
              items-end
              justify-center
              bg-black/40
              p-4
              pb-28
              backdrop-blur-sm
              md:hidden
            "
            onClick={() => setShowTrends(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="
                w-full
                max-w-[340px]
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#0B1220]/95
                p-2
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <div className="px-2 py-3 text-center text-xs font-medium text-slate-400">
                Trending Topics
              </div>
              <div className="flex flex-col gap-1">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      onSelectTrend(topic);
                      setShowTrends(false);
                    }}
                    className="
                      rounded-xl
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-slate-200
                      transition-colors
                      hover:bg-white/10
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