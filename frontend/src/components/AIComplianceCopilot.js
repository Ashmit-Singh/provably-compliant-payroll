import React, { useEffect, useState } from 'react';
import { copilotMonitor, copilotRisks, getEmployees } from '../services/api';

const AIComplianceCopilot = () => {
  const [summary, setSummary] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const employees = await getEmployees();
        const monitor = await copilotMonitor({ ad_hoc_texts: [], current_employee_data: employees });
        setSummary(monitor);

        const risks = await copilotRisks(employees);
        setRisk(risks);
      } catch (err) {
        console.error('Copilot error', err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) return <div>Loading AI Compliance Co-pilot...</div>;

  return (
    <div className="ai-copilot-card">
      <h3>AI Compliance Co-pilot</h3>
        {summary ? (
        <div>
          <p>Scanned at: {summary.scanned_at}</p>
          <p>Feeds: {summary.feed_count} | Ad-hoc: {summary.ad_hoc_count}</p>
          <p>Summary proof: {summary.summary_proof}</p>
          {summary.results && summary.results.length > 0 && (
            <div>
              <h5>Anchored Proofs</h5>
              <ul>
                {summary.results.map((r, i) => (
                  <li key={i}>{r.audit_proof?.txHash || r.audit_proof?.digest}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>No summary available</p>
      )}

      {risk ? (
        <div>
          <h4>Risk</h4>
          <p>Score: {risk.risk_score} ({risk.risk_level})</p>
          <p>Audit proof: {risk.audit_proof}</p>
          <ul>
            {(risk.recommendations || []).map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      ) : (
        <p>No risk analysis available</p>
      )}
    </div>
  );
};

export default AIComplianceCopilot;
