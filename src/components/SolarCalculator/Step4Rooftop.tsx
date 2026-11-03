import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Compass, Sun, Info, Check, Calculator } from 'lucide-react';
import { RoofType, RoofOrientation, ShadingLevel, SolarCalculatorInputs, calculateRoofAreaHelper } from '../../lib/solarCalculator';

interface Step4Props {
  inputs: SolarCalculatorInputs;
  onChange: (updates: Partial<SolarCalculatorInputs>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step4Rooftop: React.FC<Step4Props> = ({ inputs, onChange, onPrev, onNext }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [showHelper, setShowHelper] = useState<boolean>(false);
  const [helperLength, setHelperLength] = useState<string>('30');
  const [helperWidth, setHelperWidth] = useState<string>('20');
  const [helperUsablePercent, setHelperUsablePercent] = useState<number>(80);

  const applyHelper = () => {
    const l = parseFloat(helperLength) || 0;
    const w = parseFloat(helperWidth) || 0;
    const computed = calculateRoofAreaHelper(l, w, helperUsablePercent);
    onChange({
      roofAreaSqFt: computed,
      roofAreaUnit: 'sqft',
      roofLengthFt: l,
      roofWidthFt: w,
      roofUsablePercentage: helperUsablePercent,
    });
    setShowHelper(false);
  };

  const roofTypes: { id: RoofType; labelEn: string; labelHi: string }[] = [
    { id: 'rcc', labelEn: 'RCC (Flat Concrete)', labelHi: 'आरसीसी (पक्की समतल छत)' },
    { id: 'metal_sheet', labelEn: 'Metal / Industrial Sheet', labelHi: 'टिन / मेटल शेड' },
    { id: 'tiled', labelEn: 'Tiled / Sloped Roof', labelHi: 'खपरैल / ढलुआ छत' },
    { id: 'other', labelEn: 'Other / Ground Mount', labelHi: 'अन्य / ज़मीन पर' },
  ];

  const orientations: { id: RoofOrientation; labelEn: string; labelHi: string }[] = [
    { id: 'south', labelEn: 'South (Optimal)', labelHi: 'दक्षिण (सर्वोत्तम)' },
    { id: 'east', labelEn: 'East', labelHi: 'पूर्व' },
    { id: 'west', labelEn: 'West', labelHi: 'पश्चिम' },
    { id: 'north', labelEn: 'North', labelHi: 'उत्तर' },
    { id: 'mixed', labelEn: 'Mixed / Dual Pitch', labelHi: 'मिश्रित' },
    { id: 'unsure', labelEn: 'Not Sure', labelHi: 'निश्चित नहीं' },
  ];

  const shadingLevels: { id: ShadingLevel; labelEn: string; labelHi: string }[] = [
    { id: 'low', labelEn: 'Low / None (Clear Sun)', labelHi: 'न्यूनतम / खुली धूप' },
    { id: 'moderate', labelEn: 'Moderate (Partial Shade)', labelHi: 'मध्यम (आंशिक छाया)' },
    { id: 'high', labelEn: 'High (Nearby Trees/Walls)', labelHi: 'अधिक (पेड़ या दीवारें)' },
    { id: 'unsure', labelEn: 'Not Sure', labelHi: 'निश्चित नहीं' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className={`font-display text-lg sm:text-xl font-semibold text-solar-ink mb-1 ${isHindi ? 'font-sans' : ''}`}>
          {t('calculator.step4.heading', 'Step 4: Rooftop & Site Conditions')}
        </h4>
        <p className="text-xs sm:text-sm text-solar-charcoal/70">
          {t('calculator.step4.subheading', 'Help us verify available space and solar mounting feasibility (optional).')}
        </p>
      </div>

      {/* Roof Area Field with Helper Toggle */}
      <div className="glass-card-subtle p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="roof-area-input" className="block text-xs font-semibold text-solar-ink">
            {t('calculator.roof.areaLabel', 'Usable Shadow-Free Roof Area')} ({t('calculator.common.optional', 'Optional')})
          </label>
          <button
            type="button"
            onClick={() => setShowHelper(!showHelper)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showHelper ? t('calculator.roof.hideHelper', 'Hide Dimension Helper') : t('calculator.roof.useHelper', 'Use Dimension Helper (L × W)')}</span>
          </button>
        </div>

        <p className="text-[11px] text-solar-charcoal/70 mb-3">
          {t('calculator.roof.areaNote', 'A typical 1 kW system requires ~90 sq. ft. of shadow-free rooftop space.')}
        </p>

        {/* Dimension Helper Accordion */}
        {showHelper && (
          <div className="p-4 rounded-xl bg-white/90 border border-emerald-600/30 mb-4 space-y-3">
            <div className="text-xs font-semibold text-solar-ink flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-emerald-600" />
              <span>{t('calculator.roof.helperTitle', 'Rooftop Dimension Helper')}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-solar-charcoal/75 mb-1">Length (ft)</label>
                <input
                  type="number"
                  value={helperLength}
                  onChange={(e) => setHelperLength(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border text-xs font-mono"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-[10px] text-solar-charcoal/75 mb-1">Width (ft)</label>
                <input
                  type="number"
                  value={helperWidth}
                  onChange={(e) => setHelperWidth(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border text-xs font-mono"
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-[10px] text-solar-charcoal/75 mb-1">Usable %</label>
                <select
                  value={helperUsablePercent}
                  onChange={(e) => setHelperUsablePercent(parseInt(e.target.value, 10))}
                  className="w-full h-9 px-2 rounded-lg border text-xs"
                >
                  <option value={90}>90% (Clear)</option>
                  <option value={80}>80% (Typical)</option>
                  <option value={70}>70% (Tank/Parapet)</option>
                  <option value={50}>50% (Crowded)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-emerald-800">
                Calculated Usable Area: {calculateRoofAreaHelper(parseFloat(helperLength) || 0, parseFloat(helperWidth) || 0, helperUsablePercent)} sq ft
              </span>
              <button
                type="button"
                onClick={applyHelper}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Apply Area
              </button>
            </div>
          </div>
        )}

        {/* Direct Input */}
        <div className="relative flex items-center max-w-sm">
          <input
            id="roof-area-input"
            type="number"
            min="0"
            step="50"
            value={inputs.roofAreaSqFt || ''}
            onChange={(e) => onChange({ roofAreaSqFt: parseFloat(e.target.value) || 0, roofAreaUnit: 'sqft' })}
            placeholder="e.g. 600"
            className="w-full h-11 pl-3.5 pr-20 rounded-xl bg-white border border-solar-charcoal/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-solar-ink outline-none font-mono"
          />
          <span className="absolute right-3.5 text-xs font-medium text-solar-charcoal/60 pointer-events-none">
            Sq. Ft.
          </span>
        </div>
      </div>

      {/* Roof Type Selection */}
      <div>
        <label className="block text-xs font-semibold text-solar-ink mb-2">
          {t('calculator.roof.typeLabel', 'Rooftop Construction Type')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {roofTypes.map((rt) => {
            const isSelected = (inputs.roofType || 'rcc') === rt.id;
            return (
              <button
                key={rt.id}
                type="button"
                onClick={() => onChange({ roofType: rt.id })}
                className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-600 font-semibold text-solar-ink shadow-sm'
                    : 'bg-white/60 hover:bg-white border-solar-charcoal/15 text-solar-charcoal'
                }`}
              >
                <span>{isHindi ? rt.labelHi : rt.labelEn}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orientation & Shading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Orientation */}
        <div className="glass-card-subtle p-4 rounded-2xl">
          <label className="block text-xs font-semibold text-solar-ink mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-solar-amber" />
            <span>{t('calculator.roof.orientationLabel', 'Roof Orientation / Facing')}</span>
          </label>
          <select
            value={inputs.roofOrientation || 'south'}
            onChange={(e) => onChange({ roofOrientation: e.target.value as RoofOrientation })}
            className="w-full h-10 px-3 rounded-xl bg-white border border-solar-charcoal/20 text-xs font-medium text-solar-ink outline-none"
          >
            {orientations.map((o) => (
              <option key={o.id} value={o.id}>
                {isHindi ? o.labelHi : o.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Shading */}
        <div className="glass-card-subtle p-4 rounded-2xl">
          <label className="block text-xs font-semibold text-solar-ink mb-1.5 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-solar-amber" />
            <span>{t('calculator.roof.shadingLabel', 'Surrounding Shadow / Obstruction')}</span>
          </label>
          <select
            value={inputs.shadingLevel || 'low'}
            onChange={(e) => onChange({ shadingLevel: e.target.value as ShadingLevel })}
            className="w-full h-10 px-3 rounded-xl bg-white border border-solar-charcoal/20 text-xs font-medium text-solar-ink outline-none"
          >
            {shadingLevels.map((s) => (
              <option key={s.id} value={s.id}>
                {isHindi ? s.labelHi : s.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Technical Guidance */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-solar-charcoal/5 text-xs text-solar-charcoal/70">
        <Info className="w-3.5 h-3.5 text-solar-amber shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          {t(
            'calculator.roof.guidanceNote',
            'Water tanks, mumty/staircases, high parapets and surrounding trees cast shadows that reduce generation. SK SOLAR WALA engineers conduct a 3D shadow analysis before final installation.'
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
          className="px-6 py-2.5 rounded-xl bg-solar-ink hover:bg-solar-charcoal text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-98"
        >
          {t('calculator.actions.continuePreferences', 'Continue to System Preferences →')}
        </button>
      </div>
    </div>
  );
};
