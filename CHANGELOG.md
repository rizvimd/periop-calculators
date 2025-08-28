# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-01-28

### Added
- **MELD Score Calculator**: New Model for End-Stage Liver Disease scoring system
  - Assesses liver disease severity and predicts 3-month mortality
  - Supports bilirubin, creatinine, INR, and dialysis status inputs
  - Provides risk stratification: Low (6-9), Moderate (10-19), High (20-29), Very High (30-40)
  - Includes comprehensive clinical recommendations based on risk level
  - Helper functions: `isHighRiskMELD()` and `getMELDRiskCategory()`
  - Full TypeScript support with `MELDScoreInput` and `MELDScoreResult` interfaces
  - Extensive test coverage with 23 additional test cases including clinical scenarios

### Documentation
- Updated README.md with comprehensive MELD Score documentation
- Added MELD Score API reference and TypeScript interfaces
- Included clinical references (Kamath et al., Wiesner et al., Teh et al.)
- Updated roadmap to reflect MELD Score completion

### Technical
- Enhanced error handling and input validation for laboratory values
- Added boundary checking for extreme values (bilirubin >50, creatinine >15, INR >10)
- Optimized test suite performance and reliability

## [1.2.1] - 2025-01-08

### Fixed
- Fixed TypeScript error handling with proper CalculatorError class implementation
- Improved error messages for better debugging experience

### Documentation
- Updated README.md with comprehensive Apfel Score documentation
- Added clinical references for all three calculators

## [1.2.0] - 2025-01-08

### Added
- **Apfel Score for PONV Calculator**: New evidence-based calculator for predicting postoperative nausea and vomiting
  - Evaluates 4 risk factors: female gender, non-smoking status, history of PONV/motion sickness, postoperative opioid use
  - Provides risk stratification from 10% (low) to 79% (very high)
  - Includes evidence-based recommendations based on risk level
  - Helper function `getApfelRiskFactorInfo()` for detailed risk factor information
- Comprehensive test suite for Apfel Score with 15+ test cases
- Demo files for testing and integration examples:
  - `demo.js` - Node.js usage examples
  - `demo-simple.html` - Browser usage example
  - `demo-server.js` - Express.js server integration example

### Enhanced
- Extended TypeScript type definitions for Apfel Score
- Improved error handling across all calculators
- Added comprehensive clinical references to README

### Clinical Reference
- Based on Apfel CC, et al. "A simplified risk score for predicting postoperative nausea and vomiting" (Anesthesiology 1999)

## [1.1.0] - 2024-12-15

### Added
- **RCRI (Revised Cardiac Risk Index) Calculator**: Evidence-based cardiac risk assessment for non-cardiac surgery
  - Evaluates 6 risk factors: high-risk surgery, ischemic heart disease, CHF, cerebrovascular disease, insulin-dependent diabetes, renal insufficiency
  - Provides risk classification (Class I-IV) with percentage risk estimates
  - Includes detailed clinical recommendations based on risk class
  - Helper function `isHighRiskSurgery()` for surgery classification
- Comprehensive test suite for RCRI calculator
- Enhanced TypeScript type definitions
- Improved documentation with clinical references

### Enhanced
- Better error handling and validation across all calculators
- Expanded README with detailed RCRI usage examples
- Added clinical references section

### Clinical Reference
- Based on Lee TH, et al. "Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery" (Circulation 1999)

## [1.0.0] - 2024-11-20

### Added
- **STOP-BANG Calculator**: Validated screening tool for obstructive sleep apnea in surgical patients
  - 8-component assessment: Snoring, Tiredness, Observed apnea, Pressure (HTN), BMI, Age, Neck circumference, Gender
  - Risk stratification: Low (0-2), Intermediate (3-4), High (5-8)
  - Support for both direct input and calculated demographics (BMI from height/weight)
  - Clinical recommendations based on risk level
- TypeScript support with comprehensive type definitions
- Utility functions: `calculateBMI()`, `calculateStopBangScore()`
- Jest test suite with extensive coverage
- Rollup build system for CommonJS and ES modules
- MIT license
- Complete documentation with clinical references

### Technical Features
- Zero external dependencies
- Works in Node.js and browser environments
- TypeScript declarations included
- ESLint and Prettier configuration
- Automated testing with GitHub Actions (planned)

### Clinical Reference
- Based on Chung F, et al. "STOP-Bang Questionnaire: A Tool to Screen Patients for Obstructive Sleep Apnea" (Anesthesiology 2008)

## Development Guidelines

### Version Numbers
- **Major** (X.0.0): Breaking changes, new calculator architecture
- **Minor** (0.X.0): New calculators, new features, non-breaking API additions
- **Patch** (0.0.X): Bug fixes, documentation updates, performance improvements

### Release Process
1. Update version in `package.json`
2. Update this CHANGELOG.md
3. Run tests: `npm test`
4. Build package: `npm run build`
5. Create git tag: `git tag v1.2.1`
6. Publish to npm: `npm publish`
7. Push to GitHub: `git push origin main --tags`

---

*This project is maintained by Dr. Syed Haider Hasan Rizvi, MD - Board-certified anesthesiologist and physician-developer*