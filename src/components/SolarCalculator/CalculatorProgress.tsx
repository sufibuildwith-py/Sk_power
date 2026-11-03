import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface CalculatorProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export const CalculatorProgress: React.FC<CalculatorProgressProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  const { t } = useTranslation();

  const stepTitles = [
    t('calculator.steps.mode', 'Usage'),
    t('calculator.steps.location', 'Location'),
    t('calculator.steps.tariff', 'Tariff'),
    t('calculator.steps.roof', 'Rooftop'),
    t('calculator.steps.system', 'System'),
  ];

  return (
    <div className="w-full mb-6 sm:mb-8" aria-label="Calculator Progress">
      {/* Step Numbers & Labels */}
      <div className="flex items-center justify-between relative">
        {/* Continuous Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-solar-charcoal/15 z-0" />
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-emerald-600 transition-all duration-300 z-0"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isClickable = stepNum <= currentStep;

          return (
            <div key={stepNum} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(stepNum)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all select-none ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm hover:scale-105 cursor-pointer'
                    : isCurrent
                    ? 'bg-solar-ink text-white ring-4 ring-emerald-500/20 shadow-md scale-110'
                    : 'bg-white text-solar-charcoal/50 border border-solar-charcoal/20 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 text-white" /> : stepNum}
              </button>
              <span
                className={`mt-1.5 text-[10px] sm:text-[11px] font-medium hidden sm:block transition-colors ${
                  isCurrent ? 'text-solar-ink font-semibold' : 'text-solar-charcoal/60'
                }`}
              >
                {stepTitles[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
