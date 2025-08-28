export interface PatientDemographics {
  age: number;
  sex: 'male' | 'female';
  weight: number; // in kg
  height: number; // in cm
  neckCircumference?: number; // in cm
}

export interface StopBangInput {
  snoring: boolean;
  tiredness: boolean;
  observed: boolean; // observed apnea
  pressure: boolean; // high blood pressure
  bmi?: number; // optional, will be calculated if not provided
  age?: number; // optional, can use demographics
  neckCircumference?: number; // in cm
  gender?: 'male' | 'female'; // optional, can use demographics
}

export interface StopBangResult {
  score: number;
  risk: 'low' | 'intermediate' | 'high';
  interpretation: string;
  components: {
    S: boolean; // Snoring
    T: boolean; // Tiredness
    O: boolean; // Observed apnea
    P: boolean; // Pressure (hypertension)
    B: boolean; // BMI > 35
    A: boolean; // Age > 50
    N: boolean; // Neck circumference
    G: boolean; // Gender (male)
  };
  recommendations: string[];
}

export interface CalculatorError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: CalculatorError[];
}

export interface RCRIInput {
  highRiskSurgery: boolean;
  ischemicHeartDisease: boolean;
  congestiveHeartFailure: boolean;
  cerebrovascularDisease: boolean;
  insulinDependentDiabetes: boolean;
  renalInsufficiency: boolean;
}

export interface RCRIResult {
  score: number;
  riskClass: 'I' | 'II' | 'III' | 'IV';
  estimatedRisk: string;
  riskPercentage: number;
  interpretation: string;
  riskFactors: {
    highRiskSurgery: boolean;
    ischemicHeartDisease: boolean;
    congestiveHeartFailure: boolean;
    cerebrovascularDisease: boolean;
    insulinDependentDiabetes: boolean;
    renalInsufficiency: boolean;
  };
  recommendations: string[];
}

// Apfel Score types
export interface ApfelScoreInput {
  female: boolean;
  nonSmoker: boolean;
  historyOfPONV: boolean;
  postoperativeOpioids: boolean;
}

export interface ApfelScoreResult {
  score: number;
  riskPercentage: number;
  risk: 'low' | 'moderate' | 'high' | 'very-high';
  interpretation: string;
  riskFactors: {
    female: boolean;
    nonSmoker: boolean;
    historyOfPONV: boolean;
    postoperativeOpioids: boolean;
  };
  recommendations: string[];
}

// MELD Score types
export interface MELDScoreInput {
  /** Serum bilirubin in mg/dL */
  bilirubin: number;
  /** Serum creatinine in mg/dL */
  creatinine: number;
  /** International normalized ratio (INR) */
  inr: number;
  /** Patient has received dialysis twice within the past week */
  dialysis?: boolean;
}

export interface MELDScoreResult {
  /** MELD score (6-40) */
  score: number;
  /** 3-month mortality estimate */
  mortalityRisk: string;
  /** Mortality percentage */
  mortalityPercentage: number;
  /** Risk category */
  risk: 'low' | 'moderate' | 'high' | 'very-high';
  /** Clinical interpretation */
  interpretation: string;
  /** Laboratory values used in calculation */
  labValues: {
    bilirubin: number;
    creatinine: number;
    inr: number;
    dialysis: boolean;
  };
  /** Clinical recommendations */
  recommendations: string[];
}