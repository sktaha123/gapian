function Footer() {
  return (
    <footer className="border-t border-border px-4 py-6 sm:px-0">
      <div className="flex flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl leading-6">
          GAPIAN — Premium AI creator intelligence for generating refined digital product concepts.
        </p>
        <div className="flex flex-wrap items-center gap-4 font-medium uppercase tracking-widest">
          <span className="hover:text-text transition-elegant cursor-pointer">Terms</span>
          <span className="hover:text-text transition-elegant cursor-pointer">Privacy</span>
          <span className="hover:text-text transition-elegant cursor-pointer">Docs</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
