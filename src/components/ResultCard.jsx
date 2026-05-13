import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Bookmark, BookmarkCheck, ThumbsUp, ThumbsDown, Expand, SquareStack } from 'lucide-react';
import useCopy from '../hooks/useCopy.js';
import { getRating, setRating } from '../services/storageService.js';

function ScoreBadge({ score }) {
  const color = score >= 8 ? '#10B981' : score >= 6 ? '#3B82F6' : '#F59E0B';
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {score}/10
    </span>
  );
}

function ResultCard({ idea, isSaved, onToggleSave, onExpand, isSelected, onToggleCompare }) {
  const { copiedId, copyToClipboard } = useCopy();
  const isCopied = copiedId === idea.id;
  const [rating, setRatingState] = useState(() => getRating(idea.id));

  const handleRate = (val) => {
    const next = rating === val ? null : val;
    setRating(idea.id, next);
    setRatingState(next);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group relative overflow-hidden rounded-[24px] border p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl ${
        isSelected
          ? 'border-blue-500/40 bg-gradient-to-b from-blue-500/[0.08] to-transparent shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
          : 'border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/10'
      }`}
    >
      {/* Top glow accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:via-blue-400/40 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-blue-500/10 blur-[40px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header row: score + compare toggle */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {idea.tags?.map(tag => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <ScoreBadge score={idea.score} />
            <button
              type="button"
              title={isSelected ? 'Remove from compare' : 'Add to compare'}
              onClick={() => onToggleCompare(idea)}
              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500/50 bg-blue-500/20 text-blue-400'
                  : 'border-white/10 bg-white/5 text-slate-500 hover:text-slate-300'
              }`}
            >
              <SquareStack size={11} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[19px] font-semibold leading-tight tracking-tight text-slate-100">
          {idea.title}
        </h3>

        {/* Headline */}
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-blue-100/90">
          {idea.headline}
        </p>

        {/* Description */}
        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-400">
          {idea.description}
        </p>

        {/* Pricing + Audience */}
        <div className="mt-4 space-y-1.5 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            {/* Dollar / Pricing icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-emerald-400/80">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>{idea.pricing}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            {/* Target / Audience icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-blue-400/80">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <span className="line-clamp-1">{idea.audience}</span>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          {/* Left: rating */}
          <div className="flex items-center gap-1">
            
          </div>

          {/* Right: save + expand + copy */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              title={isSaved ? 'Unsave' : 'Save idea'}
              onClick={() => onToggleSave(idea)}
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 ${
                isSaved
                  ? 'border-blue-500/40 bg-blue-500/20 text-blue-400'
                  : 'border-white/8 bg-white/4 text-slate-500 hover:text-blue-400'
              }`}
            >
              {isSaved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
            </button>

            <button
              type="button"
              title="Deep dive"
              onClick={() => onExpand(idea)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/8 bg-white/4 text-slate-500 transition-all duration-200 hover:text-white"
            >
              <Expand size={12} />
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(`${idea.title}\n${idea.headline}\n${idea.description}`, idea.id)}
              className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-all duration-300 ${
                isCopied
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isCopied ? <><Check size={11} /><span>Copied</span></> : <><Copy size={11} /><span>Copy</span></>}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ResultCard;