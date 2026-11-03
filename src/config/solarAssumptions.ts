/**
 * SK SOLAR WALA — Solar Engineering Assumptions & Defaults
 * Focused strictly on Uttar Pradesh (Varanasi and surrounding districts).
 * All technical assumptions are centralized here for transparency and configurability.
 */

export interface UPDistrictInfo {
  id: string;
  nameEn: string;
  nameHi: string;
  isPrimary: boolean;
}

export interface SolarAssumptions {
  // Annual specific yield: kWh generated per installed kWp per year
  // In Varanasi & Eastern UP, specific yield averages 1,400–1,500 kWh/kWp/year (~4.0 peak sun hours/day)
  specificYieldKwhPerKwpYear: number;

  // Monthly yield distribution percentages across 12 calendar months (Jan to Dec, summing to 100%)
  // Refined for UP: higher in summer (Mar-May), moderate in monsoon (Jul-Aug) & winter fog (Dec-Jan)
  monthlyYieldDistribution: number[];

  // Usable shadow-free rooftop space required per kWp (sq ft & sq metres)
  // For modern high-efficiency mono-PERC/TOPCon modules with maintenance walkways
  roofAreaPerKwpSqFt: number;
  roofAreaPerKwpSqM: number;

  // Panel degradation assumption: 0.6% annual degradation (standard Tier-1 warranty)
  annualDegradationRate: number;

  // Annual electricity tariff inflation rate for 25-year financial projections
  annualTariffEscalationRate: number;

  // Self-consumption ratio by customer category (fraction consumed directly on-site)
  selfConsumptionRatio: {
    residential: number; // 65% consumed directly during daytime / load matching
    commercial: number;  // 85% daytime operations match solar generation curve
    industrial: number;  // 90% heavy daytime factory load
  };

  // Surplus solar export rate (net feed-in rate / APPC credit under UPPCL regulations) in ₹/kWh
  gridExportTariff: number;

  // Indicative turnkey project cost per kWp before subsidy (₹/kWp)
  indicativeCostPerKwp: {
    residentialSmall: number; // 1 - 3 kWp
    residentialMedium: number; // 3 - 10 kWp
    residentialLarge: number; // > 10 kWp
    commercial: number;
    industrial: number;
    hybridAddonPerKwp: number; // Inverter + battery storage premium
  };

  // Environmental conversion benchmarks (Source: Central Electricity Authority India & MoEFCC)
  gridEmissionFactorKgPerKwh: number; // 0.82 kg CO2 avoided per kWh
  treesPerTonCo2PerYear: number; // ~20 kg CO2 absorbed per tree per year (50 trees per ton)
}

export const UP_DISTRICTS: UPDistrictInfo[] = [
  { id: 'varanasi', nameEn: 'Varanasi', nameHi: 'वाराणसी', isPrimary: true },
  { id: 'chandauli', nameEn: 'Chandauli', nameHi: 'चंदौली', isPrimary: true },
  { id: 'mirzapur', nameEn: 'Mirzapur', nameHi: 'मिर्ज़ापुर', isPrimary: true },
  { id: 'jaunpur', nameEn: 'Jaunpur', nameHi: 'जौनपुर', isPrimary: true },
  { id: 'ghazipur', nameEn: 'Ghazipur', nameHi: 'गाज़ीपुर', isPrimary: true },
  { id: 'bhadohi', nameEn: 'Bhadohi', nameHi: 'भदोही', isPrimary: true },
  { id: 'azamgarh', nameEn: 'Azamgarh', nameHi: 'आज़मगढ़', isPrimary: true },
  { id: 'sonbhadra', nameEn: 'Sonbhadra', nameHi: 'सोनभद्र', isPrimary: false },
  { id: 'mau', nameEn: 'Mau', nameHi: 'मऊ', isPrimary: false },
  { id: 'ballia', nameEn: 'Ballia', nameHi: 'बलिया', isPrimary: false },
  { id: 'prayagraj', nameEn: 'Prayagraj', nameHi: 'प्रयागराज', isPrimary: false },
  { id: 'gorakhpur', nameEn: 'Gorakhpur', nameHi: 'गोरखपुर', isPrimary: false },
  { id: 'lucknow', nameEn: 'Lucknow', nameHi: 'लखनऊ', isPrimary: false },
  { id: 'other_up', nameEn: 'Other Uttar Pradesh District', nameHi: 'अन्य उत्तर प्रदेश ज़िला', isPrimary: false },
];

