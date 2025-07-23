/**
 * RCRI (Revised Cardiac Risk Index) Calculator
 * 
 * Reference: Lee TH, et al. Derivation and prospective validation of a simple index 
 * for prediction of cardiac risk of major noncardiac surgery. Circulation. 1999;100(10):1043-9.
 */

export interface RCRIInput {
  /** High-risk surgery (intraperitoneal, intrathoracic, or suprainguinal vascular) */
  highRiskSurgery: boolean;
  
  /** History of ischemic heart disease */
  ischemicHeartDisease: boolean;
  
  /** History of congestive heart failure */
  congestiveHeartFailure: boolean;
  
  /** History of cerebrovascular disease */
  cerebrovascularDisease: boolean;
  
  /** Insulin therapy for diabetes */
  insulinDependentDiabetes: boolean;
  
  /** Preoperative serum creatinine >2.0 mg/dL (>177 μmol/L) */
  renalInsufficiency: boolean;
}

export interface RCRIResult {
  /** Total RCRI score (0-6) */
  score: number;
  
  /** Risk classification */
  riskClass: 'I' | 'II' | 'III' | 'IV';
  
  /** Estimated risk of major cardiac complications */
  estimatedRisk: string;
  
  /** Risk percentage */
  riskPercentage: number;
  
  /** Clinical interpretation */
  interpretation: string;
  
  /** Individual risk factors present */
  riskFactors: {
    highRiskSurgery: boolean;
    ischemicHeartDisease: boolean;
    congestiveHeartFailure: boolean;
    cerebrovascularDisease: boolean;
    insulinDependentDiabetes: boolean;
    renalInsufficiency: boolean;
  };
  
  /** Clinical recommendations based on risk */
  recommendations: string[];
}

/**
 * Calculate the Revised Cardiac Risk Index (RCRI) score
 * @param input RCRI risk factors
 * @returns RCRI calculation result with score, risk class, and recommendations
 */
export function calculateRCRI(input: RCRIInput): RCRIResult {
  // Calculate total score
  let score = 0;
  
  if (input.highRiskSurgery) score++;
  if (input.ischemicHeartDisease) score++;
  if (input.congestiveHeartFailure) score++;
  if (input.cerebrovascularDisease) score++;
  if (input.insulinDependentDiabetes) score++;
  if (input.renalInsufficiency) score++;
  
  // Determine risk class and estimated risk
  let riskClass: 'I' | 'II' | 'III' | 'IV';
  let estimatedRisk: string;
  let riskPercentage: number;
  
  if (score === 0) {
    riskClass = 'I';
    estimatedRisk = '0.4%';
    riskPercentage = 0.4;
  } else if (score === 1) {
    riskClass = 'II';
    estimatedRisk = '0.9%';
    riskPercentage = 0.9;
  } else if (score === 2) {
    riskClass = 'III';
    estimatedRisk = '6.6%';
    riskPercentage = 6.6;
  } else {
    riskClass = 'IV';
    estimatedRisk = '≥11%';
    riskPercentage = 11;
  }
  
  // Generate interpretation
  const interpretation = generateInterpretation(score, riskClass, estimatedRisk);
  
  // Generate recommendations
  const recommendations = generateRecommendations(score, riskClass, input);
  
  return {
    score,
    riskClass,
    estimatedRisk,
    riskPercentage,
    interpretation,
    riskFactors: {
      highRiskSurgery: input.highRiskSurgery,
      ischemicHeartDisease: input.ischemicHeartDisease,
      congestiveHeartFailure: input.congestiveHeartFailure,
      cerebrovascularDisease: input.cerebrovascularDisease,
      insulinDependentDiabetes: input.insulinDependentDiabetes,
      renalInsufficiency: input.renalInsufficiency
    },
    recommendations
  };
}

function generateInterpretation(score: number, riskClass: string, estimatedRisk: string): string {
  if (score === 0) {
    return `RCRI Class ${riskClass} with no risk factors identified. Estimated risk of major cardiac complications is ${estimatedRisk}. This represents very low cardiac risk.`;
  } else if (score === 1) {
    return `RCRI Class ${riskClass} with 1 risk factor. Estimated risk of major cardiac complications is ${estimatedRisk}. This represents low cardiac risk.`;
  } else if (score === 2) {
    return `RCRI Class ${riskClass} with 2 risk factors. Estimated risk of major cardiac complications is ${estimatedRisk}. This represents intermediate cardiac risk.`;
  } else {
    return `RCRI Class ${riskClass} with ${score} risk factors. Estimated risk of major cardiac complications is ${estimatedRisk}. This represents high cardiac risk.`;
  }
}

function generateRecommendations(score: number, riskClass: string, input: RCRIInput): string[] {
  const recommendations: string[] = [];
  
  // General recommendations based on risk class
  if (score === 0) {
    recommendations.push('Proceed with surgery with standard perioperative care');
    recommendations.push('No additional cardiac testing indicated based on RCRI alone');
  } else if (score === 1) {
    recommendations.push('Consider perioperative beta-blockade if not already prescribed');
    recommendations.push('Ensure optimal medical management of cardiac risk factors');
  } else if (score === 2) {
    recommendations.push('Consider cardiology consultation for perioperative risk assessment');
    recommendations.push('Optimize medical management before elective surgery');
    recommendations.push('Consider non-invasive cardiac testing if it will change management');
  } else {
    recommendations.push('Strongly consider cardiology consultation before surgery');
    recommendations.push('Consider additional cardiac testing (stress test, echo) if results would change management');
    recommendations.push('Optimize all modifiable risk factors before elective surgery');
    recommendations.push('Consider perioperative beta-blockade and statin therapy');
  }
  
  // Specific recommendations based on risk factors
  if (input.congestiveHeartFailure) {
    recommendations.push('Optimize heart failure management preoperatively');
    recommendations.push('Consider echocardiography to assess current cardiac function');
  }
  
  if (input.ischemicHeartDisease) {
    recommendations.push('Ensure patient is on appropriate antiplatelet therapy considering surgical bleeding risk');
    recommendations.push('Continue statin therapy perioperatively');
  }
  
  if (input.insulinDependentDiabetes) {
    recommendations.push('Optimize glycemic control perioperatively');
    recommendations.push('Monitor for diabetic complications');
  }
  
  if (input.renalInsufficiency) {
    recommendations.push('Avoid nephrotoxic medications');
    recommendations.push('Consider nephrology consultation for perioperative management');
    recommendations.push('Monitor volume status carefully');
  }
  
  if (input.cerebrovascularDisease) {
    recommendations.push('Consider carotid evaluation if symptomatic');
    recommendations.push('Maintain adequate blood pressure perioperatively');
  }
  
  // Add monitoring recommendation for all patients
  recommendations.push('Monitor for signs of cardiac complications postoperatively');
  
  return recommendations;
}

/**
 * Helper function to determine if a surgery type is high risk according to RCRI
 * @param surgeryType Description of the surgery
 * @returns Whether the surgery is considered high risk
 */
export function isHighRiskSurgery(surgeryType: string): boolean {
  const highRiskKeywords = [
    'intraperitoneal',
    'intrathoracic',
    'suprainguinal vascular',
    'aortic',
    'major vascular',
    'peripheral vascular',
    'thoracic',
    'abdominal',
    'esophagectomy',
    'hepatectomy',
    'pancreatectomy',
    'pneumonectomy'
  ];
  
  const lowerSurgeryType = surgeryType.toLowerCase();
  return highRiskKeywords.some(keyword => lowerSurgeryType.includes(keyword));
}