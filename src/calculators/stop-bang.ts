import {
  StopBangInput,
  StopBangResult,
  PatientDemographics,
  CalculatorError,
} from '../types';
import { validateAge, validateBMI, calculateBMI } from '../utils/validation';

/**
 * Calculate STOP-BANG score for obstructive sleep apnea risk assessment
 * 
 * STOP-BANG is a validated screening tool for obstructive sleep apnea (OSA)
 * in surgical patients. It consists of 8 yes/no questions.
 * 
 * Score interpretation:
 * - 0-2: Low risk of OSA
 * - 3-4: Intermediate risk of OSA
 * - 5-8: High risk of OSA
 * 
 * @param input - STOP-BANG questionnaire responses
 * @param demographics - Optional patient demographics for auto-calculation
 * @returns StopBangResult with score, risk level, and recommendations
 * @throws Error if required inputs are missing or invalid
 * 
 * @example
 * ```typescript
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
 * console.log(result.score); // 6
 * console.log(result.risk); // 'high'
 * ```
 */
export function calculateStopBang(
  input: StopBangInput,
  demographics?: PatientDemographics
): StopBangResult {
  const errors: CalculatorError[] = [];

  // Determine age
  const age = input.age ?? demographics?.age;
  const ageValidation = validateAge(age);
  if (!ageValidation.isValid) {
    errors.push(...ageValidation.errors);
  }

  // Determine BMI
  let bmi = input.bmi;
  if (!bmi && demographics?.weight && demographics?.height) {
    bmi = calculateBMI(demographics.weight, demographics.height);
  }
  const bmiValidation = validateBMI(bmi, demographics?.weight, demographics?.height);
  if (!bmiValidation.isValid) {
    errors.push(...bmiValidation.errors);
  }

  // Determine gender
  const gender = input.gender ?? demographics?.sex;
  if (!gender) {
    errors.push({
      code: 'GENDER_REQUIRED',
      message: 'Gender is required for STOP-BANG calculation',
      field: 'gender',
    });
  }

  // Determine neck circumference
  const neckCircumference = input.neckCircumference ?? demographics?.neckCircumference;

  if (errors.length > 0) {
    throw new Error(
      `Validation errors: ${errors.map((e) => e.message).join(', ')}`
    );
  }

  // Calculate individual components
  const components = {
    S: input.snoring,
    T: input.tiredness,
    O: input.observed,
    P: input.pressure,
    B: (bmi ?? 0) > 35,
    A: (age ?? 0) > 50,
    N: neckCircumference ? neckCircumference > 40 : false,
    G: gender === 'male',
  };

  // Calculate total score
  const score = Object.values(components).filter(Boolean).length;

  // Determine risk level
  let risk: 'low' | 'intermediate' | 'high';
  if (score <= 2) {
    risk = 'low';
  } else if (score <= 4) {
    risk = 'intermediate';
  } else {
    risk = 'high';
  }

  // Generate interpretation
  const interpretation = generateInterpretation(score, risk);

  // Generate recommendations
  const recommendations = generateRecommendations(score, risk, components);

  return {
    score,
    risk,
    interpretation,
    components,
    recommendations,
  };
}

function generateInterpretation(
  score: number,
  risk: 'low' | 'intermediate' | 'high'
): string {
  const baseInterpretation = `STOP-BANG score of ${score} indicates ${risk} risk of obstructive sleep apnea.`;

  switch (risk) {
    case 'low':
      return `${baseInterpretation} The patient has a low probability of moderate to severe OSA.`;
    case 'intermediate':
      return `${baseInterpretation} Further evaluation may be warranted based on clinical judgment and planned procedure.`;
    case 'high':
      return `${baseInterpretation} The patient has a high probability of moderate to severe OSA. Consider polysomnography and perioperative precautions.`;
  }
}

function generateRecommendations(
  score: number,
  risk: 'low' | 'intermediate' | 'high',
  components: StopBangResult['components']
): string[] {
  const recommendations: string[] = [];

  // Universal recommendations
  recommendations.push('Document STOP-BANG score in preoperative assessment');

  switch (risk) {
    case 'low':
      recommendations.push('Proceed with standard anesthetic care');
      recommendations.push('No specific OSA precautions required');
      break;

    case 'intermediate':
      recommendations.push('Consider extended monitoring in PACU');
      recommendations.push('Use caution with sedatives and opioids');
      recommendations.push('Consider referral for sleep study if multiple risk factors present');
      if (components.B || components.N) {
        recommendations.push('Optimize positioning to maintain airway patency');
      }
      break;

    case 'high':
      recommendations.push('Strong consideration for polysomnography before elective surgery');
      recommendations.push('Consider using short-acting agents');
      recommendations.push('Plan for possible postoperative continuous monitoring');
      recommendations.push('Have difficult airway equipment readily available');
      recommendations.push('Consider regional anesthesia when appropriate');
      recommendations.push('Minimize opioid use - consider multimodal analgesia');
      if (score >= 6) {
        recommendations.push('Consider postoperative ICU admission for major surgery');
      }
      break;
  }

  // Specific recommendations based on components
  if (components.P) {
    recommendations.push('Ensure blood pressure is optimized preoperatively');
  }

  if (components.B) {
    recommendations.push('Consider weight loss counseling for elective procedures');
  }

  return recommendations;
}

/**
 * Simplified version of STOP-BANG calculation using just the basic inputs
 * @param input - Basic STOP-BANG inputs
 * @returns Just the numeric score (0-8)
 */
export function calculateStopBangScore(input: StopBangInput): number {
  try {
    const result = calculateStopBang(input);
    return result.score;
  } catch (error) {
    throw new Error(`Cannot calculate STOP-BANG score: ${error}`);
  }
}