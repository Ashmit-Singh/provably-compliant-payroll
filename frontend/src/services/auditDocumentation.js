// auditDocumentation.js
// Service to generate automated audit documentation for compliance events

/**
 * Generate audit documentation for regulatory changes and risk scores
 * @param {Array} riskScores Array of risk score objects
 * @returns {Array} Array of audit documentation entries
 */
export function generateAuditDocs(riskScores) {
  return riskScores.map(score => ({
    auditId: `AUDIT-${score.regulationId}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    regulationTitle: score.title,
    effectiveDate: score.effectiveDate,
    riskScore: score.riskScore,
    affectedRules: score.affectedRules.map(r => r.id),
    summary: `Regulation '${score.title}' (effective ${score.effectiveDate}) has a compliance risk score of ${score.riskScore}%. Affected rules: ${score.affectedRules.map(r => r.title).join(', ')}`,
    details: score,
  }));
}
