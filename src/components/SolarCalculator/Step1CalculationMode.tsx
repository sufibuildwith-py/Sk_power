import React from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt, Zap, Home, Sparkles } from 'lucide-react';
import { CalculationMode, SolarCalculatorInputs } from '../../lib/solarCalculator';

interface Step1Props {
  inputs: SolarCalculatorInputs;
  onChange: (updates: Partial<SolarCalculatorInputs>) => void;
  onNext: () => void;
}

export const Step1CalculationMode: React.FC<Step1Props> = ({ inputs, onChange, onNext }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const modes: { id: CalculationMode; titleKey: string; descKey: string; icon: typeof Receipt; recommended?: boolean }[] = [
    {
      id: 'consumption',
      titleKey: 'calculator.mode.consumptionTitle',
      descKey: 'calculator.mode.consumptionDesc',
      icon: Zap,
      recommended: true,
    },
    {
      id: 'bill',
      titleKey: 'calculator.mode.billTitle',
      descKey: 'calculator.mode.billDesc',
      icon: Receipt,
    },
    {
      id: 'area',
      titleKey: 'calculator.mode.areaTitle',
      descKey: 'calculator.mode.areaDesc',
      icon: Home,
    },
  ];

  const isValid = () => {
    if (inputs.mode === 'consumption') return (inputs.monthlyUnits || 0) > 0;
    if (inputs.mode === 'bill') return (inputs.monthlyBill || 0) > 0;
    if (inputs.mode === 'area') return (inputs.roofAreaSqFt || 0) > 0;
    return false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className={`font-display text-lg sm:text-xl font-semibold text-solar-ink mb-1 ${isHindi ? 'font-sans' : ''}`}>
          {t('calculator.step1.heading', 'Step 1: How would you like to calculate?')}
        </h4>
        <p className="text-xs sm:text-sm text-solar-charcoal/70">
          {t('calculator.step1.subheading', 'Select your preferred calculation approach to begin system sizing.')}
        </p>
      </div>

      {/* 3 Selectable Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {modes.map((m) => {
          const isSelected = inputs.mode === m.id;
          const Icon = m.icon;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange({ mode: m.id })}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between relative group select-none ${
                isSelected
                  ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white/60 hover:bg-white/90 border-solar-charcoal/15 text-solar-charcoal'
              }`}
            >
              {m.recommended && (
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t('calculator.mode.recommended', 'Preferred')}
                </span>
              )}
              <div>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-solar-amber/15 text-solar-amber'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-display font-semibold text-xs sm:text-sm text-solar-ink mb-1">
                  {t(m.titleKey, m.id === 'consumption' ? 'Monthly Consumption' : m.id === 'bill' ? 'Monthly Bill' : 'Rooftop Area')}
                </div>
                <p className="text-[11px] text-solar-charcoal/70 leading-relaxed">
                  {t(m.descKey, m.id === 'consumption' ? 'Enter units from meter (kWh)' : m.id === 'bill' ? 'Enter average bill in ₹' : 'Enter usable shadow-free roof')}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode-specific Input Card */}
      <div className="glass-card-subtle p-5 rounded-2xl">
        {inputs.mode === 'consumption' && (
          <div>
            <label htmlFor="input-consumption" className="block text-xs font-semibold text-solar-ink mb-1.5">
              {t('calculator.inputs.consumptionLabel', 'Monthly Metered Consumption')} *
            </label>
            <p className="text-[11px] text-solar-charcoal/70 mb-3">
              {t('calculator.inputs.consumptionHint', 'Enter your typical monthly electricity usage in kWh/units (e.g., 540 units).')}
            </p>
            <div className="relative flex items-center max-w-sm">
              <input
                id="input-consumption"
                type="number"
                min="0"
                step="10"
                value={inputs.monthlyUnits || ''}
                onChange={(e) => onChange({ monthlyUnits: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 540"
                className="w-full h-11 pl-3.5 pr-24 rounded-xl bg-white border border-solar-charcoal/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-solar-ink outline-none font-mono"
              />
              <span className="absolute right-3 text-xs font-medium text-solar-charcoal/60 pointer-events-none">
                kWh / Units
              </span>
            </div>
          </div>
        )}

        {inputs.mode === 'bill' && (
          <div>
            <label htmlFor="input-bill" className="block text-xs font-semibold text-solar-ink mb-1.5">
              {t('calculator.inputs.billLabel', 'Average Monthly Electricity Bill')} *
            </label>
            <p className="text-[11px] text-solar-charcoal/70 mb-3">
              {t('calculator.inputs.billHint', 'Enter your average monthly payment in INR. Consumption units are calculated based on your tariff.')}
            </p>
            <div className="relative flex items-center max-w-sm">
              <span className="absolute left-3 text-sm font-semibold text-solar-charcoal/70 pointer-events-none">
                ₹
              </span>
              <input
                id="input-bill"
                type="number"
                min="0"
                step="100"
                value={inputs.monthlyBill || ''}
                onChange={(e) => onChange({ monthlyBill: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 4050"
                className="w-full h-11 pl-8 pr-16 rounded-xl bg-white border border-solar-charcoal/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-solar-ink outline-none font-mono"
              />
              <span className="absolute right-3 text-xs font-medium text-solar-charcoal/60 pointer-events-none">
                / month
              </span>
            </div>
          </div>
        )}

        {inputs.mode === 'area' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-roof-area" className="block text-xs font-semibold text-solar-ink">
                {t('calculator.inputs.areaLabel', 'Usable Shadow-Free Roof Area')} *
              </label>
              <div className="flex items-center gap-1 bg-white/70 p-0.5 rounded-lg border border-solar-charcoal/15 text-[11px]">
                <button
                  type="button"
                  onClick={() => onChange({ roofAreaUnit: 'sqft' })}
                  className={`px-2 py-0.5 rounded ${inputs.roofAreaUnit !== 'sqm' ? 'bg-solar-ink text-white font-medium' : 'text-solar-charcoal/70'}`}
                >
                  Sq. Ft.
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ roofAreaUnit: 'sqm' })}
                  className={`px-2 py-0.5 rounded ${inputs.roofAreaUnit === 'sqm' ? 'bg-solar-ink text-white font-medium' : 'text-solar-charcoal/70'}`}
                >
                  Sq. M.
                </button>
              </div>
            </div>
            <p className="text-[11px] text-solar-charcoal/70 mb-3">
              {t('calculator.inputs.areaHint', 'Enter usable space without shadows from parapets, water tanks or adjacent buildings.')}
            </p>
            <div className="relative flex items-center max-w-sm">
              <input
                id="input-roof-area"
                type="number"
                min="0"
                step="25"
                value={inputs.roofAreaSqFt || ''}
                onChange={(e) => onChange({ roofAreaSqFt: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 500"
                className="w-full h-11 pl-3.5 pr-20 rounded-xl bg-white border border-solar-charcoal/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-solar-ink outline-none font-mono"
              />
              <span className="absolute right-3 text-xs font-medium text-solar-charcoal/60 pointer-events-none">
                {inputs.roofAreaUnit === 'sqm' ? 'Sq. M.' : 'Sq. Ft.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid()}
          className="px-6 py-2.5 rounded-xl bg-solar-ink hover:bg-solar-charcoal text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-98"
        >
          {t('calculator.actions.continue', 'Continue to Location →')}
        </button>
      </div>
    </div>
  );
};
