// nlpComplianceAnalyzer.js
// NLP service for analyzing regulatory impact on payroll rules

import compromise from 'compromise'; // Example NLP library

/**
 * Analyze regulatory updates for impact on payroll rules
 * @param {Array} regulatoryChanges Array of normalized regulatory changes
 * @param {Array} payrollRules Array of payroll rule objects
 * @returns {Array} Array of impact analysis results
 */
export function analyzeRegulatoryImpact(regulatoryChanges, payrollRules) {
  return regulatoryChanges.map(change => {
    // Use NLP to extract keywords/entities from the change description
    const doc = compromise(change.description || '');
    const keywords = doc.nouns().out('array');
    // Simple matching: check if any payroll rule is affected by keywords
    const affectedRules = payrollRules.filter(rule =>
      keywords.some(kw => rule.description.toLowerCase().includes(kw.toLowerCase()))
    );
    return {
      regulationId: change.id,
      title: change.title,
      effectiveDate: change.effectiveDate,
      affectedRules,
      impactScore: affectedRules.length / (payrollRules.length || 1), // Simple risk score
      keywords,
      raw: change,
    };
  });
}
