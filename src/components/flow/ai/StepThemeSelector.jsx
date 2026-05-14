import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { THEMES } from './constants.js';

function ThemeButton({ theme, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(theme)}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
        active
          ? `${theme.border} ${theme.bg}`
          : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
      }`}
    >
      <span
        className={`h-3 w-3 shrink-0 rounded-full border border-white/20 ${active ? `ring-2 ring-offset-1 ring-offset-[#05070B] ${theme.ring}` : ''}`}
        style={{ background: theme.dot }}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-[12px] font-semibold leading-none ${active ? theme.label : 'text-slate-300'}`}>
          {theme.name}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-slate-600">{theme.description}</p>
      </div>
      {active && <Check size={11} className={`shrink-0 ${theme.label}`} />}
    </button>
  );
}

function StepThemeSelector({ data, updateData, onCanContinue }) {
  const [selectedTheme, setSelectedTheme] = useState(data.theme || THEMES[0]);

  useEffect(() => {
    updateData('theme', selectedTheme);
    onCanContinue(true);
  }, [selectedTheme]);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Step 4 — Color Theme</p>
      <div className="mb-10 border-b border-white/[0.06] pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Choose a Color Theme
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
          This dictates the visual identity, cover palette, and overall aesthetic mood of your product.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {THEMES.map(t => (
          <ThemeButton key={t.id} theme={t} active={selectedTheme.id === t.id} onSelect={setSelectedTheme} />
        ))}
      </div>
    </div>
  );
}

export default StepThemeSelector;
