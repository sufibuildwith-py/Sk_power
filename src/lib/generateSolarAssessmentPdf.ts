/**
 * SK SOLAR WALA — Dedicated One-Page A4 Solar Assessment PDF Generator
 * Produces a customer-facing, professional techno-commercial rooftop solar assessment.
 * Exactly 1 A4 portrait page with zero website UI chrome.
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SolarCalculationResults, SolarCalculatorInputs } from './solarCalculator';
import { UP_DISTRICTS, DEFAULT_SOLAR_ASSUMPTIONS } from '../config/solarAssumptions';
import { SK_LOGO_BASE64 } from '../assets/logoBase64';

export interface GeneratePdfOptions {
  inputs: SolarCalculatorInputs;
  results: SolarCalculationResults;
  language: 'en' | 'hi';
  customerName?: string;
}

export async function generateSolarAssessmentPdf({
  inputs,
  results,
  language = 'en',
  customerName,
}: GeneratePdfOptions): Promise<void> {
  const isHi = language === 'hi';

  // Defensive sanitization of all numbers
  const safeCapacity = Number.isFinite(results.actualCapacityKwp) ? results.actualCapacityKwp : 0;
  const safeCost = Number.isFinite(results.costBeforeSubsidyInr) ? results.costBeforeSubsidyInr : 0;
  const safeSubsidy = Number.isFinite(results.subsidy.totalSubsidy) ? results.subsidy.totalSubsidy : 0;
  const safeNet = Number.isFinite(results.netInvestmentInr) ? results.netInvestmentInr : 0;
  const safeMonthlySavings = Number.isFinite(results.monthlySavingsInr) ? results.monthlySavingsInr : 0;
  const safeAnnualSavings = Number.isFinite(results.annualSavingsInr) ? results.annualSavingsInr : 0;
  const safe25YrSavings = Number.isFinite(results.lifetime25YearSavingsInr) ? results.lifetime25YearSavingsInr : 0;
  const safeDailyGen = Number.isFinite(results.dailyGenerationKwh) ? results.dailyGenerationKwh : 0;
  const safeMonthlyGen = Number.isFinite(results.monthlyGenerationKwh) ? results.monthlyGenerationKwh : 0;
  const safeAnnualGen = Number.isFinite(results.annualGenerationKwh) ? results.annualGenerationKwh : 0;
  const safeRoofReq = Number.isFinite(results.roofAreaRequiredSqFt) ? results.roofAreaRequiredSqFt : 0;
  const safeConsumption = Number.isFinite(results.effectiveMonthlyUnits) ? results.effectiveMonthlyUnits : 0;
  const safeSelfConsumed = Number.isFinite(results.selfConsumedUnitsMonthly) ? results.selfConsumedUnitsMonthly : 0;
  const safeGridImport = Number.isFinite(results.gridImportUnitsMonthly) ? results.gridImportUnitsMonthly : 0;
  const safeExported = Number.isFinite(results.exportedUnitsMonthly) ? results.exportedUnitsMonthly : 0;
  const safeTariff = Number.isFinite(inputs.electricityTariff) ? inputs.electricityTariff : 7.5;
  const safePaybackYears = results.simplePaybackYears ?? 'N/A';
  const safeRoi = results.roi25YearPercent ? `${results.roi25YearPercent}%` : 'N/A';

  const district = UP_DISTRICTS.find((d) => d.id === inputs.districtId);
  const districtName = isHi ? (district?.nameHi || 'वाराणसी') : (district?.nameEn || 'Varanasi');
  const districtNameSafe = district?.nameEn || 'Varanasi';

  const categoryLabel = isHi
    ? inputs.category === 'residential'
      ? 'आवासीय'
      : inputs.category === 'commercial'
      ? 'वाणिज्यिक'
      : 'औद्योगिक'
    : inputs.category.charAt(0).toUpperCase() + inputs.category.slice(1);

  const systemTypeLabel = isHi
    ? inputs.systemType === 'hybrid'
      ? 'हाइब्रिड (बैटरी स्टोरेज)'
      : inputs.systemType === 'offgrid'
      ? 'ऑफ-ग्रिड स्वायत्त'
      : 'ऑन-ग्रिड नेट-मीटर्ड'
    : inputs.systemType === 'hybrid'
    ? 'On-Grid Hybrid with Battery Storage'
    : inputs.systemType === 'offgrid'
    ? 'Off-Grid Standalone System'
    : 'On-Grid Net-Metered';

  const now = new Date();
  const dateFormatted = now.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const dateIso = now.toISOString().split('T')[0];
  const refId = `SKW-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const fmtCurrency = (val: number): string => '₹' + Math.round(val).toLocaleString('en-IN');
  const fmtUnits = (val: number): string => Math.round(val).toLocaleString('en-IN');

  const monthLabelsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabelsHi = ['जन', 'फ़र', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुला', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'];
  const monthLabels = isHi ? monthLabelsHi : monthLabelsEn;

  const monthlyBreakdown = results.monthlyGenerationBreakdown || DEFAULT_SOLAR_ASSUMPTIONS.monthlyYieldDistribution.map(
    (f) => Math.round(f * safeAnnualGen)
  );
  const maxMonthlyGen = Math.max(...monthlyBreakdown, 1);

  // Build the generation bars HTML
  const chartBarsHtml = monthlyBreakdown
    .map((units, idx) => {
      const heightPercent = Math.max(12, Math.round((units / maxMonthlyGen) * 100));
      const isPeak = idx >= 2 && idx <= 4;
      const barColor = isPeak ? '#E9AD59' : '#0D9488';

      return `
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%;">
          <span style="font-size: 7.5px; font-family: monospace; color: #4B5563; margin-bottom: 2px;">${units}</span>
          <div style="width: 100%; max-width: 18px; height: ${heightPercent}%; background-color: ${barColor}; border-radius: 2px 2px 0 0;"></div>
          <span style="font-size: 8px; color: #6B7280; margin-top: 3px; font-weight: 500;">${monthLabels[idx]}</span>
        </div>
      `;
    })
    .join('');

  // Off-screen A4 Container (Strict 210mm x 297mm at 96 DPI: 794px x 1123px)
  const container = document.createElement('div');
  container.id = 'solar-pdf-a4-render-canvas';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '794px';
  container.style.height = '1123px';
  container.style.boxSizing = 'border-box';
  container.style.padding = '24px 32px 20px 32px';
  container.style.backgroundColor = '#FAF9F5';
  container.style.color = '#1E293B';
  container.style.fontFamily = `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Devanagari', sans-serif`;
  container.style.lineHeight = '1.35';
  container.style.zIndex = '-9999';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box;">
      
      <!-- ================= HEADER SECTION ================= -->
      <div style="border-bottom: 2px solid #E2E8F0; padding-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <!-- Top Left: Logo & Company -->
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${SK_LOGO_BASE64}" alt="SK SOLAR WALA Logo" style="width: 44px; height: 44px; object-fit: contain; border-radius: 8px; border: 1px solid #E2E8F0; background: #ffffff; padding: 2px;" />
            <div>
              <div style="font-size: 19px; font-weight: 800; color: #0F172A; letter-spacing: -0.02em;">
                SK SOLAR WALA
              </div>
              <div style="font-size: 9px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">
                ${isHi ? 'सोलर टेक्नोलॉजी · डिस्ट्रीब्यूशन · ईपीसी इंस्टॉलेशन' : 'Solar Technology · Distribution · EPC Installation'}
              </div>
              <div style="font-size: 8.5px; color: #64748B;">
                ${isHi ? 'वाराणसी एवं उत्तर प्रदेश · आधिकारिक मूल्यांकन' : 'Varanasi & Uttar Pradesh · Verified Assessment'}
              </div>
            </div>
          </div>

          <!-- Top Right: Document Title & Meta -->
          <div style="text-align: right;">
            <div style="font-size: 13px; font-weight: 800; color: #0F172A; letter-spacing: 0.04em;">
              ${isHi ? 'रूफटॉप सोलर तकनीकी-वाणिज्यिक मूल्यांकन' : 'ROOFTOP SOLAR TECHNO-COMMERCIAL ASSESSMENT'}
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 3px; font-size: 9px; color: #475569; font-family: monospace;">
              <span><strong>${isHi ? 'आईडी' : 'Ref'}:</strong> ${refId}</span>
              <span>•</span>
              <span><strong>${isHi ? 'दिनांक' : 'Date'}:</strong> ${dateFormatted}</span>
              <span>•</span>
              <span><strong>${isHi ? 'भाषा' : 'Lang'}:</strong> ${isHi ? 'हिन्दी' : 'English'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= CUSTOMER & SITE DETAILS STRIP ================= -->
      <div style="margin-top: 8px; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 7px 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-size: 9px;">
        ${customerName ? `
          <div>
            <span style="color: #64748B; display: block; font-size: 8px;">${isHi ? 'ग्राहक' : 'Customer'}</span>
            <strong style="color: #0F172A;">${customerName}</strong>
          </div>
        ` : ''}
        <div>
          <span style="color: #64748B; display: block; font-size: 8px;">${isHi ? 'स्थान व राज्य' : 'Location & State'}</span>
          <strong style="color: #0F172A;">${districtName}, UP</strong>
        </div>
        <div>
          <span style="color: #64748B; display: block; font-size: 8px;">${isHi ? 'उपभोक्ता श्रेणी' : 'Consumer Category'}</span>
          <strong style="color: #0F172A;">${categoryLabel}</strong>
        </div>
        <div>
          <span style="color: #64748B; display: block; font-size: 8px;">${isHi ? 'मासिक खपत व दर' : 'Consumption & Tariff'}</span>
          <strong style="color: #0F172A;">${fmtUnits(safeConsumption)} units · ₹${safeTariff.toFixed(1)}/u</strong>
        </div>
        <div>
          <span style="color: #64748B; display: block; font-size: 8px;">${isHi ? 'उपलब्ध छत व संरचना' : 'Available Roof & Type'}</span>
          <strong style="color: #0F172A;">${inputs.roofAreaSqFt || 500} sq ft (${inputs.roofType === 'rcc' ? 'RCC' : 'Metal'})</strong>
        </div>
      </div>

      <!-- ================= RECOMMENDED SOLAR SYSTEM (FOCAL POINT) ================= -->
      <div style="margin-top: 8px; background: #0B192C; color: #ffffff; border-radius: 10px; padding: 12px 16px; display: grid; grid-template-columns: 1.2fr 2fr; gap: 14px; align-items: center;">
        <div style="border-right: 1px solid rgba(255, 255, 255, 0.15); padding-right: 12px;">
          <div style="font-size: 9px; font-weight: 700; color: #34D399; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
            ${isHi ? 'अनुशंसित सिस्टम क्षमता' : 'RECOMMENDED SYSTEM CAPACITY'}
          </div>
          <div style="display: flex; align-items: baseline; gap: 4px;">
            <span style="font-size: 34px; font-weight: 800; font-family: monospace; color: #6EE7B7; line-height: 1;">
              ${safeCapacity.toFixed(2)}
            </span>
            <span style="font-size: 15px; font-weight: 600; color: #ffffff;">kWp DC</span>
          </div>
          <div style="font-size: 8.5px; color: #CBD5E1; margin-top: 4px;">
            ${results.moduleCount} × ${results.moduleWattage}W Tier-1 PV Modules
          </div>
          <div style="font-size: 8px; color: #94A3B8;">
            ${systemTypeLabel}
          </div>
          ${results.isRoofLimited ? `
            <div style="margin-top: 4px; background: rgba(234, 179, 8, 0.2); border: 1px solid rgba(234, 179, 8, 0.4); color: #FEF08A; font-size: 7.5px; padding: 2px 6px; border-radius: 4px;">
              ${isHi ? 'छत क्षेत्र सीमित: उपलब्ध स्थान के अनुसार आकारित' : 'Roof-Constrained: Sized to fit usable roof space'}
            </div>
          ` : ''}
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.08); padding: 6px 4px; border-radius: 6px;">
            <span style="font-size: 7.5px; color: #94A3B8; display: block;">${isHi ? 'दैनिक उत्पादन' : 'Daily Gen'}</span>
            <strong style="font-size: 12px; font-family: monospace; color: #ffffff;">~${safeDailyGen.toFixed(1)}</strong>
            <span style="font-size: 7px; color: #94A3B8; display: block;">kWh / day</span>
          </div>
          <div style="background: rgba(255, 255, 255, 0.08); padding: 6px 4px; border-radius: 6px;">
            <span style="font-size: 7.5px; color: #94A3B8; display: block;">${isHi ? 'मासिक उत्पादन' : 'Monthly Gen'}</span>
            <strong style="font-size: 12px; font-family: monospace; color: #ffffff;">~${fmtUnits(safeMonthlyGen)}</strong>
            <span style="font-size: 7px; color: #94A3B8; display: block;">Units / mo</span>
          </div>
          <div style="background: rgba(255, 255, 255, 0.08); padding: 6px 4px; border-radius: 6px;">
            <span style="font-size: 7.5px; color: #94A3B8; display: block;">${isHi ? 'वार्षिक उत्पादन' : 'Annual Gen'}</span>
            <strong style="font-size: 12px; font-family: monospace; color: #34D399;">${fmtUnits(safeAnnualGen)}</strong>
            <span style="font-size: 7px; color: #94A3B8; display: block;">kWh / year</span>
          </div>
          <div style="background: rgba(255, 255, 255, 0.08); padding: 6px 4px; border-radius: 6px;">
            <span style="font-size: 7.5px; color: #94A3B8; display: block;">${isHi ? 'आवश्यक छत' : 'Roof Area'}</span>
            <strong style="font-size: 12px; font-family: monospace; color: #ffffff;">${safeRoofReq}</strong>
            <span style="font-size: 7px; color: #94A3B8; display: block;">Sq. Ft.</span>
          </div>
        </div>
      </div>

      <!-- ================= MIDDLE 2-COLUMN SECTION: ENERGY FLOW & FINANCIALS ================= -->
      <div style="margin-top: 8px; display: grid; grid-template-columns: 1fr 1.05fr; gap: 10px;">
        
        <!-- Left: Energy Generation & Consumption Flow -->
        <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 6px;">
              ${isHi ? 'ऊर्जा प्रवाह एवं 12-महीने का मौसमी प्रोफ़ाइल' : 'Energy Flow & 12-Month Seasonal Profile'}
            </div>

            <!-- Energy Balance Table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; margin-bottom: 8px;">
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 2.5px 0; color: #475569;">${isHi ? 'मासिक बिजली खपत' : 'Monthly Electricity Consumption'}</td>
                <td style="padding: 2.5px 0; text-align: right; font-weight: 700; font-family: monospace; color: #0F172A;">${fmtUnits(safeConsumption)} units</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 2.5px 0; color: #475569;">${isHi ? 'सौर ऊर्जा उत्पादन' : 'Estimated Solar Generation'}</td>
                <td style="padding: 2.5px 0; text-align: right; font-weight: 700; font-family: monospace; color: #059669;">${fmtUnits(safeMonthlyGen)} units</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 2.5px 0; color: #475569;">${isHi ? 'परिसर में प्रयुक्त सौर ऊर्जा' : 'Solar Consumed On-Site'}</td>
                <td style="padding: 2.5px 0; text-align: right; font-weight: 700; font-family: monospace; color: #047857;">${fmtUnits(safeSelfConsumed)} units</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 2.5px 0; color: #475569;">${isHi ? 'ग्रिड से शेष बिजली ख़रीद' : 'Remaining Grid Imports'}</td>
                <td style="padding: 2.5px 0; text-align: right; font-weight: 700; font-family: monospace; color: #64748B;">${fmtUnits(safeGridImport)} units</td>
              </tr>
              <tr>
                <td style="padding: 2.5px 0; color: #475569;">${isHi ? 'ग्रिड में निर्यात अधिशेष बिजली' : 'Surplus Solar Exported to Grid'}</td>
                <td style="padding: 2.5px 0; text-align: right; font-weight: 700; font-family: monospace; color: #0284C7;">${fmtUnits(safeExported)} units</td>
              </tr>
            </table>
          </div>

          <!-- Mini 12-Month Bar Chart -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 7.5px; color: #64748B; margin-bottom: 4px;">
              <span>${isHi ? '12-माह अनुमानित उत्पादन (kWh)' : '12-Month Generation Curve (kWh)'}</span>
              <span style="color: #D97706; font-weight: 600;">${isHi ? 'शीर्ष: मार्च-मई' : 'Peak: Mar-May'}</span>
            </div>
            <div style="height: 58px; display: flex; align-items: flex-end; justify-content: space-between; gap: 3px; border-bottom: 1px solid #CBD5E1; padding-bottom: 2px;">
              ${chartBarsHtml}
            </div>
          </div>
        </div>

        <!-- Right: Financial Assessment (System Cost, Subsidy, Net Outlay, Savings) -->
        <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 6px;">
              ${isHi ? 'वित्तीय विश्लेषण एवं सरकारी सहायता' : 'Financial Assessment & Assistance'}
            </div>

            <!-- Cost Progression Row -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 8px; margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; padding-bottom: 3px; border-bottom: 1px solid #E2E8F0;">
                <span style="color: #475569;">${isHi ? 'अनुमानित टर्नकी प्लांट लागत' : 'Estimated Turnkey Plant Cost'}</span>
                <strong style="font-family: monospace; font-size: 10px; color: #0F172A;">${fmtCurrency(safeCost)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; padding: 3px 0; border-bottom: 1px solid #E2E8F0; color: #059669;">
                <span>${isHi ? 'अनुमानित पात्र सहायता (पीएम सूर्य घर + यूपी राज्य)' : 'Estimated Eligible Assistance (PM Surya Ghar + UP)'}</span>
                <strong style="font-family: monospace; font-size: 10px;">${safeSubsidy > 0 ? '-' + fmtCurrency(safeSubsidy) : '₹0'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; padding-top: 3px;">
                <span style="font-weight: 700; color: #0F172A;">${isHi ? 'शुद्ध अनुमानित ग्राहक निवेश' : 'Estimated Net Customer Investment'}</span>
                <strong style="font-family: monospace; font-size: 12px; color: #0F172A;">${fmtCurrency(safeNet)}</strong>
              </div>
            </div>

            <!-- Subsidy qualification caveat -->
            <div style="font-size: 7.5px; color: #64748B; line-height: 1.25; margin-bottom: 8px;">
              *${isHi ? 'सब्सिडी वर्तमान योजना नियमों, उपभोक्ता पात्रता, स्वीकृत क्षमता व डिस्कॉम सत्यापन के अधीन है।' : 'Subject to current scheme rules, consumer eligibility, approved system capacity, DISCOM requirements and successful commissioning.'}
            </div>
          </div>

          <!-- Key Financial Returns Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
            <div style="background: #F1F5F9; border-radius: 6px; padding: 6px 4px; text-align: center;">
              <span style="font-size: 7.5px; color: #475569; display: block;">${isHi ? 'मासिक बचत' : 'Monthly Savings'}</span>
              <strong style="font-size: 11px; font-family: monospace; color: #0F172A;">${fmtCurrency(safeMonthlySavings)}</strong>
            </div>
            <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 6px; padding: 6px 4px; text-align: center;">
              <span style="font-size: 7.5px; color: #065F46; font-weight: 600; display: block;">${isHi ? 'प्रथम वर्ष बचत' : 'Year 1 Savings'}</span>
              <strong style="font-size: 11.5px; font-family: monospace; color: #047857;">${fmtCurrency(safeAnnualSavings)}</strong>
            </div>
            <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 6px; padding: 6px 4px; text-align: center;">
              <span style="font-size: 7.5px; color: #92400E; font-weight: 600; display: block;">${isHi ? 'पेबैक अवधि' : 'Simple Payback'}</span>
              <strong style="font-size: 11px; font-family: monospace; color: #78350F;">~${safePaybackYears} ${isHi ? 'वर्ष' : 'Yrs'}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= LOWER 2-COLUMN SECTION: EQUIPMENT BOM & 25-YR OUTLOOK ================= -->
      <div style="margin-top: 8px; display: grid; grid-template-columns: 1fr 1.05fr; gap: 10px;">
        
        <!-- Left: Verified Equipment Bill of Materials -->
        <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 9px 12px;">
          <div style="font-size: 9.5px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 5px;">
            ${isHi ? 'प्रस्तावित उपकरण एवं स्थापना कार्यक्षेत्र' : 'Proposed Equipment & Installation Scope'}
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 4px; font-size: 8px;">
            <div style="border-left: 2.5px solid #0D9488; padding-left: 6px;">
              <strong style="color: #0F172A;">${isHi ? 'सौर पीवी मॉड्यूल' : 'PV Modules'}:</strong>
              <span style="color: #475569;">${results.equipment.panels}</span>
            </div>
            <div style="border-left: 2.5px solid #0D9488; padding-left: 6px;">
              <strong style="color: #0F172A;">${isHi ? 'सोलर इन्वर्टर' : 'Power Inverter'}:</strong>
              <span style="color: #475569;">${results.equipment.inverter}</span>
            </div>
            <div style="border-left: 2.5px solid #0D9488; padding-left: 6px;">
              <strong style="color: #0F172A;">${isHi ? 'माउंटिंग स्ट्रक्चर' : 'Mounting Structure'}:</strong>
              <span style="color: #475569;">${results.equipment.structure}</span>
            </div>
            <div style="border-left: 2.5px solid #0D9488; padding-left: 6px;">
              <strong style="color: #0F172A;">${isHi ? 'सुरक्षा एवं वितरण' : 'BOS & Protection'}:</strong>
              <span style="color: #475569;">${results.equipment.balanceOfSystem}</span>
            </div>
            <div style="border-left: 2.5px solid #0D9488; padding-left: 6px;">
              <strong style="color: #0F172A;">${isHi ? 'स्थापना एवं परीक्षण' : 'Installation Scope'}:</strong>
              <span style="color: #475569;">${isHi ? 'पूर्ण टर्नकी सिविल, इलेक्ट्रिकल, अर्थिंग एवं नेट-मीटरिंग डिस्कॉम समन्वय' : 'Turnkey civil anchoring, electrical cabling, earthing pits & DISCOM net-metering liaison.'}</span>
            </div>
          </div>
        </div>

        <!-- Right: 25-Year Outlook & Environmental Offsets -->
        <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 9px 12px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 9.5px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 5px;">
              ${isHi ? '25-वर्षीय वित्तीय परिदृश्य एवं पर्यावरण लाभ' : '25-Year Financial Outlook & Environmental Offsets'}
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; font-size: 8.5px; margin-bottom: 6px;">
              <div style="background: #F8FAFC; padding: 4px 6px; border-radius: 4px;">
                <span style="color: #64748B; font-size: 7.5px; display: block;">${isHi ? '25-वर्षीय संचयी बचत' : '25-Yr Cumulative Savings'}</span>
                <strong style="color: #0F172A; font-family: monospace;">${fmtCurrency(safe25YrSavings)}</strong>
              </div>
              <div style="background: #F8FAFC; padding: 4px 6px; border-radius: 4px;">
                <span style="color: #64748B; font-size: 7.5px; display: block;">${isHi ? '25-वर्षीय आरओआई' : '25-Yr Return on Inv.'}</span>
                <strong style="color: #059669; font-family: monospace;">${safeRoi}</strong>
              </div>
              <div style="background: #F0FDF4; padding: 4px 6px; border-radius: 4px;">
                <span style="color: #166534; font-size: 7.5px; display: block;">${isHi ? 'वार्षिक CO₂ कटौती' : 'Annual CO₂ Mitigated'}</span>
                <strong style="color: #15803D; font-family: monospace;">~${fmtUnits(results.annualCo2AvoidedKg)} kg/yr</strong>
              </div>
              <div style="background: #F0FDF4; padding: 4px 6px; border-radius: 4px;">
                <span style="color: #166534; font-size: 7.5px; display: block;">${isHi ? 'लगाए गए वृक्षों के बराबर' : 'Equivalent Trees Planted'}</span>
                <strong style="color: #15803D; font-family: monospace;">~${results.equivalentTreesPlanted} trees</strong>
              </div>
            </div>
          </div>

          <div style="font-size: 7px; color: #64748B; line-height: 1.25; background: #F8FAFC; padding: 4px 6px; border-radius: 4px;">
            ${isHi ? 'दीर्घकालिक अनुमान परिदृश्य आधारित हैं, गारंटीकृत नहीं। वास्तविक रिटर्न टैरिफ परिवर्तन, उपकरण रखरखाव व उत्पादन पर निर्भर करता है।' : 'Long-term projections are scenario estimates, not guaranteed returns. Actual results depend on generation, tariff changes, self-consumption, export settlement, equipment performance and maintenance.'}
          </div>
        </div>
      </div>

      <!-- ================= ASSUMPTIONS & TECHNICAL DISCLAIMER ================= -->
      <div style="margin-top: 8px; background: #ffffff; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 12px; font-size: 7.8px; color: #475569;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 4px; margin-bottom: 4px;">
          <strong style="color: #0F172A; text-transform: uppercase; font-size: 8px;">
            ${isHi ? 'अभियांत्रिकी गणना आधार' : 'Engineering Assumptions Used'}
          </strong>
          <span style="color: #64748B;">
            ${isHi ? 'विशिष्ट उत्पादन: 1,450 kWh/kWp/वर्ष (पूर्वी उप्र) · मॉड्यूल क्षरण: 0.6%/वर्ष · टैरिफ वृद्धि: 3.0%/वर्ष' : 'Yield: 1,450 kWh/kWp/yr (Eastern UP) · Degradation: 0.6%/yr · Tariff Rise: 3.0%/yr · Net Export: ₹3.75/kWh'}
          </span>
        </div>
        <p style="margin: 0; line-height: 1.35; color: #64748B;">
          <strong>${isHi ? 'अस्वीकरण' : 'Disclaimer'}:</strong> ${isHi
            ? 'यह रिपोर्ट प्रस्तुत जानकारी एवं ऊपर उल्लिखित मान्यताओं पर आधारित एक सांकेतिक योजना मूल्यांकन है। वास्तविक उत्पादन, बचत, सब्सिडी पात्रता एवं परियोजना लागत भौतिक साइट निरीक्षण, संरचनात्मक मजबूती, उपकरण चयन, लागू सरकारी योजना नियमों, डिस्कॉम अनुमोदन एवं अंतिम वाणिज्यिक कोटेशन के अधीन हैं। यह दस्तावेज़ कोई पुष्ट स्थापना आदेश या सब्सिडी स्वीकृति नहीं है।'
            : 'This report is an indicative planning assessment based on the information supplied and the assumptions stated above. Actual generation, savings, subsidy eligibility and project cost are subject to physical site inspection, structural assessment, equipment selection, applicable government scheme rules, DISCOM approval and final commercial quotation. This document is not a confirmed installation order or subsidy approval.'}
        </p>
      </div>

      <!-- ================= FOOTER — NEXT STEP & PREPARED BY ================= -->
      <div style="margin-top: 8px; border-top: 1px solid #E2E8F0; padding-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 8.5px;">
        <div>
          <strong style="color: #0F172A;">${isHi ? 'SK SOLAR WALA द्वारा तैयार' : 'Prepared by SK SOLAR WALA'}</strong>
          <span style="color: #64748B; margin-left: 6px;">${isHi ? 'अंतिम तकनीकी-वाणिज्यिक प्रस्ताव हेतु हमारी टीम के साथ ऑन-साइट रूफटॉप सर्वे शेड्यूल करें।' : 'For a final technical & commercial proposal, schedule a rooftop feasibility survey with our team.'}</span>
        </div>
        <div style="color: #0F172A; font-weight: 600; font-family: monospace;">
          Varanasi · Uttar Pradesh
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    // Render high-resolution canvas (scale: 2 for clean 200+ DPI print vector reproduction)
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FAF9F5',
      logging: false,
      windowWidth: 794,
      windowHeight: 1123,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    // Create 1-page A4 Portrait PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // 210mm x 297mm exact fit
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

    // Formulate clean, informative filename
    const filename = `SK-SOLAR-WALA-Solar-Assessment-${districtNameSafe}-${dateIso}.pdf`;
    pdf.save(filename);
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
