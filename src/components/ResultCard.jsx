import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

import useCopy from '../hooks/useCopy.js';

function ResultCard({ idea }) {
  const { copiedId, copyToClipboard } = useCopy();

  const isCopied = copiedId === idea.id;

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.25
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.05]
        bg-white/[0.02]
        p-5
        transition-all
        duration-300
        hover:border-[#3B82F6]/20
        hover:bg-white/[0.03]
      "
    >
      
      {/* Subtle Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#3B82F6]/[0.08] blur-3xl" />
      </div>

      <div className="relative">
        
        {/* Title */}
        <h3
          className="
            text-[22px]
            font-medium
            leading-[1.15]
            tracking-[-0.04em]
            text-[#F8FAFC]
          "
        >
          {idea.title}
        </h3>

        {/* Headline */}
        <p
          className="
            mt-4
            text-[15px]
            leading-7
            text-[#D6E2F5]
          "
        >
          {idea.headline}
        </p>

        {/* Description */}
        <p
          className="
            mt-5
            text-[14px]
            leading-7
            text-[#94A3B8]
          "
        >
          {idea.description}
        </p>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                `${idea.title}\n${idea.headline}\n${idea.description}`,
                idea.id
              )
            }
            className="
              inline-flex
              items-center
              gap-2
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
            {isCopied ? (
              <>
                <Check size={13} />
                Copied
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ResultCard;