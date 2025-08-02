// Demo script to test periop-calculators locally
// Run with: node demo.js

const { calculateStopBang, calculateRCRI, calculateApfelScore, isHighRiskSurgery } = require('./dist/index.js');

console.log('=== PERIOP CALCULATORS DEMO ===\n');

// Test STOP-BANG Calculator
console.log('1. STOP-BANG Calculator Demo');
console.log('----------------------------');

const stopBangInput = {
  snoring: true,
  tiredness: true,
  observed: false,
  pressure: true,
  bmi: 36,
  age: 55,
  neckCircumference: 43,
  gender: 'male'
};

console.log('Input:', JSON.stringify(stopBangInput, null, 2));
const stopBangResult = calculateStopBang(stopBangInput);
console.log('\nResult:');
console.log(`Score: ${stopBangResult.score}/8`);
console.log(`Risk Level: ${stopBangResult.risk.toUpperCase()}`);
console.log(`Interpretation: ${stopBangResult.interpretation}`);
console.log('\nComponents:', stopBangResult.components);
console.log('\nRecommendations:');
stopBangResult.recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`);
});

console.log('\n\n2. RCRI Calculator Demo');
console.log('------------------------');

const rcriInput = {
  highRiskSurgery: true,
  ischemicHeartDisease: false,
  congestiveHeartFailure: false,
  cerebrovascularDisease: false,
  insulinDependentDiabetes: true,
  renalInsufficiency: false
};

console.log('Input:', JSON.stringify(rcriInput, null, 2));
const rcriResult = calculateRCRI(rcriInput);
console.log('\nResult:');
console.log(`Score: ${rcriResult.score} points`);
console.log(`Risk Class: ${rcriResult.riskClass}`);
console.log(`Estimated Risk: ${rcriResult.estimatedRisk}`);
console.log(`Interpretation: ${rcriResult.interpretation}`);
console.log('\nRisk Factors Present:', rcriResult.riskFactors);
console.log('\nRecommendations:');
rcriResult.recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`);
});

console.log('\n\n3. Apfel Score Demo');
console.log('-------------------');

const apfelInput = {
  female: true,
  nonSmoker: true,
  historyOfPONV: false,
  postoperativeOpioids: true
};

console.log('Input:', JSON.stringify(apfelInput, null, 2));
const apfelResult = calculateApfelScore(apfelInput);
console.log('\nResult:');
console.log(`Score: ${apfelResult.score}/4`);
console.log(`Risk Level: ${apfelResult.risk.toUpperCase()}`);
console.log(`PONV Risk: ${apfelResult.riskPercentage}%`);
console.log(`Interpretation: ${apfelResult.interpretation}`);
console.log('\nRisk Factors:', apfelResult.riskFactors);
console.log('\nRecommendations:');
apfelResult.recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`);
});

console.log('\n\n4. High Risk Surgery Helper Demo');
console.log('---------------------------------');

const surgeries = [
  'Aortic aneurysm repair',
  'Cataract surgery',
  'Intrathoracic procedure',
  'Knee arthroscopy',
  'Esophagectomy',
  'Carpal tunnel release'
];

console.log('Checking which surgeries are high risk:\n');
surgeries.forEach(surgery => {
  const isHighRisk = isHighRiskSurgery(surgery);
  console.log(`${surgery}: ${isHighRisk ? '⚠️  HIGH RISK' : '✓ Low Risk'}`);
});

console.log('\n\n5. Interactive Example - Patient Case');
console.log('--------------------------------------');

// Example patient case
console.log('Patient: 65-year-old female scheduled for laparoscopic cholecystectomy');
console.log('Medical history: Non-smoker, history of motion sickness, expected to need opioids');

const patientStopBang = {
  snoring: false,
  tiredness: false,
  observed: false,
  pressure: true,
  bmi: 28,
  age: 65,
  neckCircumference: 36,
  gender: 'female'
};

const patientRCRI = {
  highRiskSurgery: isHighRiskSurgery('laparoscopic cholecystectomy'),
  ischemicHeartDisease: false,
  congestiveHeartFailure: false,
  cerebrovascularDisease: false,
  insulinDependentDiabetes: false,
  renalInsufficiency: false
};

const patientApfel = {
  female: true,
  nonSmoker: true,
  historyOfPONV: true, // history of motion sickness
  postoperativeOpioids: true
};

const stopBangScore = calculateStopBang(patientStopBang);
const rcriScore = calculateRCRI(patientRCRI);
const apfelScore = calculateApfelScore(patientApfel);

console.log('\nPerioperative Risk Assessment:');
console.log(`- OSA Risk (STOP-BANG): ${stopBangScore.score}/8 - ${stopBangScore.risk} risk`);
console.log(`- Cardiac Risk (RCRI): Class ${rcriScore.riskClass} - ${rcriScore.estimatedRisk} risk`);
console.log(`- PONV Risk (Apfel): ${apfelScore.score}/4 - ${apfelScore.riskPercentage}% risk`);
console.log('\nKey recommendations for this patient:');
console.log('- Low cardiac risk - proceed with standard perioperative care');
console.log('- High PONV risk (79%) - implement multimodal PONV prophylaxis');
console.log('- Consider TIVA with propofol and avoid volatile anesthetics');
console.log('- Use 3-4 antiemetic agents from different classes');

console.log('\n=== Demo Complete ===');