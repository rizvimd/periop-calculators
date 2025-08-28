import { calculateMELDScore, isHighRiskMELD, getMELDRiskCategory } from '../meld';
import { MELDScoreInput } from '../../types';
import { CalculatorError } from '../../utils/errors';

describe('MELD Score Calculator', () => {
  describe('calculateMELDScore', () => {
    it('should calculate MELD score correctly for standard case', () => {
      const input: MELDScoreInput = {
        bilirubin: 2.5,
        creatinine: 1.8,
        inr: 1.6,
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.score).toBeCloseTo(21, 0); // MELD score should be around 21
      expect(result.risk).toBe('high');
      expect(result.mortalityPercentage).toBe(19.6);
      expect(result.mortalityRisk).toBe('19.6%');
      expect(result.labValues).toEqual({
        bilirubin: 2.5,
        creatinine: 1.8,
        inr: 1.6,
        dialysis: false
      });
      expect(result.recommendations).toContain('Document MELD score in preoperative assessment');
    });

    it('should handle minimum values correctly', () => {
      const input: MELDScoreInput = {
        bilirubin: 0.5, // Below minimum, should be capped at 1.0
        creatinine: 0.8, // Below minimum, should be capped at 1.0
        inr: 0.9, // Below minimum, should be capped at 1.0
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.score).toBe(6); // Minimum MELD score
      expect(result.risk).toBe('low');
      expect(result.mortalityPercentage).toBe(1.9);
    });

    it('should handle maximum values correctly', () => {
      const input: MELDScoreInput = {
        bilirubin: 10.0, // Above maximum, should be capped at 4.0
        creatinine: 8.0, // Above maximum, should be capped at 4.0
        inr: 6.0, // Above maximum, should be capped at 4.0
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.score).toBeLessThanOrEqual(40); // Maximum MELD score
      expect(result.score).toBeGreaterThanOrEqual(6); // Minimum MELD score
    });

    it('should handle dialysis correctly', () => {
      const input: MELDScoreInput = {
        bilirubin: 2.0,
        creatinine: 1.5,
        inr: 2.0,
        dialysis: true
      };

      const result = calculateMELDScore(input);
      
      // When dialysis is true, creatinine should be treated as 4.0
      expect(result.labValues.dialysis).toBe(true);
      expect(result.recommendations).toContain('Patient on dialysis - coordinate timing with nephrology team');
    });

    it('should calculate low risk scenario correctly', () => {
      const input: MELDScoreInput = {
        bilirubin: 1.2,
        creatinine: 1.0,
        inr: 1.1,
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.risk).toBe('low');
      expect(result.score).toBeLessThanOrEqual(9);
      expect(result.recommendations).toContain('Low surgical risk - proceed with standard perioperative care');
    });

    it('should calculate moderate risk scenario correctly', () => {
      const input: MELDScoreInput = {
        bilirubin: 1.5,
        creatinine: 1.2,
        inr: 1.3,
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.risk).toBe('moderate');
      expect(result.score).toBeGreaterThan(9);
      expect(result.score).toBeLessThanOrEqual(19);
      expect(result.recommendations).toContain('Moderate surgical risk - optimize liver function before elective surgery');
    });

    it('should calculate high risk scenario (score 20) correctly', () => {
      const input: MELDScoreInput = {
        bilirubin: 2.0,
        creatinine: 1.5,
        inr: 1.8,
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.risk).toBe('high'); // Score 20 is high risk
      expect(result.score).toBe(20);
      expect(result.recommendations).toContain('High surgical risk - multidisciplinary evaluation recommended');
    });

    it('should calculate high risk scenario correctly', () => {
      const input: MELDScoreInput = {
        bilirubin: 3.5,
        creatinine: 2.8,
        inr: 2.8,
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.risk).toBe('very-high'); // Score 33 is very high risk
      expect(result.score).toBe(33);
      expect(result.recommendations).toContain('Very high surgical risk - surgery should be avoided unless life-threatening');
    });

    it('should calculate very high risk scenario correctly', () => {
      const input: MELDScoreInput = {
        bilirubin: 4.0,
        creatinine: 4.0,
        inr: 4.0,
        dialysis: true
      };

      const result = calculateMELDScore(input);
      
      expect(result.risk).toBe('very-high');
      expect(result.score).toBeGreaterThan(29);
      expect(result.mortalityPercentage).toBe(52.6);
      expect(result.recommendations).toContain('Very high surgical risk - surgery should be avoided unless life-threatening');
    });

    it('should provide specific recommendations for elevated values', () => {
      const input: MELDScoreInput = {
        bilirubin: 3.5, // > 3.0
        creatinine: 2.5, // > 2.0
        inr: 2.5, // > 2.0
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.recommendations).toContain('Elevated bilirubin - investigate for biliary obstruction or worsening liver function');
      expect(result.recommendations).toContain('Significantly elevated INR - consider vitamin K, FFP, or PCC for procedural correction');
      expect(result.recommendations).toContain('Renal dysfunction present - avoid nephrotoxic agents and monitor fluid balance');
    });

    describe('Input validation', () => {
      it('should throw error for invalid input object', () => {
        expect(() => calculateMELDScore(null as any)).toThrow(CalculatorError);
        expect(() => calculateMELDScore(undefined as any)).toThrow(CalculatorError);
        expect(() => calculateMELDScore('invalid' as any)).toThrow(CalculatorError);
      });

      it('should throw error for invalid bilirubin', () => {
        const invalidInputs = [
          { bilirubin: -1, creatinine: 1.0, inr: 1.0 },
          { bilirubin: 0, creatinine: 1.0, inr: 1.0 },
          { bilirubin: 'invalid' as any, creatinine: 1.0, inr: 1.0 },
          { bilirubin: 100, creatinine: 1.0, inr: 1.0 }, // Too high
        ];

        invalidInputs.forEach(input => {
          expect(() => calculateMELDScore(input)).toThrow(CalculatorError);
        });
      });

      it('should throw error for invalid creatinine', () => {
        const invalidInputs = [
          { bilirubin: 1.0, creatinine: -1, inr: 1.0 },
          { bilirubin: 1.0, creatinine: 0, inr: 1.0 },
          { bilirubin: 1.0, creatinine: 'invalid' as any, inr: 1.0 },
          { bilirubin: 1.0, creatinine: 20, inr: 1.0 }, // Too high
        ];

        invalidInputs.forEach(input => {
          expect(() => calculateMELDScore(input)).toThrow(CalculatorError);
        });
      });

      it('should throw error for invalid INR', () => {
        const invalidInputs = [
          { bilirubin: 1.0, creatinine: 1.0, inr: -1 },
          { bilirubin: 1.0, creatinine: 1.0, inr: 0 },
          { bilirubin: 1.0, creatinine: 1.0, inr: 'invalid' as any },
          { bilirubin: 1.0, creatinine: 1.0, inr: 15 }, // Too high
        ];

        invalidInputs.forEach(input => {
          expect(() => calculateMELDScore(input)).toThrow(CalculatorError);
        });
      });

      it('should throw error for invalid dialysis flag', () => {
        const input = {
          bilirubin: 1.0,
          creatinine: 1.0,
          inr: 1.0,
          dialysis: 'invalid' as any
        };

        expect(() => calculateMELDScore(input)).toThrow(CalculatorError);
      });
    });

    describe('Edge cases', () => {
      it('should handle dialysis undefined correctly', () => {
        const input: MELDScoreInput = {
          bilirubin: 2.0,
          creatinine: 1.5,
          inr: 1.8
          // dialysis is undefined
        };

        const result = calculateMELDScore(input);
        
        expect(result.labValues.dialysis).toBe(false);
        expect(() => calculateMELDScore(input)).not.toThrow();
      });

      it('should return consistent results for same input', () => {
        const input: MELDScoreInput = {
          bilirubin: 2.0,
          creatinine: 1.5,
          inr: 1.8,
          dialysis: false
        };

        const result1 = calculateMELDScore(input);
        const result2 = calculateMELDScore(input);
        
        expect(result1.score).toBe(result2.score);
        expect(result1.risk).toBe(result2.risk);
        expect(result1.mortalityPercentage).toBe(result2.mortalityPercentage);
      });

      it('should have proper interpretation strings', () => {
        const input: MELDScoreInput = {
          bilirubin: 2.0,
          creatinine: 1.5,
          inr: 1.8,
          dialysis: false
        };

        const result = calculateMELDScore(input);
        
        expect(result.interpretation).toContain(`MELD score of ${result.score}`);
        expect(result.interpretation).toContain(result.risk.replace('-', ' '));
        expect(result.interpretation).toContain(`${result.mortalityPercentage}%`);
      });
    });
  });

  describe('Helper functions', () => {
    describe('isHighRiskMELD', () => {
      it('should identify high risk scores correctly', () => {
        expect(isHighRiskMELD(19)).toBe(false);
        expect(isHighRiskMELD(20)).toBe(true);
        expect(isHighRiskMELD(25)).toBe(true);
        expect(isHighRiskMELD(40)).toBe(true);
      });
    });

    describe('getMELDRiskCategory', () => {
      it('should return correct risk categories', () => {
        expect(getMELDRiskCategory(6)).toBe('low');
        expect(getMELDRiskCategory(9)).toBe('low');
        expect(getMELDRiskCategory(10)).toBe('moderate');
        expect(getMELDRiskCategory(19)).toBe('moderate');
        expect(getMELDRiskCategory(20)).toBe('high');
        expect(getMELDRiskCategory(29)).toBe('high');
        expect(getMELDRiskCategory(30)).toBe('very-high');
        expect(getMELDRiskCategory(40)).toBe('very-high');
      });
    });
  });

  describe('Clinical scenarios', () => {
    it('should handle compensated cirrhosis scenario', () => {
      const input: MELDScoreInput = {
        bilirubin: 1.8,
        creatinine: 1.2,
        inr: 1.4,
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.score).toBeGreaterThanOrEqual(6);
      expect(result.score).toBeLessThan(20); // Should be low to moderate risk
      expect(result.recommendations.length).toBeGreaterThan(5);
    });

    it('should handle decompensated cirrhosis scenario', () => {
      const input: MELDScoreInput = {
        bilirubin: 4.0,
        creatinine: 3.2,
        inr: 3.5,
        dialysis: false
      };

      const result = calculateMELDScore(input);
      
      expect(result.score).toBeGreaterThan(25);
      expect(['high', 'very-high']).toContain(result.risk);
      expect(result.recommendations).toContain('Urgent liver transplant evaluation indicated');
    });

    it('should handle hepatorenal syndrome scenario', () => {
      const input: MELDScoreInput = {
        bilirubin: 3.8,
        creatinine: 4.0,
        inr: 2.8,
        dialysis: true
      };

      const result = calculateMELDScore(input);
      
      expect(result.score).toBeGreaterThan(30);
      expect(result.risk).toBe('very-high');
      expect(result.recommendations).toContain('Patient on dialysis - coordinate timing with nephrology team');
      expect(result.recommendations).toContain('Urgent liver transplant evaluation indicated');
    });
  });
});