import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { SolarCalculatorInputs } from '../../lib/solarCalculator';

interface Step3Props {
  inputs: SolarCalculatorInputs;
  onChange: (updates: Partial<SolarCalculatorInputs>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step3Tariff: React.FC<Step3Props> = ({ inputs, onChange, onPrev, onNext }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const isValid = (inputs.electricityTariff || 0) > 0;

  return (
    <div className="space-y-6">
      <div>
        <h4 className={`font-display text-lg sm:text-xl font-semibold text-solar-ink mb-1 ${isHindi ? 'font-sans' : ''}`}>
          {t('calculator.step3.heading', 'Step 3: Your Electricity Unit Cost')}
        </h4>
        <p className="text-xs sm:text-sm text-solar-charcoal/70">
          {t('calculator.step3.subheading', 'Specify your current grid electricity tariff to calculate accurate financial returns.')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Field 1: Per-Unit Tariff */}
        <div className="glass-card-subtle p-5 rounded-2xl sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="tariff-input" className="block text-xs font-semibold text-solar-ink">
              {t('calculator.tariff.rateLabel', 'Electricity Tariff per Unit')} *
            </label>
            <span className="text-[11px] font-mono text-solar-charcoal/60">
              UPPCL Reference: ₹7.00 - ₹8.50/unit
            </span>
          </div>
          <p className="text-[11px] text-solar-charcoal/70 mb-3">
            {t('calculator.tariff.rateHint', 'Enter the blended per-unit rate from your latest electricity bill.')}
          </p>

          <div className="relative flex items-center max-w-sm">
            <span className="absolute left-3.5 text-sm font-semibold text-solar-charcoal/70 pointer-events-none">
              ₹
            </span>
            <input
              id="tariff-input"
              type="number"
              min="1"
              max="30"
              step="0.25"
              value={inputs.electricityTariff || ''}
              onChange={(e) => onChange({ electricityTariff: parseFloat(e.target.value) || 0 })}
              placeholder="7.50"
              className="w-full h-12 pl-9 pr-20 rounded-xl bg-white border border-solar-charcoal/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-base font-semibold text-solar-ink outline-none font-mono"
            />
            <span className="absolute right-3.5 text-xs font-medium text-solar-charcoal/60 pointer-events-none">
              per kWh
            </span>
          </div>
        </div>

        {/* Field 2: Optional Fixed Monthly Charges */}
        <div className="glass-card-subtle p-4 rounded-2xl">
          <label htmlFor="fixed-charges-input" className="block text-xs font-semibold text-solar-ink mb-1">
            {t('calculator.tariff.fixedLabel', 'Fixed Monthly Charges')} ({t('calculator.common.optional', 'Optional')})
          </label>
          <p className="text-[11px] text-solar-charcoal/65 mb-2.5">
            {t('calculator.tariff.fixedHint', 'Fixed demand charge from your DISCOM bill (e.g. ₹110/kW/mo).')}
          </p>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-semibold text-solar-charcoal/70 pointer-events-none">
              ₹
            </span>
            <input
              id="fixed-charges-input"
              type="number"
              min="0"
              step="50"
              value={inputs.fixedChargesMonthly || ''}
              onChange={(e) => onChange({ fixedChargesMonthly: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 220"
              className="w-full h-11 pl-7 pr-16 rounded-xl bg-white border border-solar-charcoal/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-semibold text-solar-ink outline-none font-mono"
            />
            <span className="absolute right-3 text-xs text-solar-charcoal/50 pointer-events-none">
              / mo
            </span>
          </div>
        </div>

        {/* Field 3: Optional Sanctioned Load */}
        <div className="glass-card-subtle p-4 rounded-2xl">
          <label htmlFor="load-input" className="block text-xs font-semibold text-solar-ink mb-1">
            {t('calculator.tariff.loadLabel', 'Sanctioned Meter Load')} ({t('calculator.common.optional', 'Optional')})
          </label>
          <p className="text-[11px] text-solar-charcoal/65 mb-2.5">
            {t('calculator.tariff.loadHint', 'Approved load mentioned on your bill. In UP, solar capacity can match 100% of load.')}
          </p>
          <div className="relative flex items-center">
            <input
              id="load-input"
              type="number"
              min="1"
              max="200"
              step="1"
              value={inputs.sanctionedLoadKw || ''}
              onChange={(e) => onChange({ sanctionedLoadKw: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 5"
              className="w-full h-11 pl-3.5 pr-14 rounded-xl bg-white border border-solar-charcoal/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-semibold text-solar-ink outline-none font-mono"
            />
            <span className="absolute right-3 text-xs text-solar-charcoal/50 pointer-events-none font-mono">
              kW
            </span>
          </div>
        </div>
      </div>

      {/* Tariff Disclaimer Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-solar-charcoal/80">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          {t(
            'calculator.tariff.slabNote',
            'Your actual electricity rate may vary by DISCOM (DVVNL / MVVNL / PVVNL / PuVVNL), consumer category and billing slab. Use the rate from your latest electricity bill for a more useful estimate.'
          )}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-solar-charcoal/20 bg-white/50 hover:bg-white text-xs font-semibold text-solar-charcoal transition-all"
        >
          ← {t('calculator.actions.back', 'Back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="px-6 py-2.5 rounded-xl bg-solar-ink hover:bg-solar-charcoal text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-98"
        >
          {t('calculator.actions.continueRoof', 'Continue to Rooftop →')}
        </button>
      </div>
    </div>
  );
};
