import { ArrowUpRight, Sparkles, Search, Globe, User, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TRENDING_TOPICS = [
  'Fitness', 'AI Tools', 'Productivity', 'Finance', 'Education',
  'Mental Health', 'E-commerce', 'Parenting', 'Travel', 'Gaming',
];



const CREATOR_TYPES = [
  'YouTuber', 'Course Creator', 'Indie Hacker', 'Coach / Consultant',
  'Newsletter Writer', 'Podcaster', 'Freelancer', 'Agency Owner',
];

function SearchBar({
  query, onQueryChange,
  quantity, onQuantityChange,
  onSearch, isLoading,
  showTrends, setShowTrends, onSelectTrend,
  creatorType, onCreatorTypeChange,
  history, onSelectHistory, onRemoveHistory,
  showHistory, setShowHistory,
}) {
  const snakeDashArray = '35 65';
  const animProps = {
    initial: { strokeDashoffset: 100 },
    animate: { strokeDashoffset: 0 },
    transition: { duration: 10, repeat: Infinity, ease: 'linear' },
  };

  return (
    <>
      {/* SEARCH BAR */}
      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none">
        <div className="mx-auto w-full max-w-3xl pointer-events-auto flex flex-col gap-2">
          
          {/* TRENDS TAGS (Expandable Row) */}
          <AnimatePresence>
            {showTrends && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full overflow-hidden"
              >
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 pt-1 px-1">
                  <style>{`
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                  `}</style>
                  {TRENDING_TOPICS.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => { onSelectTrend(topic); setShowTrends(false); }}
                      className="shrink-0 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-[11px] font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white shadow-sm sm:text-xs"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative rounded-[22px] p-[1px] overflow-hidden shadow-2xl sm:rounded-[24px]">

            {/* Animated border */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <svg className="h-full w-full overflow-visible">
                <rect width="100%" height="100%" rx="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <motion.rect width="100%" height="100%" rx="24" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" pathLength="100" strokeDasharray={snakeDashArray} {...animProps} className="opacity-60 blur-[6px]" />
                <motion.rect width="100%" height="100%" rx="24" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" pathLength="100" strokeDasharray={snakeDashArray} {...animProps} />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col rounded-[21px] bg-[#0B1220]/90 p-2 backdrop-blur-xl sm:rounded-[23px]">

              {/* Input row */}
              <div className="flex items-center gap-2 px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
                <Search size={16} className="text-slate-400 shrink-0 sm:w-[18px] sm:h-[18px]" />
                <input
                  type="text"
                  value={query}
                  onChange={e => onQueryChange(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && onSearch()}
                  placeholder="I am looking for..."
                  className="flex-1 bg-transparent text-[14px] font-medium text-slate-100 placeholder:text-slate-500 outline-none min-w-0 sm:text-[15px]"
                />
                <button
                  type="button"
                  onClick={onSearch}
                  disabled={!query.trim() || isLoading}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 sm:h-9 sm:w-9"
                >
                  <ArrowUpRight size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>

              <div className="mx-2 h-px bg-white/5" />

              {/* Controls row — responsive two-section layout */}
              <div className="flex items-center justify-between gap-1.5 px-2 pt-1.5 pb-1 sm:gap-2">

                {/* Left: Trends + History */}
                <div className="flex items-center gap-1 shrink-0 sm:gap-1.5">
                  

                  <button type="button"
                    onClick={() => { setShowTrends(t => !t); setShowHistory(false); }}
                    className={`inline-flex h-6 items-center gap-1 rounded-full border border-white/5 px-2 text-[11px] font-medium transition-all sm:h-7 sm:gap-1.5 sm:px-3 sm:text-xs ${
                      showTrends ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}>
                    <Sparkles size={10} className={showTrends ? 'text-blue-400' : 'text-slate-400 sm:w-[11px] sm:h-[11px]'} /><span>Trends</span>
                  </button>
                </div>

                {/* Right: selects */}
                <div className="flex items-center gap-1 shrink-0 sm:gap-1.5">
                  

                  {/* Creator type — hidden on very small screens */}
                  <div className="relative hidden sm:block">
                    <select 
                      value={creatorType} 
                      onChange={e => onCreatorTypeChange(e.target.value)}
                      className="h-7 w-[120px] cursor-pointer rounded-full border border-white/5 bg-[#0B1220] px-3 text-[11px] font-medium text-slate-400 outline-none transition-all hover:bg-white/10 hover:text-slate-200 appearance-none pr-6"
                    >
                      <option value="" className="bg-[#0B1220] text-slate-300">Any Creator</option>
                      {CREATOR_TYPES.map(c => <option key={c} value={c} className="bg-[#0B1220] text-slate-300">{c}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 border-[3.5px] border-transparent border-t-slate-500 mt-[1px]" />
                  </div>

                  <div className="relative">
                    <select 
                      value={quantity} 
                      onChange={e => onQuantityChange(Number(e.target.value))}
                      className="h-7 w-[65px] cursor-pointer rounded-full border border-white/5 bg-[#0B1220] px-3 text-[11px] font-medium text-slate-400 outline-none transition-all hover:bg-white/10 hover:text-slate-200 appearance-none pr-6"
                    >
                      {[3, 5, 10, 20].map(n => <option key={n} value={n} className="bg-[#0B1220] text-slate-300">{n}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 border-[3.5px] border-transparent border-t-slate-500 mt-[1px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE TRENDS MODAL REMOVED - RESTORED ABOVE STYLE */}

      {/* HISTORY PANEL */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-end justify-center bg-black/40 p-4 pb-24 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]/95 p-2 shadow-2xl backdrop-blur-xl"
            >
              <div className="px-2 py-3 text-center text-xs font-medium text-slate-400">Search History</div>
              {history.length === 0
                ? <p className="px-4 py-4 text-center text-[13px] text-slate-600">No history yet.</p>
                : (
                  <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                    {history.map(h => (
                      <div key={h.query} className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors group">
                        <button type="button"
                          onClick={() => { onSelectHistory(h.query); setShowHistory(false); }}
                          className="flex-1 text-left text-[13px] text-slate-300 truncate">
                          {h.query}
                        </button>
                        <button type="button" onClick={() => onRemoveHistory(h.query)}
                          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              }
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SearchBar;