export const DEFAULT_SOLAR_ASSUMPTIONS: SolarAssumptions = {
  // Eastern UP illustrative planning yield: 1,450 units/kWp/year (~3.97 units/kWp/day)
  specificYieldKwhPerKwpYear: 1450,

  // 12 months % distribution summing to 1.0 (Jan to Dec)
  monthlyYieldDistribution: [
    0.072, // Jan (winter sun / morning fog)
    0.081, // Feb (clearing skies)
    0.098, // Mar (high insolation)
    0.106, // Apr (peak irradiance)
    0.108, // May (peak irradiance)
    0.092, // Jun (pre-monsoon clouds)
    0.071, // Jul (monsoon cloud cover)
    0.070, // Aug (monsoon cloud cover)
    0.079, // Sep (retreating monsoon)
    0.086, // Oct (clear autumn skies)
    0.076, // Nov (shorter days)
    0.061, // Dec (winter fog / shortest days)
  ],

  // Usable area: 90 sq ft (8.36 sq m) per kWp
  roofAreaPerKwpSqFt: 90,
  roofAreaPerKwpSqM: 8.36,

  // 0.6% annual module degradation
  annualDegradationRate: 0.006,

  // 3.0% annual electricity tariff escalation
  annualTariffEscalationRate: 0.03,

  // Daytime self-consumption fractions
  selfConsumptionRatio: {
    residential: 0.65,
    commercial: 0.85,
    industrial: 0.90,
  },

  // Surplus grid export credit under net-metering: ₹3.75/kWh
  gridExportTariff: 3.75,

  // Indicative turnkey costs in ₹/kWp (before subsidies)
  indicativeCostPerKwp: {
    residentialSmall: 62000, // 1–3 kWp
    residentialMedium: 56000, // 3–10 kWp
    residentialLarge: 52000, // >10 kWp
    commercial: 48000,
    industrial: 44000,
    hybridAddonPerKwp: 22000,
  },

  // Environmental impact benchmarks
  gridEmissionFactorKgPerKwh: 0.82,
  treesPerTonCo2PerYear: 50,
};

/**
 * Current Verified PM Surya Ghar: Muft Bijli Yojana Central Subsidy Structure
 * + UP State Solar Policy Top-up Subsidy
 * ONLY APPLICABLE TO RESIDENTIAL CONSUMERS IN UTTAR PRADESH
 */
export interface SubsidyBreakdown {
  isEligible: boolean;
  centralCfa: number;
  stateTopup: number;
  totalSubsidy: number;
  schemeName: string;
  caveatNoteEn: string;
  caveatNoteHi: string;
}

export function calculatePMSuryaGharSubsidy(
  category: 'residential' | 'commercial' | 'industrial',
  capacityKwp: number
): SubsidyBreakdown {
  if (category !== 'residential' || capacityKwp <= 0) {
    return {
      isEligible: false,
      centralCfa: 0,
      stateTopup: 0,
      totalSubsidy: 0,
      schemeName: 'PM Surya Ghar: Muft Bijli Yojana',
      caveatNoteEn: 'Commercial and industrial installations are not eligible for residential rooftop subsidies. Accelerated Depreciation (AD) and standard GST input credits may apply.',
      caveatNoteHi: 'व्यावसायिक एवं औद्योगिक उपभोक्ता पीएम सूर्य घर आवासीय सब्सिडी के लिए पात्र नहीं हैं। वाणिज्यिक कर लाभ एवं त्वरित मूल्यह्रास (AD) लाभ लागू हो सकते हैं।',
    };
  }

  // Central CFA rules (General States including Uttar Pradesh):
  // 1 kW: ₹30,000
  // 2 kW: ₹60,000
  // 3 kW or higher: ₹78,000 (capped at 3 kW for individual residential connections)
  let centralCfa = 0;
  if (capacityKwp < 1) {
    centralCfa = Math.round(capacityKwp * 30000);
  } else if (capacityKwp < 2) {
    centralCfa = 30000 + Math.round((capacityKwp - 1) * 30000);
  } else if (capacityKwp < 3) {
    centralCfa = 60000 + Math.round((capacityKwp - 2) * 18000);
  } else {
    centralCfa = 78000;
  }

  // Uttar Pradesh State Solar Policy Additional Top-up Subsidy:
  // UP provides up to ₹15,000 per kW (up to max ₹30,000 for 2kW and above)
  let stateTopup = 0;
  if (capacityKwp >= 2) {
    stateTopup = 30000;
  } else if (capacityKwp >= 1) {
    stateTopup = 15000;
  } else {
    stateTopup = Math.round(capacityKwp * 15000);
  }

  const totalSubsidy = centralCfa + stateTopup;

  return {
    isEligible: true,
    centralCfa,
    stateTopup,
    totalSubsidy,
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana + UP State Solar Assistance',
    caveatNoteEn: 'Subsidy amount is an indicative estimate based on current central MNRE CFA and UP state guidelines. Final disbursement is credited via Direct Benefit Transfer (DBT) post-commissioning and DISCOM net-meter inspection.',
    caveatNoteHi: 'सब्सिडी राशि वर्तमान एमएनआरई (MNRE) एवं यूपी राज्य नीति के अनुसार सांकेतिक अनुमान है। वास्तविक राशि नेट-मीटर स्थापना एवं डिस्कॉम निरीक्षण के उपरांत डीबीटी (DBT) द्वारा बैंक खाते में जमा होती है।',
  };
}
