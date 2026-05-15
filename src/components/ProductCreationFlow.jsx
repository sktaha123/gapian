import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

import StepCustomization from './flow/unified/StepCustomization.jsx';
import StepBlueprint from './flow/StepBlueprint.jsx';
import StepFinalPrompt from './flow/ai/StepFinalPrompt.jsx';
import StepMarketingAssets from './flow/unified/StepMarketingAssets.jsx';

const UNIFIED_STEPS = [
  { id: 'customization', title: 'Design System Config',    component: StepCustomization },
  { id: 'blueprint',     title: 'Product Blueprint',       component: StepBlueprint },
  { id: 'prompt',        title: 'Specification Output',    component: StepFinalPrompt },
  { id: 'marketing',     title: 'Marketing Asset Engine',  component: StepMarketingAssets }
];

function ProgressBar({ pct }) {
  return (
    <div className="h-[2px] w-full bg-[#202635]">
      <motion.div
        className="h-full bg-gradient-to-r from-[#1B4DCC] to-[#2D7DFF]"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

function StepDots({ total, current }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current ? 'h-1.5 w-5 bg-[#2D7DFF]'
            : i < current ? 'h-1 w-1 bg-[#2D7DFF]/30'
            : 'h-1 w-1 bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}

function ProductCreationFlow({ idea, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [canContinue, setCanContinue] = useState(true);
  const [data, setData] = useState({});

  const steps = UNIFIED_STEPS;
  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;
  const progressPct = ((stepIndex + 1) / steps.length) * 100;

  const updateData = (key, value) => setData(d => ({ ...d, [key]: value }));

  const goNext = () => {
    setDirection(1);
    setStepIndex(i => Math.min(i + 1, steps.length - 1));
    setCanContinue(true);
  };

  const goBack = () => {
    if (isFirstStep) return;
    setDirection(-1);
    setStepIndex(i => i - 1);
    setCanContinue(true);
  };

  const StepComponent = currentStep.component;

  return (
    <motion.div
      className="flex min-h-[100dvh] flex-col bg-[#050505] text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Premium Cinematic Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(45,125,255,0.08),transparent_70%)] opacity-80" />
      </div>

      <div className="relative z-20 shrink-0">
        <ProgressBar pct={progressPct} />
      </div>

      {/* Header */}
      <div className="relative z-20 shrink-0 border-b border-[#202635] bg-[#050505]/90 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-4">
            {!isFirstStep && (
              <button
                type="button"
                onClick={goBack}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#202635] bg-[#0B0B0F] text-[#A0A7B4] hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />
              </button>
            )}
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em]">
              <span className="hidden text-[#6E7685] sm:inline">Gapian AI</span>
              <span className="hidden text-[#3A4352] sm:inline">/</span>
              <span className="text-[#2D7DFF]">Spec Engine</span>
              <span className="text-[#3A4352]">/</span>
              <span className="truncate text-[#D9DEE7]">{currentStep.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-[#6E7685] tabular-nums">
              {stepIndex + 1} / {steps.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#202635] bg-[#0B0B0F] text-[#A0A7B4] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="relative z-10 flex-1 overflow-y-auto scroll-smooth">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={{
              enter: d => ({ opacity: 0, y: 20 }),
              center: { opacity: 1, y: 0 },
              exit: d => ({ opacity: 0, y: -20 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-full"
          >
            <StepComponent
              idea={idea}
              data={data}
              updateData={updateData}
              onNext={goNext}
              onCanContinue={setCanContinue}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-20 shrink-0 border-t border-[#202635] bg-[#050505]/95 backdrop-blur-xl px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className={`flex items-center gap-2 text-[13px] font-semibold transition-colors ${
              isFirstStep ? 'text-transparent pointer-events-none' : 'text-[#6E7685] hover:text-white'
            }`}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <StepDots total={steps.length} current={stepIndex} />

          <button
            type="button"
            onClick={isLastStep ? onClose : goNext}
            disabled={!canContinue}
            className={`group flex items-center gap-2 rounded-xl px-6 py-2.5 text-[13px] font-bold text-white transition-all duration-300 ${
              canContinue
                ? 'bg-[#2D7DFF] hover:bg-[#4B8DFF] shadow-[0_0_20px_rgba(45,125,255,0.2)]'
                : 'bg-[#202635] text-[#6E7685] cursor-not-allowed'
            }`}
          >
            {isLastStep ? 'Close Workspace' : 'Continue'}
            {!isLastStep && <ArrowRight size={14} className={`transition-transform duration-300 ${canContinue ? 'group-hover:translate-x-1' : ''}`} />}
            {isLastStep && <X size={14} className={`transition-transform duration-300 ${canContinue ? 'group-hover:scale-110' : ''}`} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCreationFlow;
