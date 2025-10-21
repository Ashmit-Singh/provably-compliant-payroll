// complianceRiskScorer.js
// Service to generate compliance risk scores from NLP impact analysis

/**
 * Generate compliance risk scores for each regulatory change
 * @param {Array} impactAnalysisResults Array of impact analysis results
 * @returns {Array} Array of risk score objects
 */
export function generateRiskScores(impactAnalysisResults) {
  return impactAnalysisResults.map(result => ({
    regulationId: result.regulationId,
    title: result.title,
    effectiveDate: result.effectiveDate,
    riskScore: Math.round(result.impactScore * 100), // Convert to percentage
    affectedRules: result.affectedRules,
    keywords: result.keywords,
    raw: result.raw,
  }));
}
