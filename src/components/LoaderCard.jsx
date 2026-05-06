function LoaderCard() {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.05]
        bg-white/[0.02]
        p-6
      "
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      </div>

      <div className="relative animate-pulse">
        
        {/* Label */}
        <div className="mb-4 h-3 w-20 rounded bg-white/[0.05]" />

        {/* Title */}
        <div className="mb-3 h-5 w-2/3 rounded bg-white/[0.08]" />

        {/* Headline */}
        <div className="mb-8 space-y-3">
          <div className="h-3 w-full rounded bg-white/[0.05]" />
          <div className="h-3 w-5/6 rounded bg-white/[0.05]" />
        </div>

        {/* Description */}
        <div className="space-y-3 border-t border-white/[0.04] pt-5">
          <div className="h-3 w-full rounded bg-white/[0.05]" />
          <div className="h-3 w-4/5 rounded bg-white/[0.05]" />
          <div className="h-3 w-2/3 rounded bg-white/[0.05]" />
        </div>

        {/* Button */}
        <div className="mt-8 h-10 w-28 rounded-lg bg-white/[0.05]" />
      </div>
    </div>
  );
}

export default LoaderCard;