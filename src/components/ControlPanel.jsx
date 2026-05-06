import { ArrowRight } from 'lucide-react';

function ControlPanel({ category, quantity, onCategoryChange, onQuantityChange, onGenerate, status, options }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">Configuration</p>
        <h2 className="text-2xl font-light tracking-tight text-text">Concept Generator</h2>
      </div>

      <form className="space-y-5" onSubmit={onGenerate}>
        <div className="space-y-2.5">
          <label className="block text-xs font-medium uppercase tracking-widest text-muted" htmlFor="category">
            Niche or Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            placeholder="e.g. premium AI productivity bundles"
            className="w-full rounded-lg border border-border bg-secondary px-3.5 py-3 text-sm text-text placeholder:text-muted transition-elegant focus:border-accent focus:ring-1 focus:ring-accent/20"
          />
        </div>

        <div className="space-y-2.5">
          <label className="block text-xs font-medium uppercase tracking-widest text-muted" htmlFor="quantity">
            Number of Suggestions
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={(event) => onQuantityChange(Number(event.target.value))}
            className="w-full rounded-lg border border-border bg-secondary px-3.5 py-3 text-sm text-text transition-elegant focus:border-accent focus:ring-1 focus:ring-accent/20"
          >
            {options.map((option) => (
              <option key={option} value={option} className="bg-primary text-text">
                {option} suggestions
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold uppercase tracking-widest text-primary transition-elegant hover:bg-accentGlow disabled:cursor-not-allowed disabled:opacity-50"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Generating...' : 'Generate'}
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}

export default ControlPanel;
