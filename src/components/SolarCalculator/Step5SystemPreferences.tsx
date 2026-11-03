import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sliders, Cpu, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { SystemType, SolarCalculatorInputs } from '../../lib/solarCalculator';

interface Step5Props {
  inputs: SolarCalculatorInputs;
  onChange: (updates: Partial<SolarCalculatorInputs>) => void;
  onPrev: () => void;
  onCalculate: () => void;
}

export const Step5SystemPreferences: React.FC<Step5Props> = ({ inputs, onChange, onPrev, onCalculate }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const offsets = [
    { ratio: 0.5, label: '50%' },
    { ratio: 0.6, label: '60%' },
    { ratio: 0.7, label: '70%' },
    { ratio: 0.8, label: '80%' },
    { ratio: 0.9, label: '90%' },
    { ratio: 1.0, label: '100% (Full Net-Zero)' },
  ];

  const modules = [
    { wattage: 450, label: '450W Mono-PERC', desc: 'Standard high-efficiency format' },
    { wattage: 500, label: '500W High Output', desc: 'High density silicon cells' },
    { wattage: 550, label: '550W Bifacial TOPCon', desc: 'Tier-1 premium maximum yield (Recommended)' },
  ];

  const systemTypes: { id: SystemType; labelEn: string; labelHi: string; descEn: string; descHi: string; subsidyEligible: boolean }[] = [
    {
      id: 'ongrid',
      labelEn: 'On-Grid (Grid-Tied)',
      labelHi: 'ऑन-ग्रिड (ग्रिड कनेक्टेड)',
      descEn: 'Feeds surplus solar to grid via bidirectional net-meter. Lowest cost, maximum ROI, PM Surya Ghar subsidy eligible.',
      descHi: 'नेट-मीटर द्वारा ग्रिड में अतिरिक्त बिजली का आदान-प्रदान। न्यूनतम लागत, सबसे तेज पेबैक, सब्सिडी पात्र।',
      subsidyEligible: true,
    },
    {
      id: 'hybrid',
      labelEn: 'Hybrid (Grid + Battery)',
      labelHi: 'हाइब्रिड (ग्रिड + बैटरी बैकअप)',
      descEn: 'Combines net-metering export with lithium battery storage for power backup during grid outages.',
      descHi: 'बिजली कटौती के दौरान बैकअप के लिए लीथियम बैटरी और ग्रिड एक्सपोर्ट का संयोजन।',
      subsidyEligible: false,
    },
    {
      id: 'offgrid',
      labelEn: 'Off-Grid (Battery Only)',
      labelHi: 'ऑफ-ग्रिड (केवल बैटरी)',
      descEn: 'Fully isolated energy system with heavy battery storage. Suitable only for remote locations without grid access.',
      descHi: 'ग्रिड रहित दूरदराज के क्षेत्रों के लिए पूर्णतः स्वतंत्र बैटरी-आधारित सोलर संयंत्र।',
      subsidyEligible: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className={`font-display text-lg sm:text-xl font-semibold text-solar-ink mb-1 ${isHindi ? 'font-sans' : ''}`}>
          {t('calculator.step5.heading', 'Step 5: System Configuration & Preferences')}
        </h4>
        <p className="text-xs sm:text-sm text-solar-charcoal/70">
          {t('calculator.step5.subheading', 'Fine-tune solar offset, panel efficiency and system architecture.')}
        </p>
      </div>

      {/* Target Offset Ratio */}
      <div className="glass-card-subtle p-5 rounded-2xl">
        <label className="block text-xs font-semibold text-solar-ink mb-1 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-solar-amber" />
          <span>{t('calculator.preferences.offsetLabel', 'Target Electricity Bill Offset')}</span>
        </label>
        <p className="text-[11px] text-solar-charcoal/70 mb-3">
          {t('calculator.preferences.offsetHint', 'Choose what fraction of your total electricity demand you wish to offset with solar.')}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {offsets.map((o) => {
            const isSelected = Math.abs((inputs.targetOffsetRatio || 1.0) - o.ratio) < 0.05;
            return (
              <button
                key={o.ratio}
                type="button"
                onClick={() => onChange({ targetOffsetRatio: o.ratio })}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-solar-ink text-white border-solar-ink shadow-sm'
                    : 'bg-white/70 hover:bg-white text-solar-charcoal border-solar-charcoal/15'
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Solar Module Wattage */}
      <div className="glass-card-subtle p-5 rounded-2xl">
        <label className="block text-xs font-semibold text-solar-ink mb-1 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-solar-amber" />
          <span>{t('calculator.preferences.moduleLabel', 'Photovoltaic Module Rating')}</span>
        </label>
        <p className="text-[11px] text-solar-charcoal/70 mb-3">
          {t('calculator.preferences.moduleHint', 'Higher wattage panels generate more power per square foot of roof space.')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {modules.map((m) => {
            const isSelected = (inputs.moduleWattage || 550) === m.wattage;
            return (
              <button
                key={m.wattage}
                type="button"
                onClick={() => onChange({ moduleWattage: m.wattage })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-500/30'
                    : 'bg-white/60 hover:bg-white border-solar-charcoal/15 text-solar-charcoal'
                }`}
              >
                <div className="font-display font-bold text-xs sm:text-sm text-solar-ink mb-0.5">
                  {m.label}
                </div>
                <p className="text-[10px] text-solar-charcoal/65">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Type: On-Grid / Hybrid / Off-Grid */}
      <div>
        <label className="block text-xs font-semibold text-solar-ink mb-1.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-solar-amber" />
          <span>{t('calculator.preferences.systemTypeLabel', 'Solar System Architecture')}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {systemTypes.map((st) => {
            const isSelected = (inputs.systemType || 'ongrid') === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onChange({ systemType: st.id })}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/60 hover:bg-white border-solar-charcoal/15 text-solar-charcoal'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-semibold text-xs sm:text-sm text-solar-ink">
                      {isHindi ? st.labelHi : st.labelEn}
                    </span>
                    {st.subsidyEligible && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                        Subsidy
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-solar-charcoal/70 leading-relaxed mt-1">
                    {isHindi ? st.descHi : st.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Note */}
      {inputs.systemType !== 'ongrid' && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-solar-charcoal/80">
          <ShieldAlert className="w-4 h-4 text-solar-amber shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {t(
              'calculator.preferences.hybridWarning',
              'Battery backup systems (Hybrid/Off-Grid) involve significant battery replacement and maintenance costs over 25 years. On-grid rooftop solar remains the most reliable and highest-ROI option where grid power is available.'
            )}
          </p>
        </div>
      )}

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
          onClick={onCalculate}
          className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98 flex items-center gap-2"
        >
          <span>{t('calculator.actions.calculateReport', 'Generate Solar Savings Report')}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
