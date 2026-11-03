/**
 * SK SOLAR WALA — Comprehensive Solar Engineering Calculation Engine
 * Pure mathematical functions decoupled from UI rendering.
 */

import {
  SolarAssumptions,
  DEFAULT_SOLAR_ASSUMPTIONS,
  calculatePMSuryaGharSubsidy,
  SubsidyBreakdown,
} from '../config/solarAssumptions';

export type CalculationMode = 'bill' | 'consumption' | 'area';
export type CustomerCategory = 'residential' | 'commercial' | 'industrial';
export type RoofType = 'rcc' | 'metal_sheet' | 'tiled' | 'other';
export type RoofOrientation = 'south' | 'east' | 'west' | 'north' | 'mixed' | 'unsure';
export type ShadingLevel = 'low' | 'moderate' | 'high' | 'unsure';
export type SystemType = 'ongrid' | 'hybrid' | 'offgrid';

export interface SolarCalculatorInputs {
  mode: CalculationMode;

  // Step 1: Primary input values
  monthlyBill: number; // ₹
  monthlyUnits: number; // kWh
  roofAreaSqFt: number; // sq ft
  roofAreaUnit?: 'sqft' | 'sqm';
  roofLengthFt?: number;
  roofWidthFt?: number;
  roofUsablePercentage?: number;

  // Step 2: Location & Customer
  districtId: string;
  category: CustomerCategory;

  // Step 3: Tariff details
  electricityTariff: number; // ₹/kWh
  fixedChargesMonthly?: number; // ₹
  sanctionedLoadKw?: number;

  // Step 4: Roof specifics
  roofType?: RoofType;
  roofOrientation?: RoofOrientation;
  shadingLevel?: ShadingLevel;

  // Step 5: System preferences
  targetOffsetRatio: number; // 0.5 to 1.0 (50% to 100%)
  moduleWattage: number; // 450, 500, 550 W
  systemType: SystemType;
  hasBatteryBackup?: boolean;
  customCostPerKwp?: number;
}

export interface YearProjection {
  year: number;
  annualGenerationKwh: number;
  annualSavingsInr: number;
  cumulativeSavingsInr: number;
  netCashflowInr: number; // cumulativeSavings - netInvestment
}

export interface SolarCalculationResults {
  // Baseline consumption & input resolution
  effectiveMonthlyUnits: number;
  effectiveMonthlyBill: number;
  calculationMethod: CalculationMode;

  // System Sizing
  recommendedCapacityKwp: number;
  actualCapacityKwp: number;
  moduleCount: number;
  moduleWattage: number;
  systemType: SystemType;

  // Rooftop requirements & fit
  roofAreaRequiredSqFt: number;
  roofAreaRequiredSqM: number;
  availableRoofAreaSqFt: number | null;
  fitsOnRoof: boolean;
  isRoofLimited: boolean;
  roofCapacityLimitKwp: number | null;

  // Energy Generation
  dailyGenerationKwh: number;
  monthlyGenerationKwh: number;
  annualGenerationKwh: number;
  lifetime25YearGenerationKwh: number;
  monthlyGenerationBreakdown: number[]; // 12 calendar months

  // Energy Flows
  selfConsumedUnitsMonthly: number;
  gridImportUnitsMonthly: number;
  exportedUnitsMonthly: number;

  // Financial Breakdown
  monthlySavingsInr: number;
  annualSavingsInr: number;
  lifetime25YearSavingsInr: number;

  // Investment & Subsidy
  costPerKwpInr: number;
  costBeforeSubsidyInr: number;
  subsidy: SubsidyBreakdown;
  netInvestmentInr: number;
  simplePaybackYears: number | null;
  roi25YearPercent: number | null;
  projectionTable: YearProjection[];

  // Environmental Impact
  annualCo2AvoidedKg: number;
  lifetimeCo2AvoidedTonnes: number;
  equivalentTreesPlanted: number;

  // Equipment Specifications
  equipment: {
    panels: string;
    inverter: string;
    structure: string;
    balanceOfSystem: string;
    battery?: string;
  };
}

/**
 * Derives monthly units consumed from a rupee electricity bill and tariff.
 */
export function estimateUnitsFromBill(
  monthlyBill: number,
  tariff: number,
  fixedCharges: number = 0
): number {
  if (tariff <= 0 || monthlyBill <= 0) return 0;
  const energyCost = Math.max(0, monthlyBill - fixedCharges);
  return Math.round(energyCost / tariff);
}

