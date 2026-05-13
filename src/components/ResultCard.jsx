import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import useCopy from '../hooks/useCopy.js';

function ResultCard({ idea }) {
  const { copiedId, copyToClipboard } = useCopy();
  const isCopied = copiedId === idea.id;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border border-white/5
        bg-gradient-to-b from-white/[0.04] to-transparent
        p-6
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-white/10
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
        backdrop-blur-xl
      "
    >
      {/* Premium Top Border Accent (Visible on hover) */}
      <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:via-blue-400/40 group-hover:opacity-100" />

      {/* Ambient Hover Glow */}
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-blue-500/10 blur-[40px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        
        {/* Title */}
        <h3
          className="
            text-[20px]
            font-semibold
            leading-tight
            tracking-tight
            text-slate-100
          "
        >
          {idea.title}
        </h3>

        {/* Headline */}
        <p
          className="
            mt-3
            text-[15px]
            font-medium
            leading-relaxed
            text-blue-100/90
          "
        >
          {idea.headline}
        </p>

        {/* Description */}
        <p
          className="
            mt-4
            flex-1
            text-[14px]
            leading-relaxed
            text-slate-400
          "
        >
          {idea.description}
        </p>

        {/* Bottom Action Area */}
        <div className="mt-8 flex items-center justify-end border-t border-white/5 pt-4">
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                `${idea.title}\n${idea.headline}\n${idea.description}`,
                idea.id
              )
            }
            className={`
              inline-flex
              h-8
              items-center
              gap-2
              rounded-full
              border
              px-4
              text-[13px]
              font-medium
              transition-all
              duration-300
              ${
                isCopied
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            {isCopied ? (
              <>
                <Check size={14} strokeWidth={2.5} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-slate-400 transition-colors group-hover:text-slate-300" />
                <span>Copy to clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ResultCard;