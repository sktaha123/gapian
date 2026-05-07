import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider.jsx';

function AccessDenied() {
  const auth = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070B] text-[#F8FAFC] px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-[120px]" />
        <div className="absolute right-8 bottom-8 h-60 w-60 rounded-full bg-[#7C3AED]/10 blur-[110px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex max-w-xl flex-col items-center gap-6 rounded-[32px] border border-white/[0.06] bg-[#0b111a]/90 px-8 py-12 shadow-[0_0_80px_rgba(59,130,246,0.14)] backdrop-blur-2xl"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.04] text-2xl font-semibold text-[#A5C4FF]">
          G
        </div>

        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.36em] text-[#7C93E4]">Premium access required</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#F8FAFC]">
            GAPIAN AI access requires an active membership.
          </h1>
          <p className="mx-auto max-w-md text-sm leading-7 text-[#94A3B8]">
            Your membership status is required to unlock the dashboard and AI generation features. If you already have access, refresh your status.
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={auth.login}
            className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3B82F6]"
          >
            Join Membership
          </button>

          <button
            type="button"
            onClick={auth.refresh}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm text-[#CBD5E1] transition hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/[0.05]"
          >
            Refresh status
          </button>
        </div>

        <p className="text-xs text-[#64748B]">
          <span className="font-medium">Note:</span> This page is a protected gate for Whop membership verification. Manual Whop setup is required in the backend.
        </p>
      </motion.div>
    </div>
  );
}

export default AccessDenied;
