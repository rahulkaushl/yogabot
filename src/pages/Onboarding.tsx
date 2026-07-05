import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepWelcome from '@/components/onboarding/StepWelcome';
import StepQuiz from '@/components/onboarding/StepQuiz';
import StepGoals from '@/components/onboarding/StepGoals';
import StepIntro from '@/components/onboarding/StepIntro';
import StepYoga from '@/components/onboarding/StepYoga';
import StepPlan from '@/components/onboarding/StepPlan';
import StepAccount from '@/components/onboarding/StepAccount';
import { ProgressBar, ProgressDots, BackButton } from '@/components/onboarding/shared';

const TOTAL_STEPS = 7;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-deepSpace flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-4">
        <ProgressBar current={step} total={TOTAL_STEPS} />
      </div>

      {/* Back button (except step 0) */}
      {step > 0 && (
        <div className="px-6">
          <BackButton onClick={goBack} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 overflow-y-auto"
          >
            {step === 0 && <StepWelcome onNext={goNext} />}
            {step === 1 && <StepQuiz onNext={goNext} onBack={goBack} />}
            {step === 2 && <StepGoals onNext={goNext} onBack={goBack} />}
            {step === 3 && <StepIntro onNext={goNext} onBack={goBack} />}
            {step === 4 && <StepYoga onNext={goNext} onBack={goBack} />}
            {step === 5 && <StepPlan onNext={goNext} />}
            {step === 6 && <StepAccount onBack={goBack} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="pb-4">
        <ProgressDots total={TOTAL_STEPS} current={step} />
      </div>
    </div>
  );
}
