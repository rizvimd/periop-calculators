/**
 * periop-calculators
 * 
 * Evidence-based perioperative risk assessment calculators for healthcare professionals
 * 
 * @packageDocumentation
 */

// Export all calculators
export { calculateStopBang, calculateStopBangScore } from './calculators/stop-bang';

// Export all types - this is important for TypeScript users
export type {
  // Core types
  PatientDemographics,
  CalculatorError,
  ValidationResult,
  
  // STOP-BANG specific types
  StopBangInput,
  StopBangResult,
} from './types';

// Export utility functions that might be useful
export { calculateBMI } from './utils/validation';

/**
 * @example
 * ```typescript
 * import { calculateStopBang } from 'periop-calculators';
 * 
 * const result = calculateStopBang({
 *   snoring: true,
 *   tiredness: true,
 *   observed: false,
 *   pressure: true,
 *   bmi: 36,
 *   age: 55,
 *   neckCircumference: 43,
 *   gender: 'male'
 * });
 * 
 * console.log(`Risk: ${result.risk}`);
 * console.log(`Score: ${result.score}/8`);
 * ```
 */