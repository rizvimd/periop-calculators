import { ApfelScoreInput, ApfelScoreResult } from '../types';
import { CalculatorError } from '../utils/errors';

/**
 * Calculates the Apfel Score for predicting postoperative nausea and vomiting (PONV)
 * @param input - Patient risk factors
 * @returns Apfel score result with risk assessment and recommendations
 * @throws {CalculatorError} If input validation fails
 */
export function calculateApfelScore(input: ApfelScoreInput): ApfelScoreResult {
  // Validate input
  if (!input || typeof input !== 'object') {
    throw new CalculatorError('Invalid input: ApfelScoreInput object required');
  }

  // Validate boolean fields
  const booleanFields: (keyof ApfelScoreInput)[] = ['female', 'nonSmoker', 'historyOfPONV', 'postoperativeOpioids'];
  for (const field of booleanFields) {
    if (typeof input[field] !== 'boolean') {
      throw new CalculatorError(`Invalid input: ${field} must be a boolean value`);
    }
  }

  // Calculate score (0-4 points)
  let score = 0;
  if (input.female) score++;
  if (input.nonSmoker) score++;
  if (input.historyOfPONV) score++;
  if (input.postoperativeOpioids) score++;

  // Risk percentages based on Apfel et al. 1999
  const riskPercentages: { [key: number]: number } = {
    0: 10,
    1: 21,
    2: 39,
    3: 61,
    4: 79
  };

  const riskPercentage = riskPercentages[score];

  // Determine risk category
  let risk: 'low' | 'moderate' | 'high' | 'very-high';
  if (score === 0) {
    risk = 'low';
  } else if (score === 1) {
    risk = 'moderate';
  } else if (score === 2) {
    risk = 'high';
  } else {
    risk = 'very-high';
  }

  // Generate interpretation
  const riskFactorCount = score === 0 ? 'no' : score.toString();
  const riskFactorPlural = score === 1 ? 'risk factor' : 'risk factors';
  const interpretation = `Apfel Score of ${score} with ${riskFactorCount} ${riskFactorPlural} indicates ${risk.replace('-', ' ')} risk for PONV. Estimated incidence: ${riskPercentage}% chance of experiencing postoperative nausea and vomiting.`;

  // Generate evidence-based recommendations
  const recommendations: string[] = [];
  
  if (score === 0) {
    recommendations.push('Low risk patient - routine PONV prophylaxis may not be necessary');
    recommendations.push('Consider prophylaxis if other risk factors present (e.g., type of surgery)');
  } else if (score === 1) {
    recommendations.push('Consider single-agent PONV prophylaxis');
    recommendations.push('Options include dexamethasone, ondansetron, or droperidol');
  } else if (score === 2) {
    recommendations.push('Recommend dual-agent PONV prophylaxis');
    recommendations.push('Consider combination therapy (e.g., dexamethasone + ondansetron)');
  } else if (score >= 3) {
    recommendations.push('High-risk patient - recommend multimodal PONV prophylaxis');
    recommendations.push('Consider 3-4 antiemetic agents from different classes');
    recommendations.push('Consider total intravenous anesthesia (TIVA) with propofol');
    if (input.postoperativeOpioids) {
      recommendations.push('Consider regional anesthesia or non-opioid analgesics to reduce opioid requirements');
    }
  }

  // Always include general recommendations
  recommendations.push('Monitor for PONV in PACU and postoperative period');
  recommendations.push('Have rescue antiemetics readily available');

  return {
    score,
    riskPercentage,
    risk,
    interpretation,
    riskFactors: {
      female: input.female,
      nonSmoker: input.nonSmoker,
      historyOfPONV: input.historyOfPONV,
      postoperativeOpioids: input.postoperativeOpioids
    },
    recommendations
  };
}

/**
 * Returns detailed information about a specific Apfel risk factor
 * @param factor - The risk factor to get information about
 * @returns Detailed description of the risk factor
 */
export function getApfelRiskFactorInfo(factor: keyof ApfelScoreInput): string {
  const factorInfo: { [key in keyof ApfelScoreInput]: string } = {
    female: 'Female gender is associated with 2-3 times higher risk of PONV compared to males',
    nonSmoker: 'Non-smoking status increases PONV risk, possibly due to chronic nicotine exposure providing antiemetic effects in smokers',
    historyOfPONV: 'Previous PONV or motion sickness is a strong predictor of future PONV episodes',
    postoperativeOpioids: 'Postoperative opioid use is a dose-dependent risk factor for PONV'
  };

  return factorInfo[factor] || 'Unknown risk factor';
}