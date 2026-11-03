import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import {
  SolarCalculatorInputs,
  calculateSolarSystem,
} from '../../lib/solarCalculator';
import { CalculatorProgress } from './CalculatorProgress';
import { Step1CalculationMode } from './Step1CalculationMode';
import { Step2LocationCategory } from './Step2LocationCategory';
import { Step3Tariff } from './Step3Tariff';
import { Step4Rooftop } from './Step4Rooftop';
import { Step5SystemPreferences } from './Step5SystemPreferences';
import { SolarSavingsReport } from './SolarSavingsReport';

export interface SolarCalculatorProps {
  initialInputs?: Partial<SolarCalculatorInputs>;
  onOpenQuote?: (prefill?: any) => void;
  className?: string;
}

const DEFAULT_INPUTS: SolarCalculatorInputs = {
  mode: 'consumption',
  monthlyUnits: 540,
  monthlyBill: 4050,
  roofAreaSqFt: 500,
  districtId: 'varanasi',
  category: 'residential',
  electricityTariff: 7.5,
  fixedChargesMonthly: 110,
  sanctionedLoadKw: 5,
  roofType: 'rcc',
  roofOrientation: 'south',
  shadingLevel: 'low',
  targetOffsetRatio: 1.0,
  moduleWattage: 550,
  systemType: 'ongrid',
};

export const SolarCalculator: React.FC<SolarCalculatorProps> = ({
  initialInputs,
  onOpenQuote,
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [inputs, setInputs] = useState<SolarCalculatorInputs>({
    ...DEFAULT_INPUTS,
    ...initialInputs,
  });

  const [step, setStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'wizard' | 'report'>('wizard');

  // Calculated results reactive to inputs
  const results = useMemo(() => calculateSolarSystem(inputs), [inputs]);

  const updateInputs = (updates: Partial<SolarCalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setStep(1);
    setViewMode('wizard');
  };

  const handleNext = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      setViewMode('report');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div
      className={`relative glass-panel rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl text-solar-charcoal transition-all w-full overflow-hidden ${className}`}
      role="region"
      aria-label="SK Solar Sizing & Savings Calculator"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-solar-charcoal/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
            <span className="text-[10px] font-semibold tracking-wider uppercase text-solar-charcoal/70">
              {t('calculator.badge', 'UP ROOFTOP SOLAR SIZING & SAVINGS ESTIMATOR')}
            </span>
          </div>
          <h3 className={`font-display text-xl sm:text-2xl font-semibold text-solar-ink flex items-center gap-2.5 ${isHindi ? 'font-sans' : ''}`}>
            <Calculator className="w-5 h-5 text-solar-amber shrink-0" />
            <span>{t('calculator.title', 'SK Solar Savings Calculator')}</span>
          </h3>
          <p className="text-xs text-solar-charcoal/70 mt-0.5 max-w-xl">
            {t(
              'calculator.subtitle',
              'Precision rooftop solar sizing, generation & PM Surya Ghar financial model for Uttar Pradesh.'
            )}
          </p>
        </div>

        {/* Actions: Reset & Edit */}
        <div className="flex items-center gap-2 shrink-0">
          {viewMode === 'report' ? (
            <button
              type="button"
              onClick={() => setViewMode('wizard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-solar-charcoal/15 text-xs font-semibold text-solar-ink shadow-sm transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-solar-amber" />
              <span>{t('calculator.actions.editParameters', 'Edit Parameters')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/80 border border-solar-charcoal/10 text-xs font-medium text-solar-charcoal/80 hover:text-solar-ink transition-all active:scale-95"
              title={t('calculator.actions.reset', 'Reset')}
            >
              <RotateCcw className="w-3.5 h-3.5 text-solar-amber" />
              <span className="hidden sm:inline">{t('calculator.actions.reset', 'Reset')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Wizard Progress Bar */}
      {viewMode === 'wizard' && (
        <div className="mb-6">
          <CalculatorProgress currentStep={step} totalSteps={5} onStepClick={(s) => setStep(s)} />
        </div>
      )}

      {/* Main View Area */}
      {viewMode === 'wizard' ? (
        <div className="space-y-6">
          {step === 1 && (
            <Step1CalculationMode
              inputs={inputs}
              onChange={updateInputs}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <Step2LocationCategory
              inputs={inputs}
              onChange={updateInputs}
              onNext={handleNext}
              onPrev={handleBack}
            />
          )}

          {step === 3 && (
            <Step3Tariff
              inputs={inputs}
              onChange={updateInputs}
              onNext={handleNext}
              onPrev={handleBack}
            />
          )}

          {step === 4 && (
            <Step4Rooftop
              inputs={inputs}
              onChange={updateInputs}
              onNext={handleNext}
              onPrev={handleBack}
            />
          )}

          {step === 5 && (
            <Step5SystemPreferences
              inputs={inputs}
              onChange={updateInputs}
              onCalculate={() => setViewMode('report')}
              onPrev={handleBack}
            />
          )}

          {/* Persistent Live Snapshot Pill during Wizard */}
          <div className="pt-3 border-t border-solar-charcoal/10 flex flex-wrap items-center justify-between gap-3 text-xs bg-solar-amber/5 rounded-2xl p-3 border border-solar-amber/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-solar-amber shrink-0" />
              <span className="text-solar-charcoal/70">
                {t('calculator.liveEstimated', 'Estimated Capacity')}:
              </span>
              <strong className="text-solar-ink font-semibold">
                {results.recommendedCapacityKwp > 0
                  ? `${results.recommendedCapacityKwp.toFixed(1)} kWp`
                  : '—'}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-solar-charcoal/70">
                {t('calculator.liveSavings', 'Est. Year 1 Savings')}:
              </span>
              <strong className="text-emerald-700 font-semibold">
                ₹{Math.round(results.annualSavingsInr).toLocaleString('en-IN')}/yr
              </strong>
            </div>

            {results.subsidy.totalSubsidy > 0 && (
              <div className="flex items-center gap-1.5 text-solar-amber-dark font-medium">
                <Sparkles className="w-3.5 h-3.5 text-solar-amber shrink-0" />
                <span>
                  {t('calculator.liveSubsidy', 'PM Surya Ghar')}:{' '}
                  <strong>₹{results.subsidy.totalSubsidy.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <SolarSavingsReport
          inputs={inputs}
          results={results}
          onEditInputs={() => setViewMode('wizard')}
          onOpenQuote={onOpenQuote}
        />
      )}
    </div>
  );
};
