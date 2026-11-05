import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SunMedium,
  Zap,
  TrendingUp,
  Download,
  Share2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  TreePine,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { SolarCalculationResults, SolarCalculatorInputs } from '../../lib/solarCalculator';
import { UP_DISTRICTS } from '../../config/solarAssumptions';
import { generateSolarAssessmentPdf } from '../../lib/generateSolarAssessmentPdf';
import { openWhatsApp } from '../../utils/whatsapp';

interface SolarSavingsReportProps {
  inputs: SolarCalculatorInputs;
  results: SolarCalculationResults;
  onEditInputs: () => void;
  onOpenQuote?: (prefill?: any) => void;
}

export const SolarSavingsReport: React.FC<SolarSavingsReportProps> = ({
  inputs,
  results,
  onEditInputs,
  onOpenQuote,
}) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [showProjectionTable, setShowProjectionTable] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const district = UP_DISTRICTS.find((d) => d.id === inputs.districtId);
  const districtName = isHindi ? (district?.nameHi || 'वाराणसी') : (district?.nameEn || 'Varanasi');
  const categoryName = t(`calculator.category.${inputs.category}`, inputs.category);

  const formatCurrency = (val: number): string => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const formatUnits = (val: number): string => {
    return Math.round(val).toLocaleString('en-IN');
  };

  const currentDate = new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Share estimate / enquire via WhatsApp
  const handleShareWhatsApp = () => {
    const message =
      `Hello SK SOLAR WALA, I generated a solar estimate on your website and would like to proceed with consultation:\n` +
      `📍 Location: ${districtName}, Uttar Pradesh\n` +
      `⚡ Recommended Plant Size: ${results.actualCapacityKwp} kWp (${results.moduleCount} × ${results.moduleWattage}W panels)\n` +
      `☀️ Estimated Monthly Generation: ${formatUnits(results.monthlyGenerationKwh)} Units\n` +
      `💰 Estimated Monthly Savings: ${formatCurrency(results.monthlySavingsInr)}\n` +
      `📈 Estimated Annual Savings: ${formatCurrency(results.annualSavingsInr)}\n` +
      `${results.subsidy.isEligible ? `🏛️ Estimated PM Surya Ghar Subsidy: ${formatCurrency(results.subsidy.totalSubsidy)}\n` : ''}` +
      `💵 Estimated Net Investment: ${formatCurrency(results.netInvestmentInr)}\n` +
      `⏱️ Payback Period: ~${results.simplePaybackYears || 'N/A'} years`;

    openWhatsApp(message);
  };

  // Download Standalone One-Page A4 PDF Assessment Report
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateSolarAssessmentPdf({
        inputs,
        results,
        language: isHindi ? 'hi' : 'en',
      });
    } catch (err) {
      console.error('Failed to generate solar assessment PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 12 month labels
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxMonthlyGen = Math.max(...results.monthlyGenerationBreakdown, 1);

  return (
    <div
      className="space-y-7 text-solar-charcoal animate-fadeIn print:text-black"
      id="solar-savings-report-content"
    >
      {/* =========================================================================
          SECTION A: REPORT HEADER
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-solar-charcoal/15">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_8px_#10B981]" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {t('calculator.report.badge', 'Verified Solar Assessment')}
            </span>
            <span className="text-xs text-solar-charcoal/50">• {currentDate}</span>
          </div>
          <h3 className={`font-display text-2xl sm:text-3xl font-bold text-solar-ink ${isHindi ? 'font-sans' : ''}`}>
            {t('calculator.report.title', 'Your Solar Savings Report')}
          </h3>
          <p className="text-xs sm:text-sm text-solar-charcoal/70 mt-1">
            {t('calculator.report.subtitle', 'Customized rooftop solar feasibility and financial return assessment.')}
          </p>
        </div>

        {/* Header Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-solar-charcoal/15 text-xs text-solar-ink font-medium">
            <MapPin className="w-3.5 h-3.5 text-solar-amber" />
            <span>{districtName}, UP</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-solar-charcoal/15 text-xs text-solar-ink font-medium capitalize">
            <span>{categoryName}</span>
          </div>
          <button
            type="button"
            onClick={onEditInputs}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solar-ink/5 hover:bg-solar-ink/10 text-xs font-semibold text-solar-ink transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-solar-amber" />
            <span>{t('calculator.actions.editInputs', 'Edit Inputs')}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION B: PROMINENT RECOMMENDED PLANT CAPACITY
         ========================================================================= */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c231e] via-[#12332c] to-[#18463c] text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Big Plant Size Number */}
          <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-white/15 pb-6 lg:pb-0 lg:pr-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                {t('calculator.report.recommendedPlantSize', 'RECOMMENDED PLANT CAPACITY')}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight font-mono text-emerald-300">
                {results.actualCapacityKwp}
              </span>
              <span className="font-display text-2xl font-semibold text-white/90">kWp DC</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              {results.moduleCount} × {results.moduleWattage}W Tier-1 Photovoltaic Modules
              {results.systemType === 'hybrid' ? ' · Hybrid System with Battery' : ' · On-Grid Net-Metered System'}
            </p>

            {results.isRoofLimited && (
              <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  {t('calculator.report.roofConstrained', 'Capacity limited by your available shadow-free rooftop space.')}
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Three Essential Quick Stats */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-[10px] text-white/70 uppercase tracking-wider mb-1">
                {t('calculator.report.dailyGen', 'Daily Gen')}
              </div>
              <div className="font-display font-bold text-lg sm:text-xl text-white font-mono">
                ~{results.dailyGenerationKwh}
              </div>
              <div className="text-[10px] text-white/60">Units / day</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-[10px] text-white/70 uppercase tracking-wider mb-1">
                {t('calculator.report.monthlyGen', 'Monthly Gen')}
              </div>
              <div className="font-display font-bold text-lg sm:text-xl text-white font-mono">
                ~{formatUnits(results.monthlyGenerationKwh)}
              </div>
              <div className="text-[10px] text-white/60">Units / month</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-[10px] text-white/70 uppercase tracking-wider mb-1">
                {t('calculator.report.roofAreaReq', 'Roof Area')}
              </div>
              <div className="font-display font-bold text-lg sm:text-xl text-white font-mono">
                {results.roofAreaRequiredSqFt}
              </div>
              <div className="text-[10px] text-white/60">Sq. Ft. required</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION C: FINANCIAL SAVINGS BREAKDOWN
         ========================================================================= */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-solar-amber/15 border border-solar-amber/25 flex items-center justify-center text-solar-amber">
              <TrendingUp className="w-4 h-4 text-solar-amber" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-solar-ink">
                {t('calculator.report.financialSavingsTitle', 'Estimated Financial Savings')}
              </h4>
              <p className="text-xs text-solar-charcoal/70">
                {t('calculator.report.financialSavingsSubtitle', 'Derived from your grid tariff, self-consumption profile and net-metering export.')}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Prominent Savings Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5 rounded-2xl">
            <span className="text-xs font-semibold text-solar-charcoal/75 block mb-1">
              {t('calculator.report.monthlySavings', 'Monthly Savings')}
            </span>
            <div className="font-display text-2xl sm:text-3xl font-bold text-solar-ink font-mono mb-1">
              {formatCurrency(results.monthlySavingsInr)}
            </div>
            <span className="text-[11px] text-solar-charcoal/60">
              {formatUnits(results.selfConsumedUnitsMonthly)} units offset + export
            </span>
          </div>

          <div className="glass-card p-5 rounded-2xl border-emerald-600/30 bg-emerald-500/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-950">
                {t('calculator.report.annualSavings', 'First Year Savings')}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase">
                Annual
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-emerald-900 font-mono mb-1">
              {formatCurrency(results.annualSavingsInr)}
            </div>
            <span className="text-[11px] text-emerald-950/70">
              Immediate first-year power savings
            </span>
          </div>

          <div className="glass-card p-5 rounded-2xl border-solar-amber/35 bg-solar-amber/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-solar-ink flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-solar-amber" />
                <span>{t('calculator.report.lifetime25YearSavings', '25-Year Cumulative Savings')}</span>
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-solar-ink font-mono mb-1">
              {formatCurrency(results.lifetime25YearSavingsInr)}
            </div>
            <span className="text-[11px] text-solar-charcoal/70">
              Accounts for 0.6% degradation & 3% tariff rise
            </span>
          </div>
        </div>

        {/* Energy Flow Balance Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/60 border border-solar-charcoal/10 text-xs">
          <div>
            <span className="text-solar-charcoal/65 block text-[11px]">Monthly Consumption</span>
            <span className="font-bold text-solar-ink font-mono text-sm">{formatUnits(results.effectiveMonthlyUnits)} units</span>
          </div>
          <div>
            <span className="text-solar-charcoal/65 block text-[11px]">Solar Consumed On-Site</span>
            <span className="font-bold text-emerald-800 font-mono text-sm">{formatUnits(results.selfConsumedUnitsMonthly)} units</span>
          </div>
          <div>
            <span className="text-solar-charcoal/65 block text-[11px]">Remaining Grid Purchase</span>
            <span className="font-bold text-solar-charcoal font-mono text-sm">{formatUnits(results.gridImportUnitsMonthly)} units</span>
          </div>
          <div>
            <span className="text-solar-charcoal/65 block text-[11px]">Surplus Solar Export</span>
            <span className="font-bold text-sky-800 font-mono text-sm">{formatUnits(results.exportedUnitsMonthly)} units</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION D: ELECTRICITY GENERATION & 12-MONTH SEASONAL CHART
         ========================================================================= */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-700">
              <SunMedium className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-solar-ink">
                {t('calculator.report.generationProfileTitle', 'Solar Generation & Seasonal Profile')}
              </h4>
              <p className="text-xs text-solar-charcoal/70">
                Estimated generation curve modeled on Eastern Uttar Pradesh solar insolation data.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-solar-ink bg-white/70 px-3 py-1.5 rounded-xl border border-solar-charcoal/10 self-start sm:self-auto font-mono">
            Annual: {formatUnits(results.annualGenerationKwh)} kWh/yr
          </div>
        </div>

        {/* Monthly Generation Bar Chart */}
        <div className="bg-white/80 p-5 rounded-2xl border border-solar-charcoal/10 mb-4">
          <div className="text-[11px] font-semibold text-solar-charcoal/70 mb-3 flex items-center justify-between">
            <span>Monthly Expected Generation (kWh / Units)</span>
            <span className="text-solar-charcoal/50">Peak: April - May</span>
          </div>

          <div className="h-32 flex items-end justify-between gap-1.5 sm:gap-3 pt-4 border-b border-solar-charcoal/15 pb-2">
            {results.monthlyGenerationBreakdown.map((units, idx) => {
              const heightPercent = Math.max(15, Math.round((units / maxMonthlyGen) * 100));
              const isPeak = idx >= 2 && idx <= 4;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[9px] font-mono text-solar-charcoal/70 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {units}
                  </div>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isPeak
                        ? 'bg-solar-amber group-hover:bg-amber-500'
                        : 'bg-emerald-600/80 group-hover:bg-emerald-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${monthLabels[idx]}: ${units} units`}
                  />
                  <span className="text-[10px] text-solar-charcoal/60 mt-1.5 font-medium">
                    {monthLabels[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Generation Intervals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/50 border border-solar-charcoal/10">
            <span className="text-[10px] uppercase text-solar-charcoal/60 block">Daily</span>
            <span className="font-bold text-sm text-solar-ink font-mono">~{results.dailyGenerationKwh} kWh</span>
          </div>
          <div className="p-3 rounded-xl bg-white/50 border border-solar-charcoal/10">
            <span className="text-[10px] uppercase text-solar-charcoal/60 block">Monthly</span>
            <span className="font-bold text-sm text-solar-ink font-mono">~{formatUnits(results.monthlyGenerationKwh)} kWh</span>
          </div>
          <div className="p-3 rounded-xl bg-white/50 border border-solar-charcoal/10">
            <span className="text-[10px] uppercase text-solar-charcoal/60 block">Annual</span>
            <span className="font-bold text-sm text-solar-ink font-mono">{formatUnits(results.annualGenerationKwh)} kWh</span>
          </div>
          <div className="p-3 rounded-xl bg-white/50 border border-solar-charcoal/10">
            <span className="text-[10px] uppercase text-solar-charcoal/60 block">25-Year Lifetime</span>
            <span className="font-bold text-sm text-solar-ink font-mono">{formatUnits(results.lifetime25YearGenerationKwh)} kWh</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION E: PROJECT COST, SUBSIDY & PAYBACK
         ========================================================================= */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl">
        <h4 className="font-display font-bold text-base sm:text-lg text-solar-ink mb-1">
          {t('calculator.report.projectInvestmentTitle', 'Estimated Project Investment & Payback')}
        </h4>
        <p className="text-xs text-solar-charcoal/70 mb-5">
          Indicative turnkey capital cost including certified Tier-1 equipment, installation, structure, net-metering and warranty.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-[11px] text-solar-charcoal/70 block mb-1">Estimated Plant Cost</span>
            <div className="font-display text-xl font-bold text-solar-ink font-mono">
              {formatCurrency(results.costBeforeSubsidyInr)}
            </div>
            <span className="text-[10px] text-solar-charcoal/50">Before subsidy deduction</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border-emerald-600/30 bg-emerald-500/10">
            <span className="text-[11px] text-emerald-950 font-semibold block mb-1">
              {results.subsidy.isEligible ? 'Eligible Subsidy' : 'Subsidy Applicable'}
            </span>
            <div className="font-display text-xl font-bold text-emerald-900 font-mono">
              {results.subsidy.isEligible ? formatCurrency(results.subsidy.totalSubsidy) : '₹0'}
            </div>
            <span className="text-[10px] text-emerald-900/70">
              {results.subsidy.isEligible ? 'Central CFA + UP State Top-up' : 'Residential category only'}
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl bg-solar-ink text-white">
            <span className="text-[11px] text-white/70 block mb-1">Net Customer Investment</span>
            <div className="font-display text-xl font-bold text-white font-mono">
              {formatCurrency(results.netInvestmentInr)}
            </div>
            <span className="text-[10px] text-emerald-400">Post-subsidy estimated outlay</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border-solar-amber/35 bg-solar-amber/10">
            <span className="text-[11px] text-solar-ink font-semibold block mb-1">Simple Payback</span>
            <div className="font-display text-xl font-bold text-solar-ink font-mono">
              {results.simplePaybackYears ? `~${results.simplePaybackYears} Years` : 'N/A'}
            </div>
            <span className="text-[10px] text-solar-charcoal/65">
              ROI: {results.roi25YearPercent ? `${results.roi25YearPercent}%` : 'N/A'} over 25 yrs
            </span>
          </div>
        </div>

        {/* Subsidy Details & Caveats */}
        <div className="p-4 rounded-2xl bg-white/70 border border-solar-charcoal/10 text-xs text-solar-charcoal/80 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold text-solar-ink">
                {results.subsidy.schemeName}
              </span>
              <p className="mt-0.5">{isHindi ? results.subsidy.caveatNoteHi : results.subsidy.caveatNoteEn}</p>
            </div>
          </div>
        </div>

        {/* 25-Year Projection Toggle */}
        <div className="mt-4 pt-3 border-t border-solar-charcoal/10">
          <button
            type="button"
            onClick={() => setShowProjectionTable(!showProjectionTable)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            {showProjectionTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>
              {showProjectionTable
                ? t('calculator.report.hideProjections', 'Hide 25-Year Annual Projection Table')
                : t('calculator.report.showProjections', 'View 25-Year Annual Cashflow Projection Table')}
            </span>
          </button>

          {showProjectionTable && (
            <div className="mt-3 overflow-x-auto max-h-72 border border-solar-charcoal/15 rounded-xl bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-solar-charcoal/5 border-b border-solar-charcoal/15 text-[11px] font-semibold text-solar-ink sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3">Generation (kWh)</th>
                    <th className="py-2 px-3">Annual Savings (₹)</th>
                    <th className="py-2 px-3">Cumulative Savings (₹)</th>
                    <th className="py-2 px-3">Net Cashflow Position (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-solar-charcoal/10 font-mono text-[11px]">
                  {results.projectionTable.map((p) => (
                    <tr key={p.year} className={p.netCashflowInr >= 0 ? 'bg-emerald-50/40' : ''}>
                      <td className="py-1.5 px-3 font-semibold text-solar-ink">Yr {p.year}</td>
                      <td className="py-1.5 px-3">{formatUnits(p.annualGenerationKwh)}</td>
                      <td className="py-1.5 px-3">{formatCurrency(p.annualSavingsInr)}</td>
                      <td className="py-1.5 px-3 text-emerald-800 font-semibold">{formatCurrency(p.cumulativeSavingsInr)}</td>
                      <td className={`py-1.5 px-3 font-bold ${p.netCashflowInr >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {formatCurrency(p.netCashflowInr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION F: ENVIRONMENTAL IMPACT & RECOMMENDED EQUIPMENT
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Environmental Impact (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="w-5 h-5 text-emerald-700" />
              <h4 className="font-display font-bold text-base text-solar-ink">Environmental Offset</h4>
            </div>
            <p className="text-xs text-solar-charcoal/70 mb-4 leading-relaxed">
              Replacing thermal coal grid electricity with clean decentralized rooftop solar generation.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-950 font-medium block">CO₂ Avoided Annually</span>
                  <span className="font-bold text-base text-emerald-900 font-mono">
                    ~{formatUnits(results.annualCo2AvoidedKg)} kg / year
                  </span>
                </div>
                <span className="text-xl">🌿</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-950 font-medium block">Lifetime CO₂ Mitigated</span>
                  <span className="font-bold text-base text-emerald-900 font-mono">
                    ~{results.lifetimeCo2AvoidedTonnes} Tonnes
                  </span>
                </div>
                <span className="text-xl">🌍</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-solar-amber/15 border border-solar-amber/25 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-solar-ink font-medium block">Equivalent Trees Planted</span>
                  <span className="font-bold text-base text-solar-ink font-mono">
                    ~{results.equivalentTreesPlanted} Trees
                  </span>
                </div>
                <span className="text-xl">🌳</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-solar-charcoal/50 mt-4 leading-tight">
            *Based on CEA Indian Grid Emission Baseline (0.82 kg CO₂/kWh).
          </p>
        </div>

        {/* Recommended Equipment (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-solar-amber" />
            <h4 className="font-display font-bold text-base text-solar-ink">Recommended System Bill of Materials</h4>
          </div>
          <p className="text-xs text-solar-charcoal/70 mb-4">
            Industrial-grade hardware engineered for 25+ years of trouble-free operation in UP climates.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/70 border border-solar-charcoal/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-solar-ink block">Solar Modules</span>
                <span className="text-solar-charcoal/80 text-[11px]">{results.equipment.panels}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 border border-solar-charcoal/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-solar-ink block">Power Inverter</span>
                <span className="text-solar-charcoal/80 text-[11px]">{results.equipment.inverter}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 border border-solar-charcoal/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-solar-ink block">Elevated Mounting Structure</span>
                <span className="text-solar-charcoal/80 text-[11px]">{results.equipment.structure}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 border border-solar-charcoal/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-solar-ink block">Protection & Distribution</span>
                <span className="text-solar-charcoal/80 text-[11px]">{results.equipment.balanceOfSystem}</span>
              </div>
            </div>

            {results.equipment.battery && (
              <div className="p-3 rounded-xl bg-white/70 border border-solar-charcoal/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-solar-ink block">Battery Storage</span>
                  <span className="text-solar-charcoal/80 text-[11px]">{results.equipment.battery}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION G: ACTIONS (PDF Download, WhatsApp Share, Get Detailed Quote)
         ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-solar-ink text-white shadow-xl flex flex-col gap-4 print:hidden">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-solar-amber block mb-1">
            Ready to explore solar for your rooftop?
          </span>
          <h4 className="font-display text-xl sm:text-2xl font-normal text-white">
            Schedule a Free On-Site Technical Feasibility Survey
          </h4>
          <p className="text-xs text-white/75 mt-1 max-w-xl">
            SK SOLAR WALA handles full site inspection, DISCOM net-metering approvals and complete PM Surya Ghar application processing across UP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all flex items-center gap-2 active:scale-98"
            title={t('calculator.report.downloadPdf', 'Download Standalone A4 PDF Report')}
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-solar-amber" />
            ) : (
              <Download className="w-4 h-4 text-solar-amber" />
            )}
            <span>
              {isGeneratingPdf
                ? isHindi
                  ? 'पीडीएफ तैयार हो रहा है...'
                  : 'Generating PDF...'
                : isHindi
                ? 'पीडीएफ रिपोर्ट'
                : 'PDF Report'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-600/30 hover:bg-emerald-600/50 text-white text-xs font-semibold transition-all flex items-center gap-2"
            title="Share Summary via WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {onOpenQuote && (
            <button
              type="button"
              onClick={() =>
                onOpenQuote({
                  serviceInterest: inputs.category === 'residential' ? 'pmsuryaghar' : inputs.category,
                  city: inputs.districtId === 'varanasi' ? 'varanasi' : 'nearby_up',
                  bill: `₹${Math.round(results.effectiveMonthlyBill)}/mo (${results.recommendedCapacityKwp.toFixed(1)} kWp System)`,
                })
              }
              className="px-5 py-2.5 rounded-xl bg-solar-amber hover:bg-amber-400 text-solar-ink text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 active:scale-98"
            >
              <span>Get Detailed Solar Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-[10.5px] text-solar-charcoal/60 leading-relaxed border-t border-solar-charcoal/10 pt-4">
        <p>
          {t(
            'calculator.report.disclaimer',
            'Disclaimer: All numbers generated by this solar calculator are indicative planning estimates based on regional specific yields (1,450 kWh/kWp/year), typical module efficiencies and prevailing UPPCL tariff assumptions. Actual energy production and savings vary with true rooftop orientation, horizon shading, module temperature coefficients, grid availability and applicable DISCOM billing rules. A physical technical site survey by SK SOLAR WALA engineers is required before final engineering proposal.'
          )}
        </p>
      </div>
    </div>
  );
};
