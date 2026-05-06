import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-border bg-soft p-8 text-center"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Zap size={18} />
        </div>
        <h3 className="text-lg font-semibold text-text">No ideas generated yet</h3>
        <p className="max-w-xl text-sm leading-7 text-muted">
          Use the bottom AI search bar to explore trending topics and generate premium creator product ideas with refined headlines and descriptions.
        </p>
      </div>
    </motion.div>
  );
}

export default EmptyState;
