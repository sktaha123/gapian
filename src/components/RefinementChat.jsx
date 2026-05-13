import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

function RefinementChat({ ideas, count, onRefined, isLoading }) {
  const [text, setText]   = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    setError('');
    try {
      await onRefined(text.trim());
      setText('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-8"
    >
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} className="text-blue-400" />
          <span className="text-[12px] font-medium text-slate-400">Refine these results with AI</span>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder='e.g. "Make these more B2B focused" or "Add more SaaS ideas"'
            disabled={isLoading}
            className="flex-1 bg-transparent text-[14px] text-slate-200 placeholder:text-slate-600 outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="inline-flex h-8 items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 text-[12px] font-medium text-blue-300 transition-all hover:border-blue-500/50 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading
              ? <Loader2 size={12} className="animate-spin" />
              : <ArrowRight size={12} />
            }
            <span>{isLoading ? 'Refining…' : 'Refine'}</span>
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex items-center gap-2 text-[12px] text-red-400"
            >
              <AlertCircle size={12} /><span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default RefinementChat;
