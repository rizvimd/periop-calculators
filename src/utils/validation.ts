import { ValidationResult, CalculatorError } from '../types';

export function validateAge(age?: number): ValidationResult {
  const errors: CalculatorError[] = [];

  if (age === undefined || age === null) {
    errors.push({
      code: 'AGE_REQUIRED',
      message: 'Age is required',
      field: 'age',
    });
  } else if (age < 18) {
    errors.push({
      code: 'AGE_TOO_LOW',
      message: 'STOP-BANG is validated for adults 18 years and older',
      field: 'age',
    });
  } else if (age > 120) {
    errors.push({
      code: 'AGE_INVALID',
      message: 'Please enter a valid age',
      field: 'age',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateBMI(
  bmi?: number,
  weight?: number,
  height?: number
): ValidationResult {
  const errors: CalculatorError[] = [];

  if (bmi === undefined && (weight === undefined || height === undefined)) {
    errors.push({
      code: 'BMI_CALCULATION_ERROR',
      message: 'Either BMI or both weight and height must be provided',
      field: 'bmi',
    });
  } else if (bmi !== undefined && (bmi < 10 || bmi > 70)) {
    errors.push({
      code: 'BMI_INVALID',
      message: 'BMI must be between 10 and 70',
      field: 'bmi',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}