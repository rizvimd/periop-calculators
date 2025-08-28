import { MELDScoreInput, MELDScoreResult } from '../types';
import { CalculatorError } from '../utils/errors';

/**
 * Calculates the MELD (Model for End-Stage Liver Disease) Score
 * 
 * The MELD score is a validated scoring system used to assess the severity of 
 * end-stage liver disease and predict short-term mortality. It is widely used
 * in surgical risk assessment and liver transplant allocation.
 * 
 * Formula: MELD = 3.78 × ln(bilirubin) + 11.2 × ln(INR) + 9.57 × ln(creatinine) + 6.43
 * 
 * @param input - Laboratory values and dialysis status
 * @returns MELD score result with risk assessment and recommendations
 * @throws {CalculatorError} If input validation fails
 * 
 * @example
 * ```typescript
 * const result = calculateMELDScore({
 *   bilirubin: 2.5,
 *   creatinine: 1.8,
 *   inr: 1.6,
 *   dialysis: false
 * });
 * console.log(result.score); // 18
 * console.log(result.risk); // 'moderate'
 * ```
 */
export function calculateMELDScore(input: MELDScoreInput): MELDScoreResult {
  // Validate input
  validateMELDInput(input);

  // Apply constraints per MELD scoring guidelines
  const bilirubin = Math.max(1.0, Math.min(input.bilirubin, 4.0));
  const inr = Math.max(1.0, Math.min(input.inr, 4.0));
  
  // If dialysis in past week, creatinine is set to 4.0
  const creatinine = input.dialysis 
    ? 4.0 
    : Math.max(1.0, Math.min(input.creatinine, 4.0));

  // Calculate raw MELD score using the original formula
  // MELD = 3.78 × ln(bilirubin) + 11.2 × ln(INR) + 9.57 × ln(creatinine) + 6.43
  const rawScore = 
    3.78 * Math.log(bilirubin) + 
    11.2 * Math.log(inr) + 
    9.57 * Math.log(creatinine) + 
    6.43;

  // Round to nearest integer and apply bounds (6-40)
  const score = Math.max(6, Math.min(40, Math.round(rawScore * 10) / 10));
  const finalScore = Math.round(score);

  // Determine risk category and mortality estimates
  const { risk, mortalityPercentage, mortalityRisk } = getMortalityRisk(finalScore);

  // Generate interpretation
  const interpretation = generateInterpretation(finalScore, risk, mortalityPercentage);

  // Generate recommendations
  const recommendations = generateRecommendations(finalScore, risk, input);

  return {
    score: finalScore,
    mortalityRisk,
    mortalityPercentage,
    risk,
    interpretation,
    labValues: {
      bilirubin: input.bilirubin,
      creatinine: input.creatinine,
      inr: input.inr,
      dialysis: input.dialysis || false
    },
    recommendations
  };
}

/**
 * Validates MELD score input parameters
 */
function validateMELDInput(input: MELDScoreInput): void {
  if (!input || typeof input !== 'object') {
    throw new CalculatorError('Invalid input: MELDScoreInput object required');
  }

  // Validate bilirubin
  if (typeof input.bilirubin !== 'number' || input.bilirubin <= 0) {
    throw new CalculatorError('Invalid bilirubin: must be a positive number in mg/dL');
  }
  if (input.bilirubin > 50) {
    throw new CalculatorError('Invalid bilirubin: value appears too high (>50 mg/dL), please verify units');
  }

  // Validate creatinine
  if (typeof input.creatinine !== 'number' || input.creatinine <= 0) {
    throw new CalculatorError('Invalid creatinine: must be a positive number in mg/dL');
  }
  if (input.creatinine > 15) {
    throw new CalculatorError('Invalid creatinine: value appears too high (>15 mg/dL), please verify units');
  }

  // Validate INR
  if (typeof input.inr !== 'number' || input.inr <= 0) {
    throw new CalculatorError('Invalid INR: must be a positive number');
  }
  if (input.inr > 10) {
    throw new CalculatorError('Invalid INR: value appears too high (>10), please verify');
  }

  // Validate dialysis (optional boolean)
  if (input.dialysis !== undefined && typeof input.dialysis !== 'boolean') {
    throw new CalculatorError('Invalid dialysis: must be a boolean value');
  }
}

