import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Building, Factory, Home, ShieldCheck } from 'lucide-react';
import { CustomerCategory, SolarCalculatorInputs } from '../../lib/solarCalculator';
import { UP_DISTRICTS } from '../../config/solarAssumptions';

interface Step2Props {
  inputs: SolarCalculatorInputs;
  onChange: (updates: Partial<SolarCalculatorInputs>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2LocationCategory: React.FC<Step2Props> = ({ inputs, onChange, onPrev, onNext }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const categories: { id: CustomerCategory; titleKey: string; descKey: string; icon: typeof Home; subsidyBadge?: boolean }[] = [
    {
      id: 'residential',
      titleKey: 'calculator.category.residential',
      descKey: 'calculator.category.residentialDesc',
      icon: Home,
      subsidyBadge: true,
    },
    {
      id: 'commercial',
      titleKey: 'calculator.category.commercial',
      descKey: 'calculator.category.commercialDesc',
      icon: Building,
    },
    {
      id: 'industrial',
      titleKey: 'calculator.category.industrial',
      descKey: 'calculator.category.industrialDesc',
      icon: Factory,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className={`font-display text-lg sm:text-xl font-semibold text-solar-ink mb-1 ${isHindi ? 'font-sans' : ''}`}>
          {t('calculator.step2.heading', 'Step 2: Location & Customer Category')}
        </h4>
        <p className="text-xs sm:text-sm text-solar-charcoal/70">
          {t('calculator.step2.subheading', 'SK SOLAR WALA serves Uttar Pradesh, primarily Varanasi and surrounding districts.')}
        </p>
      </div>

      {/* State & District Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State (Fixed to Uttar Pradesh) */}
        <div className="glass-card-subtle p-4 rounded-2xl">
          <label className="block text-xs font-semibold text-solar-ink mb-1">
            {t('calculator.location.stateLabel', 'State / Territory')}
          </label>
          <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl bg-white/50 border border-solar-charcoal/15 text-xs font-semibold text-solar-charcoal select-none">
            <MapPin className="w-4 h-4 text-solar-amber shrink-0" />
            <span>{isHindi ? 'उत्तर प्रदेश (UP Only)' : 'Uttar Pradesh (UP Only)'}</span>
            <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Verified
            </span>
          </div>
          <p className="text-[10px] text-solar-charcoal/60 mt-1.5">
            {t('calculator.location.stateNote', 'Service restricted exclusively to Uttar Pradesh.')}
          </p>
        </div>

        {/* District Selector */}
        <div className="glass-card-subtle p-4 rounded-2xl">
          <label htmlFor="district-select" className="block text-xs font-semibold text-solar-ink mb-1">
            {t('calculator.location.districtLabel', 'District / Operational Area')} *
          </label>
          <select
            id="district-select"
            value={inputs.districtId}
            onChange={(e) => onChange({ districtId: e.target.value })}
            className="w-full h-11 px-3 rounded-xl bg-white border border-solar-charcoal/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-semibold text-solar-ink outline-none"
          >
            {UP_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {isHindi ? d.nameHi : d.nameEn} {d.isPrimary ? '★' : ''}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-solar-charcoal/60 mt-1.5">
            {t('calculator.location.districtNote', '★ Priority direct installation zones in Eastern UP.')}
          </p>
        </div>
      </div>

      {/* Customer Category Cards */}
      <div>
        <label className="block text-xs font-semibold text-solar-ink mb-2">
          {t('calculator.category.selectLabel', 'Select Customer Category')} *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {categories.map((cat) => {
            const isSelected = inputs.category === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  // If category changes, update sensible default tariff
                  const newTariff = cat.id === 'residential' ? 7.5 : cat.id === 'commercial' ? 8.5 : 7.8;
                  onChange({ category: cat.id, electricityTariff: newTariff });
                }}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between relative group select-none ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/60 hover:bg-white/90 border-solar-charcoal/15 text-solar-charcoal'
                }`}
              >
                {cat.subsidyBadge && (
                  <span className="inline-block self-start mb-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold tracking-wider uppercase">
                    PM Surya Ghar Eligible
                  </span>
                )}
                <div>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-solar-amber/15 text-solar-amber'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-display font-semibold text-xs sm:text-sm text-solar-ink mb-1">
                    {t(cat.titleKey, cat.id === 'residential' ? 'Residential' : cat.id === 'commercial' ? 'Commercial' : 'Industrial')}
                  </div>
                  <p className="text-[11px] text-solar-charcoal/70 leading-relaxed">
                    {t(cat.descKey, cat.id === 'residential' ? 'Homes & residential societies' : cat.id === 'commercial' ? 'Shops, offices & clinics' : 'Factories & industrial units')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-solar-charcoal/80">
        <ShieldCheck className="w-4 h-4 text-solar-amber shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          {inputs.category === 'residential'
            ? t('calculator.category.resNotice', 'Residential consumers in UP are eligible for central CFA under PM Surya Ghar plus UP state solar top-up subsidy.')
            : t('calculator.category.commNotice', 'Commercial and industrial categories are not eligible for residential subsidies, but benefit from accelerated depreciation and high daytime tariff offsets.')}
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
          className="px-6 py-2.5 rounded-xl bg-solar-ink hover:bg-solar-charcoal text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-98"
        >
          {t('calculator.actions.continueTariff', 'Continue to Tariff →')}
        </button>
      </div>
    </div>
  );
};
