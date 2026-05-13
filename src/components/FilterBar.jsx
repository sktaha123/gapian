import { motion, AnimatePresence } from 'framer-motion';

function FilterBar({ tags, activeTag, onSelect }) {
  if (!tags || tags.length === 0) return null;
  const all = ['All', ...tags];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-center gap-2 mb-6"
    >
      {all.map(tag => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(tag === 'All' ? null : tag)}
          className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
            (tag === 'All' && activeTag === null) || tag === activeTag
              ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
              : 'border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/15 hover:text-slate-200'
          }`}
        >
          {tag}
        </button>
      ))}
    </motion.div>
  );
}

export default FilterBar;