/**
 * Determines mortality risk based on MELD score
 */
function getMortalityRisk(score: number): {
  risk: 'low' | 'moderate' | 'high' | 'very-high';
  mortalityPercentage: number;
  mortalityRisk: string;
} {
  if (score <= 9) {
    return {
      risk: 'low',
      mortalityPercentage: 1.9,
      mortalityRisk: '1.9%'
    };
  } else if (score <= 19) {
    return {
      risk: 'moderate',
      mortalityPercentage: 6.0,
      mortalityRisk: '6.0%'
    };
  } else if (score <= 29) {
    return {
      risk: 'high',
      mortalityPercentage: 19.6,
      mortalityRisk: '19.6%'
    };
  } else {
    return {
      risk: 'very-high',
      mortalityPercentage: 52.6,
      mortalityRisk: '52.6%'
    };
  }
}

/**
 * Generates clinical interpretation based on MELD score
 */
function generateInterpretation(
  score: number, 
  risk: string, 
  mortalityPercentage: number
): string {
  const riskDescription = risk.replace('-', ' ');
  
  return `MELD score of ${score} indicates ${riskDescription} risk of 3-month mortality (${mortalityPercentage}%). ` +
    `This score is used to assess liver disease severity and perioperative risk in patients with end-stage liver disease.`;
}

/**
 * Generates evidence-based clinical recommendations
 */
function generateRecommendations(
  score: number, 
  risk: string, 
  input: MELDScoreInput
): string[] {
  const recommendations: string[] = [];

  // General recommendations
  recommendations.push('Document MELD score in preoperative assessment');
  recommendations.push('Consider hepatology consultation for liver disease management');

  // Risk-specific recommendations
  if (score <= 9) {
    recommendations.push('Low surgical risk - proceed with standard perioperative care');
    recommendations.push('Monitor liver function perioperatively');
  } else if (score <= 19) {
    recommendations.push('Moderate surgical risk - optimize liver function before elective surgery');
    recommendations.push('Consider enhanced postoperative monitoring');
    recommendations.push('Avoid hepatotoxic medications when possible');
  } else if (score <= 29) {
    recommendations.push('High surgical risk - multidisciplinary evaluation recommended');
    recommendations.push('Consider deferring elective surgery until liver function improves');
    recommendations.push('If surgery necessary, plan for intensive postoperative care');
    recommendations.push('Evaluate for liver transplant candidacy');
  } else {
    recommendations.push('Very high surgical risk - surgery should be avoided unless life-threatening');
    recommendations.push('Urgent liver transplant evaluation indicated');
    recommendations.push('If emergency surgery required, plan for ICU-level care');
    recommendations.push('Multidisciplinary team approach essential');
  }

  // Specific lab value recommendations
  if (input.bilirubin > 3.0) {
    recommendations.push('Elevated bilirubin - investigate for biliary obstruction or worsening liver function');
  }

  if (input.inr > 2.0) {
    recommendations.push('Significantly elevated INR - consider vitamin K, FFP, or PCC for procedural correction');
  }

  if (input.creatinine > 2.0 || input.dialysis) {
    recommendations.push('Renal dysfunction present - avoid nephrotoxic agents and monitor fluid balance');
    if (input.dialysis) {
      recommendations.push('Patient on dialysis - coordinate timing with nephrology team');
    }
  }

  // Universal monitoring recommendations
  recommendations.push('Monitor for hepatic encephalopathy');
  recommendations.push('Assess for ascites and portal hypertension');
  recommendations.push('Evaluate coagulation status before procedures');

  return recommendations;
}

/**
 * Helper function to determine if a MELD score indicates high surgical risk
 * @param score MELD score
 * @returns Whether the score indicates high or very high risk
 */
export function isHighRiskMELD(score: number): boolean {
  return score >= 20;
}

/**
 * Helper function to get MELD score interpretation without full calculation
 * @param score MELD score
 * @returns Risk category
 */
export function getMELDRiskCategory(score: number): 'low' | 'moderate' | 'high' | 'very-high' {
  if (score <= 9) return 'low';
  if (score <= 19) return 'moderate';
  if (score <= 29) return 'high';
  return 'very-high';
}