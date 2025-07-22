import { calculateStopBang, calculateStopBangScore } from '../stop-bang';
import { StopBangInput, PatientDemographics } from '../../types';

describe('STOP-BANG Calculator', () => {
  // This is a "describe block" - it groups related tests together
  // Think of it like organizing a surgical tray - similar instruments together

  describe('calculateStopBang', () => {
    // Test the "happy path" - when everything works correctly
    it('should calculate low risk score correctly', () => {
      // "it" describes what the test is checking
      // Good test names read like sentences: "it should..."
      
      const input: StopBangInput = {
        snoring: false,
        tiredness: false,
        observed: false,
        pressure: false,
        bmi: 25,
        age: 45,
        neckCircumference: 38,
        gender: 'female',
      };

      const result = calculateStopBang(input);
      
      // These are "assertions" - we check if the output matches expectations
      expect(result.score).toBe(0);
      expect(result.risk).toBe('low');
      expect(result.components.B).toBe(false); // BMI not > 35
      expect(result.components.A).toBe(false); // Age not > 50
    });

    it('should calculate high risk score correctly', () => {
      const input: StopBangInput = {
        snoring: true,
        tiredness: true,
        observed: true,
        pressure: true,
        bmi: 40,
        age: 60,
        neckCircumference: 45,
        gender: 'male',
      };

      const result = calculateStopBang(input);
      
      expect(result.score).toBe(8); // All criteria met
      expect(result.risk).toBe('high');
      
      // Check all components are true
      Object.values(result.components).forEach(component => {
        expect(component).toBe(true);
      });
    });

    // Edge case testing - what happens at boundaries?
    it('should handle edge cases for BMI threshold', () => {
      // Test right at the boundary (BMI = 35)
      const inputAtThreshold: StopBangInput = {
        snoring: false,
        tiredness: false,
        observed: false,
        pressure: false,
        bmi: 35, // Exactly at threshold
        age: 30,
        gender: 'female',
      };

      const resultAt = calculateStopBang(inputAtThreshold);
      expect(resultAt.components.B).toBe(false); // 35 is not > 35

      // Just above threshold
      const inputAbove = { ...inputAtThreshold, bmi: 35.1 };
      const resultAbove = calculateStopBang(inputAbove);
      expect(resultAbove.components.B).toBe(true); // 35.1 is > 35
    });

    // Testing with demographics - shows function flexibility
    it('should use demographics when individual values not provided', () => {
      const input: StopBangInput = {
        snoring: true,
        tiredness: true,
        observed: false,
        pressure: true,
        // Notice: no age, bmi, or gender provided
      };

      const demographics: PatientDemographics = {
        age: 55,
        sex: 'male',
        weight: 100, // kg
        height: 170, // cm
        neckCircumference: 42,
      };

      const result = calculateStopBang(input, demographics);
      
      // Should calculate BMI from weight/height
      const expectedBMI = 100 / (1.7 * 1.7); // ~34.6
      expect(result.components.B).toBe(false); // Not > 35
      expect(result.components.A).toBe(true); // Age 55 > 50
      expect(result.components.G).toBe(true); // Male
    });

    // Error handling - what happens when things go wrong?
    it('should throw error for missing required fields', () => {
      const invalidInput: StopBangInput = {
        snoring: true,
        tiredness: true,
        observed: false,
        pressure: false,
        // Missing age, BMI, and gender
      };

      // We expect this to throw an error
      expect(() => calculateStopBang(invalidInput)).toThrow(
        'Validation errors: Age is required'
      );
    });

    it('should validate age appropriately', () => {
      const inputWithChildAge: StopBangInput = {
        snoring: true,
        tiredness: false,
        observed: false,
        pressure: false,
        age: 10, // Too young
        bmi: 25,
        gender: 'male',
      };

      expect(() => calculateStopBang(inputWithChildAge)).toThrow(
        'STOP-BANG is validated for adults 18 years and older'
      );
    });

    // Testing the recommendations engine
    it('should provide appropriate recommendations for each risk level', () => {
      // Low risk
      const lowRiskInput: StopBangInput = {
        snoring: true,
        tiredness: false,
        observed: false,
        pressure: false,
        age: 30,
        bmi: 25,
        gender: 'female',
      };
      const lowResult = calculateStopBang(lowRiskInput);
      expect(lowResult.recommendations).toContain(
        'Proceed with standard anesthetic care'
      );

      // High risk
      const highRiskInput: StopBangInput = {
        snoring: true,
        tiredness: true,
        observed: true,
        pressure: true,
        age: 60,
        bmi: 40,
        gender: 'male',
      };
      const highResult = calculateStopBang(highRiskInput);
      expect(highResult.recommendations).toContain(
        'Consider regional anesthesia when appropriate'
      );
      expect(highResult.recommendations).toContain(
        'Have difficult airway equipment readily available'
      );
    });
  });

  describe('calculateStopBangScore', () => {
    // Testing the simplified version
    it('should return just the numeric score', () => {
      const input: StopBangInput = {
        snoring: true,
        tiredness: true,
        observed: false,
        pressure: true,
        age: 55,
        bmi: 30,
        gender: 'male',
      };

      const score = calculateStopBangScore(input);
      expect(typeof score).toBe('number');
      expect(score).toBe(5); // S, T, P, A, G = 5 points
    });
  });
});