/**
 * Calculates usable square footage from length, width and usability factor.
 */
export function calculateRoofAreaHelper(
  lengthFt: number,
  widthFt: number,
  usablePercentage: number = 80
): number {
  if (lengthFt <= 0 || widthFt <= 0) return 0;
  const total = lengthFt * widthFt;
  const usableFraction = Math.max(0, Math.min(100, usablePercentage)) / 100;
  return Math.round(total * usableFraction);
}

/**
 * Main calculation engine solving capacity, generation, savings and investment.
 */
export function calculateSolarSystem(
  inputs: SolarCalculatorInputs,
  assumptions: SolarAssumptions = DEFAULT_SOLAR_ASSUMPTIONS
): SolarCalculationResults {
  const tariff = Math.max(0.1, inputs.electricityTariff || (inputs.category === 'residential' ? 7.5 : 8.5));
  const fixedCharges = Math.max(0, inputs.fixedChargesMonthly || 0);

  // 1. Resolve Effective Monthly Units
  let effectiveMonthlyUnits = 0;
  let effectiveMonthlyBill = 0;

  if (inputs.mode === 'consumption') {
    effectiveMonthlyUnits = Math.max(0, inputs.monthlyUnits || 0);
    effectiveMonthlyBill = Math.round(effectiveMonthlyUnits * tariff + fixedCharges);
  } else if (inputs.mode === 'bill') {
    effectiveMonthlyBill = Math.max(0, inputs.monthlyBill || 0);
    effectiveMonthlyUnits = estimateUnitsFromBill(effectiveMonthlyBill, tariff, fixedCharges);
  } else if (inputs.mode === 'area') {
    const rawArea = inputs.roofAreaUnit === 'sqm'
      ? (inputs.roofAreaSqFt || 0) * 10.7639
      : (inputs.roofAreaSqFt || 0);
    const maxKwpFromRoof = rawArea > 0 ? rawArea / assumptions.roofAreaPerKwpSqFt : 0;

    if (inputs.monthlyUnits && inputs.monthlyUnits > 0) {
      effectiveMonthlyUnits = inputs.monthlyUnits;
    } else {
      effectiveMonthlyUnits = Math.round((maxKwpFromRoof * assumptions.specificYieldKwhPerKwpYear) / 12);
    }
    effectiveMonthlyBill = Math.round(effectiveMonthlyUnits * tariff + fixedCharges);
  }

  // 2. Capacity Sizing from Consumption & Target Offset
  const targetOffset = Math.max(0.2, Math.min(1.0, inputs.targetOffsetRatio || 1.0));
  const annualConsumption = effectiveMonthlyUnits * 12;

  // Required kWp = Annual Consumption * Offset / Specific Yield
  const consumptionBasedCapacity = (annualConsumption * targetOffset) / assumptions.specificYieldKwhPerKwpYear;

  // 3. Roof Area Constraint (if area is specified or mode is 'area')
  let availableRoofAreaSqFt: number | null = null;
  let roofCapacityLimitKwp: number | null = null;
  let isRoofLimited = false;

  if (inputs.roofAreaSqFt && inputs.roofAreaSqFt > 0) {
    availableRoofAreaSqFt = inputs.roofAreaUnit === 'sqm'
      ? inputs.roofAreaSqFt * 10.7639
      : inputs.roofAreaSqFt;
    roofCapacityLimitKwp = availableRoofAreaSqFt / assumptions.roofAreaPerKwpSqFt;
  }

  let recommendedCapacityKwp = consumptionBasedCapacity;
  if (inputs.mode === 'area' && roofCapacityLimitKwp !== null && roofCapacityLimitKwp > 0) {
    // In area mode, customer primarily sizes by their available roof
    recommendedCapacityKwp = roofCapacityLimitKwp;
  } else if (roofCapacityLimitKwp !== null && roofCapacityLimitKwp > 0) {
    if (recommendedCapacityKwp > roofCapacityLimitKwp) {
      recommendedCapacityKwp = roofCapacityLimitKwp;
      isRoofLimited = true;
    }
  }

  // Minimum realistic solar plant size is 1 kWp if user has consumption
  if (recommendedCapacityKwp < 1 && effectiveMonthlyUnits > 0) {
    recommendedCapacityKwp = 1;
  } else if (effectiveMonthlyUnits === 0 && (!availableRoofAreaSqFt || availableRoofAreaSqFt === 0)) {
    recommendedCapacityKwp = 0;
  }

  // Round capacity to 2 decimal places
  recommendedCapacityKwp = Math.round(recommendedCapacityKwp * 100) / 100;

  // 4. Panel Count & Actual Installed DC Capacity
  const moduleWattage = inputs.moduleWattage || 550;
  const moduleCount = recommendedCapacityKwp > 0
    ? Math.ceil((recommendedCapacityKwp * 1000) / moduleWattage)
    : 0;
  const actualCapacityKwp = Math.round(((moduleCount * moduleWattage) / 1000) * 100) / 100;

  // 5. Roof Area Required
  const roofAreaRequiredSqFt = Math.round(actualCapacityKwp * assumptions.roofAreaPerKwpSqFt);
  const roofAreaRequiredSqM = Math.round(actualCapacityKwp * assumptions.roofAreaPerKwpSqM * 10) / 10;
  const fitsOnRoof = availableRoofAreaSqFt !== null
    ? availableRoofAreaSqFt >= roofAreaRequiredSqFt
    : true;

  // 6. Electricity Generation
  const annualGenerationKwh = Math.round(actualCapacityKwp * assumptions.specificYieldKwhPerKwpYear);
  const dailyGenerationKwh = Math.round((annualGenerationKwh / 365) * 10) / 10;
  const monthlyGenerationKwh = Math.round(annualGenerationKwh / 12);

  // 12-month calendar generation breakdown
  const monthlyGenerationBreakdown = assumptions.monthlyYieldDistribution.map((ratio) =>
    Math.round(annualGenerationKwh * ratio)
  );

  // 7. Energy Flows: Direct Self-Consumption & Grid Export
  const selfConsumptionRate = assumptions.selfConsumptionRatio[inputs.category] || 0.65;
  const potentialSelfConsumption = monthlyGenerationKwh * selfConsumptionRate;

  // Self-consumed cannot exceed customer's consumption or generated solar
  const selfConsumedUnitsMonthly = Math.round(
    Math.min(potentialSelfConsumption, effectiveMonthlyUnits, monthlyGenerationKwh)
  );

  // Remaining grid units customer must still purchase from DISCOM
  const gridImportUnitsMonthly = Math.max(0, effectiveMonthlyUnits - selfConsumedUnitsMonthly);

  // Surplus solar fed back into the grid under net-metering
  const exportedUnitsMonthly = Math.max(0, monthlyGenerationKwh - selfConsumedUnitsMonthly);

  // 8. Financial Savings
  // Self-consumed solar directly offsets retail tariff; exported surplus earns net-feed rate
  const monthlySelfConsumptionSavings = selfConsumedUnitsMonthly * tariff;
  const monthlyExportSavings = exportedUnitsMonthly * assumptions.gridExportTariff;
  const monthlySavingsInr = Math.round(monthlySelfConsumptionSavings + monthlyExportSavings);
  const annualSavingsInr = Math.round(monthlySavingsInr * 12);

  // 9. Turnkey Cost & PM Surya Ghar Subsidy
  let costPerKwp = 56000;
  if (inputs.customCostPerKwp && inputs.customCostPerKwp > 0) {
    costPerKwp = inputs.customCostPerKwp;
  } else if (inputs.category === 'residential') {
    if (actualCapacityKwp <= 3) {
      costPerKwp = assumptions.indicativeCostPerKwp.residentialSmall;
    } else if (actualCapacityKwp <= 10) {
      costPerKwp = assumptions.indicativeCostPerKwp.residentialMedium;
    } else {
      costPerKwp = assumptions.indicativeCostPerKwp.residentialLarge;
    }
  } else if (inputs.category === 'commercial') {
    costPerKwp = assumptions.indicativeCostPerKwp.commercial;
  } else {
    costPerKwp = assumptions.indicativeCostPerKwp.industrial;
  }

  if (inputs.systemType === 'hybrid') {
    costPerKwp += assumptions.indicativeCostPerKwp.hybridAddonPerKwp;
  }

  const costBeforeSubsidyInr = Math.round(actualCapacityKwp * costPerKwp);
  const subsidy = calculatePMSuryaGharSubsidy(inputs.category, actualCapacityKwp);
  const netInvestmentInr = Math.max(0, costBeforeSubsidyInr - subsidy.totalSubsidy);

  // Payback period
  const simplePaybackYears = annualSavingsInr > 0 && netInvestmentInr > 0
    ? Math.round((netInvestmentInr / annualSavingsInr) * 10) / 10
    : null;

  // 10. 25-Year Projection with Degradation & Tariff Escalation
  let cumulativeSavings = 0;
  let lifetime25YearGenerationKwh = 0;
  const projectionTable: YearProjection[] = [];

  for (let yr = 1; yr <= 25; yr++) {
    // Annual degradation: (1 - 0.006)^(yr - 1)
    const degradationMultiplier = Math.pow(1 - assumptions.annualDegradationRate, yr - 1);
    const yrGeneration = Math.round(annualGenerationKwh * degradationMultiplier);
    lifetime25YearGenerationKwh += yrGeneration;

    // Tariff inflation: (1 + 0.03)^(yr - 1)
    const tariffMultiplier = Math.pow(1 + assumptions.annualTariffEscalationRate, yr - 1);
    const yrTariff = tariff * tariffMultiplier;
    const yrExportTariff = assumptions.gridExportTariff * tariffMultiplier;

    const yrSelfConsumed = (selfConsumedUnitsMonthly * 12) * degradationMultiplier;
    const yrExported = (exportedUnitsMonthly * 12) * degradationMultiplier;

    const yrSavings = Math.round(yrSelfConsumed * yrTariff + yrExported * yrExportTariff);
    cumulativeSavings += yrSavings;

    projectionTable.push({
      year: yr,
      annualGenerationKwh: yrGeneration,
      annualSavingsInr: yrSavings,
      cumulativeSavingsInr: cumulativeSavings,
      netCashflowInr: cumulativeSavings - netInvestmentInr,
    });
  }

  const lifetime25YearSavingsInr = cumulativeSavings;

  // 25-Year Simple ROI % = ((Cumulative Savings - Net Investment) / Net Investment) * 100
  const roi25YearPercent = netInvestmentInr > 0
    ? Math.round(((lifetime25YearSavingsInr - netInvestmentInr) / netInvestmentInr) * 100)
    : null;

  // 11. Environmental Impact
  const annualCo2AvoidedKg = Math.round(annualGenerationKwh * assumptions.gridEmissionFactorKgPerKwh);
  const lifetimeCo2AvoidedTonnes = Math.round(((lifetime25YearGenerationKwh * assumptions.gridEmissionFactorKgPerKwh) / 1000) * 10) / 10;
  const equivalentTreesPlanted = Math.round(annualCo2AvoidedKg / 20);

  // 12. Equipment Specifications
  const inverterCapacity = Math.ceil(actualCapacityKwp);
  const equipment = {
    panels: `${moduleCount} × ${moduleWattage}W Tier-1 N-Type TOPCon / Mono-PERC Modules (${actualCapacityKwp} kWp DC)`,
    inverter: `${inverterCapacity} kW On-Grid Smart MPPT Solar Inverter (98%+ Efficiency)`,
    structure: 'Custom HDG (Hot-Dip Galvanized) / Anodized Aluminum Engineered Elevated Structure',
    balanceOfSystem: 'IP65 DC/AC Distribution Boxes with Type-II SPDs, MCBs & UV-Resistant 4/6 sq.mm DC Copper Cables',
    battery: inputs.systemType === 'hybrid'
      ? `Modular Lithium Iron Phosphate (LiFePO4) Battery Bank ~${Math.round(actualCapacityKwp * 2)} kWh`
      : undefined,
  };

  return {
    effectiveMonthlyUnits,
    effectiveMonthlyBill,
    calculationMethod: inputs.mode,
    recommendedCapacityKwp,
    actualCapacityKwp,
    moduleCount,
    moduleWattage,
    systemType: inputs.systemType,
    roofAreaRequiredSqFt,
    roofAreaRequiredSqM,
    availableRoofAreaSqFt,
    fitsOnRoof,
    isRoofLimited,
    roofCapacityLimitKwp,
    dailyGenerationKwh,
    monthlyGenerationKwh,
    annualGenerationKwh,
    lifetime25YearGenerationKwh,
    monthlyGenerationBreakdown,
    selfConsumedUnitsMonthly,
    gridImportUnitsMonthly,
    exportedUnitsMonthly,
    monthlySavingsInr,
    annualSavingsInr,
    lifetime25YearSavingsInr,
    costPerKwpInr: costPerKwp,
    costBeforeSubsidyInr,
    subsidy,
    netInvestmentInr,
    simplePaybackYears,
    roi25YearPercent,
    projectionTable,
    annualCo2AvoidedKg,
    lifetimeCo2AvoidedTonnes,
    equivalentTreesPlanted,
    equipment,
  };
}
