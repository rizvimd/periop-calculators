# Contributing to periop-calculators

Thank you for your interest in contributing to periop-calculators! This project aims to provide evidence-based perioperative risk assessment tools for healthcare professionals.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Adding New Calculators](#adding-new-calculators)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Clinical Validation Requirements](#clinical-validation-requirements)

## Code of Conduct

This project is used in healthcare settings. All contributions must prioritize patient safety and clinical accuracy. Contributors are expected to:

- Provide evidence-based implementations with proper clinical references
- Thoroughly test all calculations against published literature
- Maintain professional, respectful communication
- Follow established coding standards and best practices

## Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- Git
- TypeScript knowledge
- Understanding of clinical medicine (for calculator contributions)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/periop-calculators.git
   cd periop-calculators
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Build Project**
   ```bash
   npm run build
   ```

5. **Run Development Scripts**
   ```bash
   npm run test:watch    # Watch mode for testing
   npm run lint          # ESLint checking
   npm run format        # Prettier formatting
   ```

## Adding New Calculators

### 1. Research and Planning

Before implementing a new calculator:

- **Clinical Validation**: Ensure the calculator is based on peer-reviewed, published research
- **Evidence Quality**: Prefer calculators with external validation studies
- **Clinical Utility**: Confirm the calculator addresses a real clinical need
- **Implementation Feasibility**: Verify all required inputs can be reasonably obtained

### 2. File Structure

Create the following files for a new calculator (example: "meld"):

```
src/
├── calculators/
│   ├── meld.ts                    # Main calculator implementation
│   └── __tests__/
│       └── meld.test.ts          # Comprehensive test suite
├── types/
│   └── index.ts                  # Add MELDInput, MELDResult types
```

### 3. Calculator Implementation Template

```typescript
// src/calculators/example.ts
import { ExampleInput, ExampleResult } from '../types';
import { CalculatorError } from '../utils/errors';

/**
 * Brief description of what this calculator does
 * @param input - Patient data for calculation
 * @returns Result with risk assessment and recommendations
 * @throws {CalculatorError} If input validation fails
 * 
 * @example
 * ```typescript
 * const result = calculateExample({
 *   factor1: true,
 *   factor2: 25
 * });
 * ```
 * 
 * @clinical_reference
 * Author A, et al. "Title of primary paper". Journal. Year;Volume(Issue):Pages.
 */
export function calculateExample(input: ExampleInput): ExampleResult {
  // 1. Input validation
  if (!input || typeof input !== 'object') {
    throw new CalculatorError('Invalid input: ExampleInput object required');
  }

  // 2. Validate each required field with specific error messages
  
  // 3. Calculate score using published algorithm
  
  // 4. Determine risk category/interpretation
  
  // 5. Generate clinical recommendations
  
  // 6. Return structured result
  return {
    score,
    risk,
    interpretation,
    riskFactors: { ... },
    recommendations: [...]
  };
}
```

### 4. Type Definitions

Add types to `src/types/index.ts`:

```typescript
export interface ExampleInput {
  factor1: boolean;
  factor2: number;
  // ... other factors with JSDoc comments
}

export interface ExampleResult {
  score: number;
  risk: 'low' | 'moderate' | 'high';
  interpretation: string;
  riskFactors: ExampleInput;
  recommendations: string[];
}
```

### 5. Export in Index

Update `src/index.ts`:

```typescript
export { calculateExample } from './calculators/example';
export type { ExampleInput, ExampleResult } from './types';
```

## Testing Guidelines

### Test Requirements

Every calculator must have comprehensive tests covering:

1. **Valid Inputs**: Test all valid combinations and edge cases
2. **Invalid Inputs**: Test input validation and error handling
3. **Boundary Conditions**: Test minimum/maximum values
4. **Clinical Scenarios**: Test real-world patient scenarios
5. **Literature Validation**: Test cases from original papers

### Test Structure

```typescript
// src/calculators/__tests__/example.test.ts
import { calculateExample } from '../example';
import { CalculatorError } from '../../utils/errors';

describe('calculateExample', () => {
  describe('input validation', () => {
    // Test invalid inputs
  });

  describe('score calculation', () => {
    // Test score calculation accuracy
  });

  describe('risk stratification', () => {
    // Test risk categories
  });

  describe('clinical scenarios', () => {
    // Test realistic patient cases
  });

  describe('literature validation', () => {
    // Test cases from published papers
  });
});
```

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

## Documentation Standards

### 1. Code Documentation

- Use JSDoc comments for all public functions
- Include `@param`, `@returns`, `@throws`, `@example`, and `@clinical_reference` tags
- Provide clear, concise descriptions

### 2. README Updates

When adding a calculator, update the README with:

- Calculator description and clinical use case
- Complete usage example with TypeScript types
- Risk stratification table
- Clinical references (minimum 2 peer-reviewed papers)
- Helper functions (if applicable)

### 3. Clinical References

All calculators must include:

- Primary derivation paper
- At least one validation study
- Recent review or guideline reference (if available)
- Proper citation format: Author(s). Title. Journal. Year;Volume(Issue):Pages.

## Pull Request Process

### 1. Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] Code follows ESLint rules (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated
- [ ] Clinical references are verified

### 2. PR Description Template

```markdown
## Description
Brief description of the calculator and its clinical use.

## Clinical Validation
- [ ] Based on peer-reviewed research
- [ ] Implementation matches published algorithm
- [ ] Test cases include literature examples
- [ ] Clinical references verified

## Technical Changes
- [ ] New calculator implementation
- [ ] Comprehensive test suite
- [ ] Type definitions added
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Clinical References
1. Primary paper: [Citation]
2. Validation study: [Citation]
3. Additional references: [Citations]

## Test Results
```
npm test output showing all tests pass
```
```

### 3. Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: Focus on clinical accuracy and code quality
3. **Clinical Review**: Medical accuracy verification (when possible)
4. **Documentation Review**: Completeness and clarity

## Clinical Validation Requirements

### Evidence Standards

- **Level 1**: Systematic reviews, meta-analyses, randomized controlled trials
- **Level 2**: Prospective cohort studies, validation studies
- **Level 3**: Retrospective studies, case series

### Minimum Requirements

1. **Primary Derivation Study**: Original paper deriving the calculator
2. **Validation Study**: Independent validation in different population
3. **Recent Citation**: Publication within last 10 years (preferred)

### Implementation Accuracy

- Algorithm must exactly match published methodology
- Scoring systems must use identical point values
- Risk stratification must match original thresholds
- Recommendations should align with current clinical guidelines

## Getting Help

### Questions or Issues

- **Clinical Questions**: Open an issue with "clinical" label
- **Technical Questions**: Open an issue with "technical" label
- **Documentation**: Open an issue with "documentation" label

### Contact

- **Project Maintainer**: Dr. Syed Haider Hasan Rizvi, MD
- **GitHub**: [@rizvimd](https://github.com/rizvimd)
- **Email**: srizvi.srizvi@gmail.com

### Resources

- [Clinical Calculator Guidelines](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3789163/)
- [Medical Software Development Best Practices](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/software-medical-device-samd-clinical-evaluation)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

*Thank you for contributing to evidence-based perioperative care!*

**Remember**: This software is intended for educational and research purposes. Always verify calculations independently and follow institutional protocols for patient care decisions.