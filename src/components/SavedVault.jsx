import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookmarkX, Download, Inbox, FileText } from 'lucide-react';
import { exportCSV, exportPDF } from '../utils/exportUtils.js';


function SavedVault({ open, onClose, getSaved, onUnsave }) {
  const ideas = open ? getSaved() : [];

  // Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[990] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[999] h-full w-full max-w-sm border-l border-white/[0.07] bg-[#07101C] shadow-2xl flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Saved</p>
                <h2 className="text-[17px] font-semibold text-slate-100">Your Vault</h2>
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-500 hover:bg-white/10 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {ideas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
                  <Inbox size={28} className="text-slate-600" />
                  <p className="text-[14px] text-slate-500">No saved ideas yet.<br />Hit the bookmark icon on any card.</p>
                </div>
              ) : (
                ideas.map(idea => (
                  <div key={idea.id} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-slate-200 leading-snug truncate">{idea.title}</p>
                        <p className="mt-1 text-[12px] text-slate-500 line-clamp-2">{idea.headline}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUnsave(idea.id)}
                        className="shrink-0 rounded-full p-1.5 text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <BookmarkX size={14} />
                      </button>
                    </div>
                    {idea.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {idea.tags.map(t => (
                          <span key={t} className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-500">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {ideas.length > 0 && (
              <div className="border-t border-white/[0.06] p-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => exportPDF(ideas, 'gapian-vault.pdf')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 py-2.5 text-[13px] font-medium text-blue-300 transition-all hover:bg-blue-500/20"
                >
                  <FileText size={14} />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => exportCSV(ideas, 'gapian-vault.csv')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[13px] font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  <Download size={14} />
                  Export as CSV
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default SavedVault;
