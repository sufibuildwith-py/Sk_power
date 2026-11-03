import React from 'react';
import { SolarCalculator, SolarCalculatorProps } from './SolarCalculator/SolarCalculator';

export interface SolarSavingsCalculatorProps extends SolarCalculatorProps {
  defaultSolarGeneration?: number;
}

export const SolarSavingsCalculator: React.FC<SolarSavingsCalculatorProps> = ({
  onOpenQuote,
  className = '',
  initialInputs,
}) => {
  return (
    <SolarCalculator
      onOpenQuote={onOpenQuote}
      className={className}
      initialInputs={initialInputs}
    />
  );
};

export default SolarSavingsCalculator;
