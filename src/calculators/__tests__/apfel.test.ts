import { calculateApfelScore, getApfelRiskFactorInfo } from '../apfel';
import { ApfelScoreInput } from '../../types';

describe('calculateApfelScore', () => {
  // Test valid inputs with all combinations
  describe('Valid Inputs', () => {
    test('should calculate score 0 - no risk factors', () => {
      const input: ApfelScoreInput = {
        female: false,
        nonSmoker: false,
        historyOfPONV: false,
        postoperativeOpioids: false
      };
      
      const result = calculateApfelScore(input);
      
      expect(result.score).toBe(0);
      expect(result.riskPercentage).toBe(10);
      expect(result.risk).toBe('low');
      expect(result.interpretation).toContain('Apfel Score of 0');
      expect(result.interpretation).toContain('10%');
      expect(result.recommendations).toContain('Low risk patient - routine PONV prophylaxis may not be necessary');
    });

    test('should calculate score 1 - one risk factor (female)', () => {
      const input: ApfelScoreInput = {
        female: true,
        nonSmoker: false,
        historyOfPONV: false,
        postoperativeOpioids: false
      };
      
      const result = calculateApfelScore(input);
      
      expect(result.score).toBe(1);
      expect(result.riskPercentage).toBe(21);
      expect(result.risk).toBe('moderate');
      expect(result.interpretation).toContain('1 risk factor');
      expect(result.recommendations).toContain('Consider single-agent PONV prophylaxis');
    });

    test('should calculate score 2 - two risk factors', () => {
      const input: ApfelScoreInput = {
        female: true,
        nonSmoker: true,
        historyOfPONV: false,
        postoperativeOpioids: false
      };
      
      const result = calculateApfelScore(input);
      
      expect(result.score).toBe(2);
      expect(result.riskPercentage).toBe(39);
      expect(result.risk).toBe('high');
      expect(result.interpretation).toContain('2 risk factors');
      expect(result.recommendations).toContain('Recommend dual-agent PONV prophylaxis');
    });

    test('should calculate score 3 - three risk factors', () => {
      const input: ApfelScoreInput = {
        female: true,
        nonSmoker: true,
        historyOfPONV: true,
        postoperativeOpioids: false
      };
      
      const result = calculateApfelScore(input);
      
      expect(result.score).toBe(3);
      expect(result.riskPercentage).toBe(61);
      expect(result.risk).toBe('very-high');
      expect(result.interpretation).toContain('3 risk factors');
      expect(result.recommendations).toContain('High-risk patient - recommend multimodal PONV prophylaxis');
    });

    test('should calculate score 4 - all risk factors', () => {
      const input: ApfelScoreInput = {
        female: true,
        nonSmoker: true,
        historyOfPONV: true,
        postoperativeOpioids: true
      };
      
      const result = calculateApfelScore(input);
      
      expect(result.score).toBe(4);
      expect(result.riskPercentage).toBe(79);
      expect(result.risk).toBe('very-high');
      expect(result.interpretation).toContain('4 risk factors');
      expect(result.recommendations).toContain('High-risk patient - recommend multimodal PONV prophylaxis');
      expect(result.recommendations).toContain('Consider regional anesthesia or non-opioid analgesics to reduce opioid requirements');
    });
  });

  // Test edge cases and validation
  describe('Validation and Edge Cases', () => {
    test('should throw error for null input', () => {
      expect(() => calculateApfelScore(null as any)).toThrow('Invalid input: ApfelScoreInput object required');
    });

    test('should throw error for undefined input', () => {
      expect(() => calculateApfelScore(undefined as any)).toThrow('Invalid input: ApfelScoreInput object required');
    });

    test('should throw error for non-object input', () => {
      expect(() => calculateApfelScore('invalid' as any)).toThrow('Invalid input: ApfelScoreInput object required');
    });

    test('should throw error for missing boolean fields', () => {
      const input: any = {
        female: true,
        nonSmoker: true,
        historyOfPONV: true
        // missing postoperativeOpioids
      };
      
      expect(() => calculateApfelScore(input)).toThrow('Invalid input: postoperativeOpioids must be a boolean value');
    });

    test('should throw error for non-boolean field values', () => {
      const input: any = {
        female: 'yes',
        nonSmoker: true,
        historyOfPONV: false,
        postoperativeOpioids: false
      };
      
      expect(() => calculateApfelScore(input)).toThrow('Invalid input: female must be a boolean value');
    });
  });

  // Test specific scenarios
  describe('Clinical Scenarios', () => {
    test('should handle male patient with opioids', () => {
      const input: ApfelScoreInput = {
        female: false,
        nonSmoker: true,
        historyOfPONV: false,
        postoperativeOpioids: true
      };
      
      const result = calculateApfelScore(input);
      
      expect(result.score).toBe(2);
      expect(result.riskFactors.female).toBe(false);
      expect(result.riskFactors.nonSmoker).toBe(true);
      expect(result.riskFactors.postoperativeOpioids).toBe(true);
    });

    test('should handle female smoker with history', () => {
      const input: ApfelScoreInput = {
        female: true,
        nonSmoker: false,
        historyOfPONV: true,
        postoperativeOpioids: false
      };
      
      const result = calculateApfelScore(input);
      
      expect(result.score).toBe(2);
      expect(result.risk).toBe('high');
    });
  });

  // Test recommendation logic
  describe('Recommendations', () => {
    test('should always include general recommendations', () => {
      const input: ApfelScoreInput = {
        female: false,
        nonSmoker: false,
        historyOfPONV: false,
        postoperativeOpioids: false
      };
      
      const result = calculateApfelScore(input);
      
      expect(result.recommendations).toContain('Monitor for PONV in PACU and postoperative period');
      expect(result.recommendations).toContain('Have rescue antiemetics readily available');
    });

    test('should include opioid-specific recommendations when applicable', () => {
      const input: ApfelScoreInput = {
        female: true,
        nonSmoker: true,
        historyOfPONV: true,
        postoperativeOpioids: true
      };
      
      const result = calculateApfelScore(input);
      
      const opioidRec = result.recommendations.find(rec => 
        rec.includes('regional anesthesia') && rec.includes('opioid')
      );
      expect(opioidRec).toBeDefined();
    });
  });
});

describe('getApfelRiskFactorInfo', () => {
  test('should return correct info for female factor', () => {
    const info = getApfelRiskFactorInfo('female');
    expect(info).toContain('Female gender');
    expect(info).toContain('2-3 times higher risk');
  });

  test('should return correct info for nonSmoker factor', () => {
    const info = getApfelRiskFactorInfo('nonSmoker');
    expect(info).toContain('Non-smoking status');
    expect(info).toContain('nicotine');
  });

  test('should return correct info for historyOfPONV factor', () => {
    const info = getApfelRiskFactorInfo('historyOfPONV');
    expect(info).toContain('Previous PONV');
    expect(info).toContain('motion sickness');
  });

  test('should return correct info for postoperativeOpioids factor', () => {
    const info = getApfelRiskFactorInfo('postoperativeOpioids');
    expect(info).toContain('opioid');
    expect(info).toContain('dose-dependent');
  });

  test('should handle unknown factor gracefully', () => {
    const info = getApfelRiskFactorInfo('unknown' as any);
    expect(info).toBe('Unknown risk factor');
  });
});