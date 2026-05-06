import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

function GuideModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            px-4
            backdrop-blur-sm
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="
              relative
              w-full
              max-w-2xl
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#0B1220]
              p-8
            "
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7DA2FF]">
                  Guide
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-medium
                    tracking-[-0.04em]
                    text-[#F8FAFC]
                  "
                >
                  How GAPIAN works
                </h2>
              </div>

              <button
                onClick={onClose}
                className="
                  text-[#64748B]
                  transition-colors
                  duration-300
                  hover:text-white
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="relative mt-8 space-y-5 text-[15px] leading-8 text-[#94A3B8]">
              
              <p>
                Use the AI search bar to discover premium digital product
                opportunities based on your niche or creator category.
              </p>

              <p>
                Select the number of outputs, explore trending categories,
                and generate strategic creator-focused product concepts instantly.
              </p>

              <p>
                Every generated result includes a premium product title,
                positioning headline, and launch-ready description.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default GuideModal;