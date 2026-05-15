import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Bookmark, BookmarkCheck, Expand, SquareStack, Rocket, Target, CircleDollarSign } from 'lucide-react';
import useCopy from '../hooks/useCopy.js';
import { getRating, setRating } from '../services/storageService.js';

function ScoreBadge({ score }) {
  const color = score >= 8 ? '#10B981' : score >= 6 ? '#2D7DFF' : '#F59E0B'; // using strict blue for mid, emerald/amber are fine for contextual scores
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold tracking-wide"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {score}/10
    </span>
  );
}

function ResultCard({ idea, isSaved, onToggleSave, onExpand, isSelected, onToggleCompare, onCreateProduct }) {
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-xl ${
        isSelected
          ? 'border-[#2D7DFF]/40 bg-[#2D7DFF]/[0.05] shadow-[0_0_0_1px_rgba(45,125,255,0.2)]'
          : 'border-[#202635] bg-[#050505] hover:border-[#3A4352] hover:bg-[#0B0B0F]'
      }`}
    >
      {/* Top glow accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2D7DFF]/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:via-[#2D7DFF]/40 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-[#2D7DFF]/10 blur-[40px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header row: tags + score/compare */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {idea.tags?.map(tag => (
              <span key={tag} className="rounded-md border border-[#3A4352] bg-[#111318] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A0A7B4]">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ScoreBadge score={idea.score} />
            <button
              type="button"
              title={isSelected ? 'Remove from compare' : 'Add to compare'}
              onClick={() => onToggleCompare(idea)}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'border-[#2D7DFF]/50 bg-[#2D7DFF]/20 text-[#4B8DFF]'
                  : 'border-[#202635] bg-[#111318] text-[#6E7685] hover:border-[#3A4352] hover:text-[#D9DEE7]'
              }`}
            >
              <SquareStack size={12} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-bold leading-snug tracking-tight text-[#F5F7FA]">
          {idea.title}
        </h3>

        {/* Headline */}
        <p className="mt-2 text-[14px] font-semibold leading-relaxed text-[#7AB6FF]">
          {idea.headline}
        </p>

        {/* Description */}
        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[#A0A7B4]">
          {idea.description}
        </p>

        {/* Pricing + Audience */}
        <div className="mt-6 flex flex-col gap-2.5 border-t border-[#202635] pt-4">
          <div className="flex items-center gap-2.5 text-[12px] font-medium text-[#6E7685]">
            <CircleDollarSign size={14} className="shrink-0 text-[#4B8DFF]" />
            <span className="text-[#D9DEE7]">{idea.pricing}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[12px] font-medium text-[#6E7685]">
            <Target size={14} className="shrink-0 text-[#2D7DFF]" />
            <span className="line-clamp-1 text-[#D9DEE7]">{idea.audience}</span>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-5 flex items-center justify-between border-t border-[#202635] pt-5">
          {/* Left: save + expand + copy */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              title={isSaved ? 'Unsave' : 'Save idea'}
              onClick={() => onToggleSave(idea)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${
                isSaved
                  ? 'border-[#2D7DFF]/40 bg-[#2D7DFF]/10 text-[#4B8DFF]'
                  : 'border-[#202635] bg-[#111318] text-[#6E7685] hover:border-[#3A4352] hover:text-[#4B8DFF]'
              }`}
            >
              {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </button>

            <button
              type="button"
              title="Deep dive"
              onClick={() => onExpand(idea)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#202635] bg-[#111318] text-[#6E7685] transition-all duration-200 hover:border-[#3A4352] hover:text-white"
            >
              <Expand size={14} />
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(`${idea.title}\n${idea.headline}\n${idea.description}`, idea.id)}
              className={`inline-flex h-8 items-center gap-2 rounded-lg border px-3.5 text-[12px] font-bold transition-all duration-300 ${
                isCopied
                  ? 'border-[#2D7DFF]/30 bg-[#2D7DFF]/10 text-[#4B8DFF]'
                  : 'border-[#202635] bg-[#111318] text-[#6E7685] hover:border-[#3A4352] hover:text-white'
              }`}
            >
              {isCopied ? <><Check size={13} /><span>Copied</span></> : <><Copy size={13} /><span>Copy</span></>}
            </button>
          </div>

          {/* Right: Create Product CTA */}
          {onCreateProduct && (
            <button
              type="button"
              onClick={() => onCreateProduct(idea)}
              className="group inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[#2D7DFF] px-4 text-[12px] font-bold tracking-wide text-white shadow-[0_0_15px_rgba(45,125,255,0.2)] transition-all duration-300 hover:bg-[#4B8DFF] hover:scale-105"
            >
              Build
              <Rocket size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default ResultCard;