import logging
import requests
import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


class AIComplianceCopilot:
    """A lightweight AI Compliance Co-pilot service.

    This is a staged, production-ready scaffold that:
    - polls regulatory feeds (or accepts ad-hoc text)
    - leverages existing NLP and prediction services to analyze impact
    - produces human-friendly recommendations and a tamper-evident proof
    """

    def __init__(self, nlp_service, prediction_service, compliance_parser):
        self.nlp = nlp_service
        self.predictor = prediction_service
        self.parser = compliance_parser
        logger.info("AI Compliance Copilot initialized")

    def _fetch_feed(self, url: str) -> Optional[str]:
        try:
            logger.info(f"Fetching regulatory feed: {url}")
            resp = requests.get(url, timeout=8)
            resp.raise_for_status()
            return resp.text
        except Exception as e:
            logger.warning(f"Failed to fetch feed {url}: {e}")
            return None

    def _make_blockchain_proof(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        # Create a simple tamper-evident proof: SHA256 of the JSON payload
        body = json.dumps(payload, sort_keys=True, default=str)
        digest = hashlib.sha256(body.encode("utf-8")).hexdigest()
        proof = {"algorithm": "sha256", "digest": digest, "timestamp": datetime.utcnow().isoformat()}

        # Attempt to anchor proof on blockchain-service (best-effort)
        try:
            bc_url = "http://localhost:8080/anchor/proof"
            resp = requests.post(bc_url, json={"digest": digest, "source": "ai-service"}, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                proof["txHash"] = data.get("txHash") or data.get("txHash")
        except Exception as e:
            logger.warning(f"Failed to anchor proof on blockchain-service: {e}")

        return proof

    def monitor_global_regulations(self, feed_urls: Optional[List[str]] = None, ad_hoc_texts: Optional[List[str]] = None, current_employee_data: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Scan regulatory feeds and return parsed rules, impact predictions and suggested actions.

        - feed_urls: list of public regulatory document URLs (HTTP)
        - ad_hoc_texts: list of raw legislation text strings
        - current_employee_data: optional payroll employee data passed through prediction engine
        """
        results = []

        feed_urls = feed_urls or []
        ad_hoc_texts = ad_hoc_texts or []
        current_employee_data = current_employee_data or []

        # Fetch and parse external feeds
        for url in feed_urls:
            text = self._fetch_feed(url)
            if not text:
                continue
            parsed = self.nlp.parse_legislation_text(text)
            impact = self.predictor.predict_impact(current_employee_data, parsed)
            doc = {
                "source": url,
                "parsed_rules": parsed,
                "impact": impact,
            }
            doc["audit_proof"] = self._make_blockchain_proof(doc)
            results.append(doc)

        # Process ad-hoc texts
        for i, text in enumerate(ad_hoc_texts or []):
            parsed = self.nlp.parse_legislation_text(text)
            impact = self.predictor.predict_impact(current_employee_data, parsed)
            doc = {
                "source": f"ad_hoc_{i}",
                "parsed_rules": parsed,
                "impact": impact,
            }
            doc["audit_proof"] = self._make_blockchain_proof(doc)
            results.append(doc)

        summary = {
            "scanned_at": datetime.utcnow().isoformat(),
            "feed_count": len(feed_urls),
            "ad_hoc_count": len(ad_hoc_texts),
            "results": results,
        }
        summary["summary_proof"] = self._make_blockchain_proof(summary)
        return summary

    def predict_compliance_risks(self, payroll_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Return a risk-scoring analysis for the provided payroll data.

        Uses existing prediction service to calculate impact and derives a compact risk score.
        """
        logger.info("Predicting compliance risks for payroll data")

        impact = self.predictor.predict_impact(payroll_data, {})

        # Derive a simple heuristic risk score [0..100]
        total_payroll = sum([e.get('salary', 0) for e in payroll_data]) or 1
        projected_increase = impact.get('projected_cost_increase', 0)
        affected_count = impact.get('affected_employee_count', 0)

        # score based on relative cost increase and affected employees
        cost_factor = min(projected_increase / total_payroll, 2.0)
        employee_factor = min(affected_count / max(len(payroll_data), 1), 1.0)

        raw_score = (cost_factor * 0.7 + employee_factor * 0.3) * 100
        risk_score = round(min(max(raw_score, 0), 100), 2)

        if risk_score >= 70:
            risk_level = "HIGH"
        elif risk_score >= 35:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        recommendations = impact.get('recommendations', [])

        result = {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "impact": impact,
            "recommendations": recommendations,
            "analyzed_at": datetime.utcnow().isoformat(),
        }
        result["audit_proof"] = self._make_blockchain_proof(result)
        return result
