# API Documentation

Complete API reference for periop-calculators package.

## Table of Contents

- [Installation](#installation)
- [Core Types](#core-types)
- [STOP-BANG Calculator](#stop-bang-calculator)
- [RCRI Calculator](#rcri-calculator)
- [Apfel Score Calculator](#apfel-score-calculator)
- [Utility Functions](#utility-functions)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)

## Installation

```bash
npm install periop-calculators
```

```typescript
// ES6 imports
import { calculateStopBang, calculateRCRI, calculateApfelScore } from 'periop-calculators';

// CommonJS
const { calculateStopBang, calculateRCRI, calculateApfelScore } = require('periop-calculators');
```

## Core Types

### PatientDemographics

```typescript
interface PatientDemographics {
  age: number;                    // Age in years
  sex: 'male' | 'female';        // Patient gender
  weight?: number;               // Weight in kg (optional)
  height?: number;               // Height in cm (optional)
  neckCircumference?: number;    // Neck circumference in cm (optional)
}
```

### CalculatorError

```typescript
class CalculatorError extends Error {
  constructor(message: string);
}
```

## STOP-BANG Calculator

Screening tool for obstructive sleep apnea (OSA) in surgical patients.

### Types

```typescript
interface StopBangInput {
  snoring: boolean;              // Snoring loudly
  tiredness: boolean;            // Daytime tiredness/fatigue
  observed: boolean;             // Observed apnea episodes
  pressure: boolean;             // Hypertension (treated or untreated)
  bmi?: number;                  // Body Mass Index (optional if demographics provided)
  age?: number;                  // Age in years (optional if demographics provided)
  neckCircumference?: number;    // Neck circumference in cm (optional)
  gender?: 'male' | 'female';   // Gender (optional if demographics provided)
}

interface StopBangResult {
  score: number;                 // Total score (0-8)
  risk: 'low' | 'intermediate' | 'high';  // Risk category
  interpretation: string;        // Clinical interpretation
  components: {                  // Individual component results
    S: boolean;                  // Snoring
    T: boolean;                  // Tiredness
    O: boolean;                  // Observed apnea
    P: boolean;                  // Pressure (hypertension)
    B: boolean;                  // BMI > 35
    A: boolean;                  // Age > 50
    N: boolean;                  // Neck circumference > 40cm
    G: boolean;                  // Gender (male)
  };
  recommendations: string[];     // Clinical recommendations
}
```

### Functions

#### calculateStopBang

```typescript
function calculateStopBang(
  input: StopBangInput,
  demographics?: PatientDemographics
): StopBangResult
```

**Parameters:**
- `input` - STOP-BANG assessment data
- `demographics` - Optional patient demographics for auto-calculation of BMI, age, gender

**Returns:** Complete STOP-BANG assessment result

**Throws:** `CalculatorError` for invalid inputs

**Examples:**

```typescript
// Direct input method
const result1 = calculateStopBang({
  snoring: true,
  tiredness: true,
  observed: false,
  pressure: true,
  bmi: 36,
  age: 55,
  neckCircumference: 43,
  gender: 'male'
});

// Using demographics
const result2 = calculateStopBang(
  {
    snoring: true,
    tiredness: true,
    observed: false,
    pressure: true
  },
  {
    age: 55,
    sex: 'male',
    weight: 100,  // kg
    height: 175,  // cm
    neckCircumference: 43
  }
);
```

#### calculateStopBangScore

```typescript
function calculateStopBangScore(input: StopBangInput): number
```

**Parameters:**
- `input` - STOP-BANG assessment data

**Returns:** Numeric score only (0-8)

**Example:**
```typescript
const score = calculateStopBangScore({
  snoring: true,
  tiredness: false,
  observed: false,
  pressure: true,
  bmi: 32,
  age: 45,
  neckCircumference: 38,
  gender: 'female'
});
// Returns: 2
```

### Risk Stratification

| Score | Risk Level | OSA Probability | Clinical Action |
|-------|------------|----------------|-----------------|
| 0-2 | Low | Low probability of moderate-severe OSA | Standard perioperative care |
| 3-4 | Intermediate | Intermediate probability | Consider sleep study or CPAP trial |
| 5-8 | High | High probability of moderate-severe OSA | Sleep medicine consultation recommended |

## RCRI Calculator

Revised Cardiac Risk Index for predicting cardiac complications in non-cardiac surgery.

### Types

```typescript
interface RCRIInput {
  highRiskSurgery: boolean;           // Intraperitoneal, intrathoracic, or suprainguinal vascular
  ischemicHeartDisease: boolean;      // History of MI, positive stress test, angina, nitrate use
  congestiveHeartFailure: boolean;    // History of CHF, pulmonary edema, dyspnea
  cerebrovascularDisease: boolean;    // History of stroke or TIA
  insulinDependentDiabetes: boolean;  // Diabetes requiring insulin therapy
  renalInsufficiency: boolean;        // Creatinine > 2.0 mg/dL (177 μmol/L)
}

interface RCRIResult {
  score: number;                      // Total risk factors (0-6)
  riskClass: 'I' | 'II' | 'III' | 'IV';  // Risk classification
  estimatedRisk: string;              // Risk percentage as string
  riskPercentage: number;             // Risk percentage as number
  interpretation: string;             // Clinical interpretation
  riskFactors: RCRIInput;            // Input risk factors
  recommendations: string[];          // Clinical recommendations
}
```

### Functions

#### calculateRCRI

```typescript
function calculateRCRI(input: RCRIInput): RCRIResult
```

**Parameters:**
- `input` - RCRI risk factor assessment

**Returns:** Complete RCRI assessment result

**Throws:** `CalculatorError` for invalid inputs

**Example:**
```typescript
const result = calculateRCRI({
  highRiskSurgery: true,
  ischemicHeartDisease: false,
  congestiveHeartFailure: false,
  cerebrovascularDisease: false,
  insulinDependentDiabetes: true,
  renalInsufficiency: false
});

console.log(result.riskClass);        // "III"
console.log(result.riskPercentage);   // 6.6
console.log(result.estimatedRisk);    // "6.6%"
```

#### isHighRiskSurgery

```typescript
function isHighRiskSurgery(surgeryType: string): boolean
```

**Parameters:**
- `surgeryType` - Description of surgical procedure

**Returns:** Boolean indicating if surgery is high-risk per RCRI criteria

**Example:**
```typescript
isHighRiskSurgery('aortic aneurysm repair');    // true
isHighRiskSurgery('carotid endarterectomy');    // true
isHighRiskSurgery('cataract surgery');          // false
isHighRiskSurgery('total knee replacement');   // false
```

### Risk Classification

| Risk Factors | Class | Risk of Major Cardiac Events |
|--------------|-------|-------------------------------|
| 0 | Class I | 0.4% |
| 1 | Class II | 0.9% |
| 2 | Class III | 6.6% |
| ≥3 | Class IV | ≥11% |

## Apfel Score Calculator

Predicts risk of postoperative nausea and vomiting (PONV) in adult patients.

### Types

```typescript
interface ApfelScoreInput {
  female: boolean;                    // Female gender
  nonSmoker: boolean;                // Non-smoking status
  historyOfPONV: boolean;            // History of PONV or motion sickness
  postoperativeOpioids: boolean;     // Expected postoperative opioid use
}

interface ApfelScoreResult {
  score: number;                     // Total score (0-4)
  riskPercentage: number;            // PONV risk percentage
  risk: 'low' | 'moderate' | 'high' | 'very-high';  // Risk category
  interpretation: string;            // Clinical interpretation
  riskFactors: ApfelScoreInput;     // Input risk factors
  recommendations: string[];         // Clinical recommendations
}
```

### Functions

#### calculateApfelScore

```typescript
function calculateApfelScore(input: ApfelScoreInput): ApfelScoreResult
```

**Parameters:**
- `input` - Apfel Score risk factor assessment

**Returns:** Complete Apfel Score assessment result

**Throws:** `CalculatorError` for invalid inputs

**Example:**
```typescript
const result = calculateApfelScore({
  female: true,
  nonSmoker: true,
  historyOfPONV: false,
  postoperativeOpioids: true
});

console.log(result.score);           // 3
console.log(result.riskPercentage);  // 61
console.log(result.risk);            // "very-high"
```

#### getApfelRiskFactorInfo

```typescript
function getApfelRiskFactorInfo(
  factor: 'female' | 'nonSmoker' | 'historyOfPONV' | 'postoperativeOpioids'
): string
```

**Parameters:**
- `factor` - Specific risk factor to get information about

**Returns:** Detailed clinical information about the risk factor

**Example:**
```typescript
const info = getApfelRiskFactorInfo('female');
// Returns: "Female gender is associated with 2-3 times higher risk of PONV compared to males"
```

### Risk Stratification

| Score | Risk Percentage | Risk Category | Clinical Action |
|-------|----------------|---------------|-----------------|
| 0 | 10% | Low | Standard antiemetic prophylaxis |
| 1 | 21% | Moderate | Single antiemetic agent |
| 2 | 39% | High | Dual antiemetic prophylaxis |
| 3 | 61% | Very High | Multimodal antiemetic approach |
| 4 | 79% | Very High | Aggressive multimodal prophylaxis |

## Utility Functions

### calculateBMI

```typescript
function calculateBMI(weight: number, height: number): number
```

**Parameters:**
- `weight` - Weight in kilograms
- `height` - Height in centimeters

**Returns:** Body Mass Index (BMI)

**Throws:** `CalculatorError` for invalid inputs

**Example:**
```typescript
const bmi = calculateBMI(80, 175);  // Returns: 26.1
```

## Error Handling

All calculators throw `CalculatorError` for invalid inputs:

```typescript
import { calculateStopBang, CalculatorError } from 'periop-calculators';

try {
  const result = calculateStopBang({
    snoring: true,
    tiredness: "invalid",  // Should be boolean
    observed: false,
    pressure: true
  });
} catch (error) {
  if (error instanceof CalculatorError) {
    console.error('Calculation error:', error.message);
  }
}
```

### Common Error Types

1. **Invalid Input Type**: Non-object or null input
2. **Missing Required Fields**: Required boolean/number fields not provided
3. **Invalid Data Types**: Wrong data type for specific fields
4. **Out of Range Values**: Numeric values outside acceptable ranges

## TypeScript Support

This package is written in TypeScript and includes comprehensive type definitions:

```typescript
import {
  // Calculator functions
  calculateStopBang,
  calculateRCRI,
  calculateApfelScore,
  
  // Input types
  StopBangInput,
  RCRIInput,
  ApfelScoreInput,
  PatientDemographics,
  
  // Result types
  StopBangResult,
  RCRIResult,
  ApfelScoreResult,
  
  // Utility types
  CalculatorError
} from 'periop-calculators';
```

### Type Guards

```typescript
function isStopBangResult(result: any): result is StopBangResult {
  return result && 
         typeof result.score === 'number' && 
         ['low', 'intermediate', 'high'].includes(result.risk);
}
```

## Browser Compatibility

The package works in both Node.js and browser environments:

```html
<!-- Browser usage -->
<script src="https://unpkg.com/periop-calculators/dist/index.umd.js"></script>
<script>
  const result = PeriopCalculators.calculateStopBang({
    snoring: true,
    tiredness: true,
    observed: false,
    pressure: true,
    bmi: 36,
    age: 55,
    neckCircumference: 43,
    gender: 'male'
  });
  console.log(result);
</script>
```

## Performance Considerations

- All calculators are synchronous and lightweight
- No external dependencies
- Minimal memory footprint
- Optimized for clinical decision support systems
- Suitable for real-time calculations

## Clinical Disclaimers

⚠️ **Important Clinical Notes:**

1. **Educational Purpose**: This software is intended for educational and research purposes
2. **Clinical Judgment**: Always use clinical judgment and institutional protocols
3. **Validation Required**: Verify calculations independently for clinical use
4. **Not FDA Approved**: This software is not FDA-approved for clinical decision making
5. **Professional Responsibility**: Healthcare providers are responsible for appropriate use

## Version Compatibility

| Version | Node.js | TypeScript | Key Features |
|---------|---------|------------|--------------|
| 1.2.x | ≥14.0.0 | ≥4.0.0 | STOP-BANG, RCRI, Apfel Score |
| 1.1.x | ≥14.0.0 | ≥4.0.0 | STOP-BANG, RCRI |
| 1.0.x | ≥14.0.0 | ≥4.0.0 | STOP-BANG only |

---

*For additional support or clinical questions, please visit the [GitHub repository](https://github.com/rizvimd/periop-calculators) or contact the maintainer.*