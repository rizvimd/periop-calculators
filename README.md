# periop-calculators

[![npm version](https://img.shields.io/npm/v/periop-calculators.svg)](https://www.npmjs.com/package/periop-calculators)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

Evidence-based perioperative risk assessment calculators for healthcare professionals. Built with TypeScript for type safety and modern JavaScript environments.

## Features

- 🏥 **Clinical Accuracy**: Implements validated perioperative risk assessment tools
- 🔍 **Type Safe**: Full TypeScript support with comprehensive type definitions
- 📋 **Well Tested**: Extensive test coverage for reliability
- 📚 **Documented**: Detailed API documentation with clinical references
- 🚀 **Lightweight**: No external dependencies, small bundle size
- 🔧 **Flexible**: Works in Node.js and browser environments

## Installation

```bash
npm install periop-calculators
```

or

```bash
yarn add periop-calculators
```

## Quick Start

```typescript
import { calculateStopBang } from 'periop-calculators';

const result = calculateStopBang({
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
// {
//   score: 6,
//   risk: 'high',
//   interpretation: 'STOP-BANG score of 6 indicates high risk...',
//   components: { S: true, T: true, O: false, ... },
//   recommendations: [...]
// }
```

## Available Calculators

### 1. STOP-BANG Score

Screening tool for obstructive sleep apnea (OSA) in surgical patients.

```typescript
import { calculateStopBang, StopBangInput, StopBangResult } from 'periop-calculators';

const input: StopBangInput = {
  snoring: true,           // Snoring loudly
  tiredness: true,         // Daytime tiredness
  observed: false,         // Observed apnea
  pressure: true,          // Hypertension
  bmi: 36,                // BMI > 35
  age: 55,                // Age > 50
  neckCircumference: 43,  // Neck > 40cm
  gender: 'male'          // Male gender
};

const result: StopBangResult = calculateStopBang(input);
```

#### With Patient Demographics

The calculator can derive values from patient demographics:

```typescript
import { calculateStopBang, PatientDemographics } from 'periop-calculators';

const demographics: PatientDemographics = {
  age: 55,
  sex: 'male',
  weight: 100,  // kg
  height: 180,  // cm
  neckCircumference: 43
};

const result = calculateStopBang(
  {
    snoring: true,
    tiredness: true,
    observed: false,
    pressure: true
  },
  demographics  // BMI, age, and gender will be calculated
);
```

#### Risk Stratification

- **Low Risk (0-2)**: Low probability of moderate to severe OSA
- **Intermediate Risk (3-4)**: Further evaluation may be warranted
- **High Risk (5-8)**: High probability of moderate to severe OSA

### 2. RCRI (Revised Cardiac Risk Index)

Estimates risk of cardiac complications for patients undergoing non-cardiac surgery.

```typescript
import { calculateRCRI, RCRIInput, RCRIResult } from 'periop-calculators';

const input: RCRIInput = {
  highRiskSurgery: true,          // Intraperitoneal, intrathoracic, or suprainguinal vascular
  ischemicHeartDisease: false,    // History of MI, positive stress test, angina, nitrate use
  congestiveHeartFailure: false,  // History of CHF, pulmonary edema, or dyspnea
  cerebrovascularDisease: false,  // History of stroke or TIA
  insulinDependentDiabetes: true, // Diabetes requiring insulin therapy
  renalInsufficiency: false       // Creatinine > 2.0 mg/dL
};

const result: RCRIResult = calculateRCRI(input);

console.log(result);
// {
//   score: 2,
//   riskClass: 'III',
//   estimatedRisk: '6.6%',
//   riskPercentage: 6.6,
//   interpretation: 'RCRI Class III with 2 risk factors...',
//   riskFactors: { ... },
//   recommendations: [...]
// }
```

#### Risk Classification

- **Class I (0 points)**: 0.4% risk of major cardiac complications
- **Class II (1 point)**: 0.9% risk of major cardiac complications
- **Class III (2 points)**: 6.6% risk of major cardiac complications
- **Class IV (≥3 points)**: ≥11% risk of major cardiac complications

#### Helper Function

```typescript
import { isHighRiskSurgery } from 'periop-calculators';

// Check if a surgery type is considered high risk
const isHighRisk = isHighRiskSurgery('aortic aneurysm repair'); // true
const isLowRisk = isHighRiskSurgery('cataract surgery');        // false
```

## API Reference

### Types

#### STOP-BANG Types

```typescript
interface StopBangInput {
  snoring: boolean;
  tiredness: boolean;
  observed: boolean;
  pressure: boolean;
  bmi?: number;
  age?: number;
  neckCircumference?: number;
  gender?: 'male' | 'female';
}

interface StopBangResult {
  score: number;
  risk: 'low' | 'intermediate' | 'high';
  interpretation: string;
  components: {
    S: boolean;  // Snoring
    T: boolean;  // Tiredness
    O: boolean;  // Observed apnea
    P: boolean;  // Pressure (hypertension)
    B: boolean;  // BMI > 35
    A: boolean;  // Age > 50
    N: boolean;  // Neck circumference > 40cm
    G: boolean;  // Gender (male)
  };
  recommendations: string[];
}
```

#### RCRI Types

```typescript
interface RCRIInput {
  highRiskSurgery: boolean;
  ischemicHeartDisease: boolean;
  congestiveHeartFailure: boolean;
  cerebrovascularDisease: boolean;
  insulinDependentDiabetes: boolean;
  renalInsufficiency: boolean;
}

interface RCRIResult {
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
```

### Utility Functions

```typescript
import { calculateBMI } from 'periop-calculators';

const bmi = calculateBMI(80, 175); // weight in kg, height in cm
// Returns: 26.1
```

### 3. Apfel Score for PONV

Predicts risk of postoperative nausea and vomiting (PONV) in adult patients undergoing general anesthesia.

```typescript
import { calculateApfelScore, ApfelScoreInput, ApfelScoreResult } from 'periop-calculators';

const input: ApfelScoreInput = {
  female: true,                   // Female gender
  nonSmoker: true,               // Non-smoking status
  historyOfPONV: false,          // History of PONV or motion sickness
  postoperativeOpioids: true     // Expected postoperative opioid use
};

const result: ApfelScoreResult = calculateApfelScore(input);

console.log(result);
// {
//   score: 3,
//   riskPercentage: 61,
//   risk: 'very-high',
//   interpretation: 'Apfel Score of 3 with 3 risk factors...',
//   riskFactors: { ... },
//   recommendations: [...]
// }
```

#### Risk Stratification

- **0 points**: 10% risk of PONV (low risk)
- **1 point**: 21% risk of PONV (moderate risk)
- **2 points**: 39% risk of PONV (high risk)
- **3 points**: 61% risk of PONV (very high risk)
- **4 points**: 79% risk of PONV (very high risk)

#### Helper Function

```typescript
import { getApfelRiskFactorInfo } from 'periop-calculators';

// Get detailed information about a specific risk factor
const info = getApfelRiskFactorInfo('female');
// Returns: "Female gender is associated with 2-3 times higher risk of PONV compared to males"
```

## Clinical References

### STOP-BANG References
1. Chung F, et al. STOP-Bang Questionnaire: A Tool to Screen Patients for Obstructive Sleep Apnea. Anesthesiology. 2008;108(5):812-821.

2. Chung F, et al. High STOP-Bang score indicates a high probability of obstructive sleep apnoea. Br J Anaesth. 2012;108(5):768-775.

### RCRI References
1. Lee TH, et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation. 1999;100(10):1043-1049.

2. Duceppe E, et al. Canadian Cardiovascular Society Guidelines on Perioperative Cardiac Risk Assessment and Management for Patients Who Undergo Noncardiac Surgery. Can J Cardiol. 2017;33(1):17-32.

### Apfel Score References
1. Apfel CC, et al. A simplified risk score for predicting postoperative nausea and vomiting: conclusions from cross-validations between two centers. Anesthesiology. 1999;91(3):693-700.

2. Apfel CC, et al. Evidence-based analysis of risk factors for postoperative nausea and vomiting. Br J Anaesth. 2012;109(5):742-753.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Run linting
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-calculator`)
3. Commit your changes (`git commit -m 'Add RCRI calculator'`)
4. Push to the branch (`git push origin feature/new-calculator`)
5. Open a Pull Request

## Future Calculators

Planned additions to this package:

- [x] RCRI (Revised Cardiac Risk Index) ✅
- [ ] MELD Score
- [ ] P-POSSUM Score
- [x] Apfel Score for PONV ✅
- [ ] Caprini Score for VTE Risk
- [ ] ASA Physical Status Calculator

## License

MIT © [Syed Haider Hasan Rizvi, MD](https://github.com/rizvimd)

## Author

**Dr. Syed Haider Hasan Rizvi**
- Board-certified anesthesiologist and physician-developer
- Creator of [CoagRX](https://coagrx.com) and PeriopAI
- [GitHub](https://github.com/rizvimd) | [LinkedIn](https://linkedin.com/in/drsyedrizvi)

---

*Built with ❤️ by a physician who codes*