import { calculateRCRI, isHighRiskSurgery, RCRIInput, RCRIResult } from '../rcri';

describe('RCRI Calculator', () => {
  describe('calculateRCRI', () => {
    it('should calculate score 0 for no risk factors', () => {
      const input: RCRIInput = {
        highRiskSurgery: false,
        ischemicHeartDisease: false,
        congestiveHeartFailure: false,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: false,
        renalInsufficiency: false
      };

      const result = calculateRCRI(input);

      expect(result.score).toBe(0);
      expect(result.riskClass).toBe('I');
      expect(result.estimatedRisk).toBe('0.4%');
      expect(result.riskPercentage).toBe(0.4);
      expect(result.interpretation).toContain('very low cardiac risk');
    });

    it('should calculate score 1 for one risk factor', () => {
      const input: RCRIInput = {
        highRiskSurgery: true,
        ischemicHeartDisease: false,
        congestiveHeartFailure: false,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: false,
        renalInsufficiency: false
      };

      const result = calculateRCRI(input);

      expect(result.score).toBe(1);
      expect(result.riskClass).toBe('II');
      expect(result.estimatedRisk).toBe('0.9%');
      expect(result.riskPercentage).toBe(0.9);
      expect(result.interpretation).toContain('low cardiac risk');
    });

    it('should calculate score 2 for two risk factors', () => {
      const input: RCRIInput = {
        highRiskSurgery: true,
        ischemicHeartDisease: true,
        congestiveHeartFailure: false,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: false,
        renalInsufficiency: false
      };

      const result = calculateRCRI(input);

      expect(result.score).toBe(2);
      expect(result.riskClass).toBe('III');
      expect(result.estimatedRisk).toBe('6.6%');
      expect(result.riskPercentage).toBe(6.6);
      expect(result.interpretation).toContain('intermediate cardiac risk');
    });

    it('should calculate score 3 for three risk factors', () => {
      const input: RCRIInput = {
        highRiskSurgery: true,
        ischemicHeartDisease: true,
        congestiveHeartFailure: true,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: false,
        renalInsufficiency: false
      };

      const result = calculateRCRI(input);

      expect(result.score).toBe(3);
      expect(result.riskClass).toBe('IV');
      expect(result.estimatedRisk).toBe('≥11%');
      expect(result.riskPercentage).toBe(11);
      expect(result.interpretation).toContain('high cardiac risk');
    });

    it('should calculate maximum score 6 for all risk factors', () => {
      const input: RCRIInput = {
        highRiskSurgery: true,
        ischemicHeartDisease: true,
        congestiveHeartFailure: true,
        cerebrovascularDisease: true,
        insulinDependentDiabetes: true,
        renalInsufficiency: true
      };

      const result = calculateRCRI(input);

      expect(result.score).toBe(6);
      expect(result.riskClass).toBe('IV');
      expect(result.estimatedRisk).toBe('≥11%');
      expect(result.riskPercentage).toBe(11);
      expect(result.interpretation).toContain('6 risk factors');
    });

    it('should correctly track individual risk factors', () => {
      const input: RCRIInput = {
        highRiskSurgery: true,
        ischemicHeartDisease: false,
        congestiveHeartFailure: true,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: true,
        renalInsufficiency: false
      };

      const result = calculateRCRI(input);

      expect(result.riskFactors).toEqual({
        highRiskSurgery: true,
        ischemicHeartDisease: false,
        congestiveHeartFailure: true,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: true,
        renalInsufficiency: false
      });
    });

    it('should provide appropriate recommendations for low risk', () => {
      const input: RCRIInput = {
        highRiskSurgery: false,
        ischemicHeartDisease: false,
        congestiveHeartFailure: false,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: false,
        renalInsufficiency: false
      };

      const result = calculateRCRI(input);

      expect(result.recommendations).toContain('Proceed with surgery with standard perioperative care');
      expect(result.recommendations).toContain('No additional cardiac testing indicated based on RCRI alone');
    });

    it('should provide appropriate recommendations for high risk', () => {
      const input: RCRIInput = {
        highRiskSurgery: true,
        ischemicHeartDisease: true,
        congestiveHeartFailure: true,
        cerebrovascularDisease: true,
        insulinDependentDiabetes: false,
        renalInsufficiency: false
      };

      const result = calculateRCRI(input);

      expect(result.recommendations.some(r => r.includes('cardiology consultation'))).toBe(true);
      expect(result.recommendations.some(r => r.includes('cardiac testing'))).toBe(true);
    });

    it('should provide condition-specific recommendations', () => {
      const input: RCRIInput = {
        highRiskSurgery: false,
        ischemicHeartDisease: false,
        congestiveHeartFailure: true,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: true,
        renalInsufficiency: true
      };

      const result = calculateRCRI(input);

      // CHF recommendations
      expect(result.recommendations.some(r => r.includes('heart failure management'))).toBe(true);
      
      // Diabetes recommendations
      expect(result.recommendations.some(r => r.includes('glycemic control'))).toBe(true);
      
      // Renal recommendations
      expect(result.recommendations.some(r => r.includes('nephrotoxic'))).toBe(true);
    });
  });

  describe('isHighRiskSurgery', () => {
    it('should identify intraperitoneal surgery as high risk', () => {
      expect(isHighRiskSurgery('Intraperitoneal surgery')).toBe(true);
      expect(isHighRiskSurgery('laparoscopic intraperitoneal procedure')).toBe(true);
    });

    it('should identify intrathoracic surgery as high risk', () => {
      expect(isHighRiskSurgery('Intrathoracic procedure')).toBe(true);
      expect(isHighRiskSurgery('thoracic surgery')).toBe(true);
    });

    it('should identify vascular surgery as high risk', () => {
      expect(isHighRiskSurgery('Suprainguinal vascular surgery')).toBe(true);
      expect(isHighRiskSurgery('aortic aneurysm repair')).toBe(true);
      expect(isHighRiskSurgery('major vascular reconstruction')).toBe(true);
    });

    it('should identify specific high-risk procedures', () => {
      expect(isHighRiskSurgery('esophagectomy')).toBe(true);
      expect(isHighRiskSurgery('hepatectomy')).toBe(true);
      expect(isHighRiskSurgery('pancreatectomy')).toBe(true);
      expect(isHighRiskSurgery('pneumonectomy')).toBe(true);
    });

    it('should not identify low-risk surgeries as high risk', () => {
      expect(isHighRiskSurgery('cataract surgery')).toBe(false);
      expect(isHighRiskSurgery('knee arthroscopy')).toBe(false);
      expect(isHighRiskSurgery('carpal tunnel release')).toBe(false);
      expect(isHighRiskSurgery('inguinal hernia repair')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isHighRiskSurgery('INTRATHORACIC')).toBe(true);
      expect(isHighRiskSurgery('Aortic Surgery')).toBe(true);
      expect(isHighRiskSurgery('ESOPHAGECTOMY')).toBe(true);
    });
  });

  describe('RCRIResult structure', () => {
    it('should return complete result structure', () => {
      const input: RCRIInput = {
        highRiskSurgery: true,
        ischemicHeartDisease: true,
        congestiveHeartFailure: false,
        cerebrovascularDisease: false,
        insulinDependentDiabetes: false,
        renalInsufficiency: false
      };

      const result = calculateRCRI(input);

      // Check all required fields exist
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('riskClass');
      expect(result).toHaveProperty('estimatedRisk');
      expect(result).toHaveProperty('riskPercentage');
      expect(result).toHaveProperty('interpretation');
      expect(result).toHaveProperty('riskFactors');
      expect(result).toHaveProperty('recommendations');

      // Check types
      expect(typeof result.score).toBe('number');
      expect(typeof result.riskClass).toBe('string');
      expect(typeof result.estimatedRisk).toBe('string');
      expect(typeof result.riskPercentage).toBe('number');
      expect(typeof result.interpretation).toBe('string');
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(typeof result.riskFactors).toBe('object');
    });
  });
});