import { motion, AnimatePresence } from 'framer-motion';

function FilterBar({ tags, activeTag, onSelect }) {
  if (!tags || tags.length === 0) return null;
  const all = ['All', ...tags];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5 -mx-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="flex items-center gap-1.5 px-1 pb-1 min-w-max sm:flex-wrap sm:min-w-0">
        {all.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(tag === 'All' ? null : tag)}
            className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-all duration-200 whitespace-nowrap ${
              (tag === 'All' && activeTag === null) || tag === activeTag
                ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
                : 'border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/15 hover:text-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default FilterBar;
