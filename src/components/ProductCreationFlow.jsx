import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

import StepPathSelector   from './flow/StepPathSelector.jsx';
import StepOverview       from './flow/StepOverview.jsx';
import StepBlueprint      from './flow/StepBlueprint.jsx';
import StepAIIntro        from './flow/ai/StepAIIntro.jsx';
import StepStyleSelector  from './flow/ai/StepStyleSelector.jsx';
import StepThemeSelector  from './flow/ai/StepThemeSelector.jsx';
import StepDepthSelector  from './flow/ai/StepDepthSelector.jsx';
import StepFinalPrompt    from './flow/ai/StepFinalPrompt.jsx';
import StepFonts          from './flow/manual/StepFonts.jsx';
import StepColors         from './flow/manual/StepColors.jsx';
import StepCover          from './flow/manual/StepCover.jsx';
import StepDesignPrinciples from './flow/manual/StepDesignPrinciples.jsx';
import StepContentCreation  from './flow/manual/StepContentCreation.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Step sequences
// ─────────────────────────────────────────────────────────────────────────────

const MANUAL_STEPS = [
  { id: 'overview',   title: 'Product Overview',    component: StepOverview },
  { id: 'blueprint',  title: 'Product Blueprint',   component: StepBlueprint },
  { id: 'fonts',      title: 'Font Guidance',        component: StepFonts },
  { id: 'colors',     title: 'Color Palette',        component: StepColors },
  { id: 'cover',      title: 'Cover Design',         component: StepCover },
  { id: 'design',     title: 'Design Principles',    component: StepDesignPrinciples },
  { id: 'content',    title: 'Content Creation',     component: StepContentCreation },
];

const AI_STEPS = [
  { id: 'intro',      title: 'AI Creation',          component: StepAIIntro },
  { id: 'blueprint',  title: 'Product Structure',    component: StepBlueprint },
  { id: 'style',      title: 'Choose Style',         component: StepStyleSelector },
  { id: 'theme',      title: 'Choose Theme',         component: StepThemeSelector },
  { id: 'depth',      title: 'Content Depth',        component: StepDepthSelector },
  { id: 'prompt',     title: 'Generate Product',     component: StepFinalPrompt },
];

// ─────────────────────────────────────────────────────────────────────────────
// Progress bar
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({ pct, path }) {
  const color = path === 'manual'
    ? 'from-emerald-500 to-teal-400'
    : 'from-violet-500 to-blue-400';
  return (
    <div className="h-[2px] w-full bg-white/[0.04]">
      <motion.div
        className={`h-full bg-gradient-to-r ${color}`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step dots
// ─────────────────────────────────────────────────────────────────────────────

function StepDots({ total, current, path }) {
  const activeColor = path === 'manual' ? 'bg-emerald-500' : 'bg-violet-500';
  const doneColor   = path === 'manual' ? 'bg-emerald-500/30' : 'bg-violet-500/30';
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current ? `h-1.5 w-5 ${activeColor}`
            : i < current ? `h-1 w-1 ${doneColor}`
            : 'h-1 w-1 bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main orchestrator
// ─────────────────────────────────────────────────────────────────────────────

function ProductCreationFlow({ idea, onClose }) {
  const [path,         setPath]         = useState(null);
  const [stepIndex,    setStepIndex]    = useState(-1);   // -1 = path selection
  const [direction,    setDirection]    = useState(1);
  const [canContinue,  setCanContinue]  = useState(true);
  const [data,         setData]         = useState({});   // accumulated step data

  const steps        = path === 'manual' ? MANUAL_STEPS : path === 'ai' ? AI_STEPS : [];
  const isPathScreen = stepIndex === -1;
  const currentStep  = steps[stepIndex] ?? null;
  const isLastStep   = stepIndex === steps.length - 1;
  const progressPct  = steps.length > 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;

  const updateData = (key, value) => setData(d => ({ ...d, [key]: value }));

  const goNext = () => {
    setDirection(1);
    setStepIndex(i => Math.min(i + 1, steps.length - 1));
    setCanContinue(true);
  };

  const goBack = () => {
    setDirection(-1);
    if (stepIndex <= 0) { setStepIndex(-1); setPath(null); }
    else setStepIndex(i => i - 1);
    setCanContinue(true);
  };

  const handlePathSelect = (selectedPath) => {
    setPath(selectedPath);
    setDirection(1);
    setStepIndex(0);
  };

  // Render the active step component
  const renderStep = () => {
    if (isPathScreen) {
      return <StepPathSelector idea={idea} onSelect={handlePathSelect} />;
    }
    if (!currentStep) return null;
    const StepComponent = currentStep.component;
    return (
      <StepComponent
        idea={idea}
        data={data}
        updateData={updateData}
        onNext={goNext}
        onCanContinue={setCanContinue}
        path={path}
      />
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col bg-[#05070B]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/8 blur-[140px]" />
      </div>

      {/* Progress bar */}
      {!isPathScreen && (
        <div className="relative z-20 shrink-0">
          <ProgressBar pct={progressPct} path={path} />
        </div>
      )}

      {/* Header */}
      <div className="relative z-20 shrink-0 border-b border-white/[0.06] bg-[#05070B]/90 backdrop-blur-xl">
        <div className="flex h-13 items-center justify-between px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            {!isPathScreen && (
              <button
                type="button"
                onClick={goBack}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-slate-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={13} />
              </button>
            )}
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] min-w-0">
              <span className="hidden text-slate-600 sm:inline">Gapian</span>
              {!isPathScreen && path && (
                <>
                  <span className="hidden text-slate-700 sm:inline">/</span>
                  <span className={`shrink-0 ${path === 'manual' ? 'text-emerald-500' : 'text-violet-500'}`}>
                    {path === 'manual' ? 'Manual' : 'AI'}
                  </span>
                  <span className="shrink-0 text-slate-700">/</span>
                  <span className="truncate text-slate-400 max-w-[100px] sm:max-w-none">{currentStep?.title}</span>
                </>
              )}
              {isPathScreen && <span className="text-slate-400">Choose Path</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isPathScreen && steps.length > 0 && (
              <span className="text-[11px] text-slate-600 tabular-nums">
                {stepIndex + 1} / {steps.length}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-slate-500 hover:text-white transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={isPathScreen ? 'path' : `${path}-${stepIndex}`}
            custom={direction}
            variants={{
              enter: d => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
              center: { opacity: 1, x: 0 },
              exit:  d => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation — hidden only on path screen */}
      {!isPathScreen && (
        <div className="relative z-20 shrink-0 border-t border-white/[0.06] bg-[#05070B]/90 backdrop-blur-xl px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 text-[12px] font-medium text-slate-500 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={13} /> Prev
            </button>

            <StepDots total={steps.length} current={stepIndex} path={path} />

            <button
              type="button"
              onClick={isLastStep ? onClose : goNext}
              disabled={!canContinue}
              className={`group flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold text-white transition-all duration-200 ${
                canContinue
                  ? path === 'manual'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/15'
                    : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-500/15'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ArrowRight size={13} className={`transition-transform duration-200 ${canContinue ? 'group-hover:translate-x-0.5' : ''}`} />}
              {isLastStep && <X size={13} className={`transition-transform duration-200 ${canContinue ? 'group-hover:scale-110' : ''}`} />}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ProductCreationFlow;
