// compliance.js
// Integrates regulatory monitoring, NLP analysis, risk scoring, and audit documentation

import { fetchRegulatoryUpdates, parseRegulatoryUpdates } from './regulatoryMonitor';
import { analyzeRegulatoryImpact } from './nlpComplianceAnalyzer';
import { generateRiskScores } from './complianceRiskScorer';
import { generateAuditDocs } from './auditDocumentation';
import payrollRules from './payrollService'; // Assumed to export payroll rules array

/**
 * Main compliance monitoring workflow
 * @returns {Promise<{updates, parsed, impact, riskScores, auditDocs}>}
 */
export async function runComplianceMonitoring() {
  // 1. Fetch and parse regulatory updates
  const updates = await fetchRegulatoryUpdates();
  const parsed = parseRegulatoryUpdates(updates);

  // 2. Analyze impact using NLP
  const impact = analyzeRegulatoryImpact(parsed, payrollRules);

  // 3. Generate risk scores
  const riskScores = generateRiskScores(impact);

  // 4. Generate audit documentation
  const auditDocs = generateAuditDocs(riskScores);

  return { updates, parsed, impact, riskScores, auditDocs };
}
