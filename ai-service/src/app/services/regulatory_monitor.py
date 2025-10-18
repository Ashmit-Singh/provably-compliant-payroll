import logging
import requests
from typing import Dict, Any, List
from datetime import datetime

from .compliance_parser import ComplianceParser
from .nlp_service import NLPService

logger = logging.getLogger(__name__)


class RegulatoryMonitor:
    """Simple regulatory monitoring service.

    Responsibilities:
    - fetch updates from configured regulatory feed endpoints
    - parse textual regulatory content using NLPService and ComplianceParser
    - compute a basic compliance risk score
    - produce an audit record (dict) for downstream storage or ingestion
    """

    def __init__(self, feeds: List[str] = None, timeout: int = 10):
        self.feeds = feeds or []
        self.timeout = timeout
        self.nlp = NLPService()
        self.parser = ComplianceParser()
        logger.info("RegulatoryMonitor initialized with %d feeds", len(self.feeds))

    def add_feed(self, url: str):
        if url not in self.feeds:
            self.feeds.append(url)

    def fetch_feed(self, url: str) -> Dict[str, Any]:
        logger.info("Fetching regulatory feed: %s", url)
        try:
            resp = requests.get(url, timeout=self.timeout)
            resp.raise_for_status()
            # Expect JSON with 'title' and 'content' or raw text
            content_type = resp.headers.get("Content-Type", "")
            if "application/json" in content_type:
                data = resp.json()
                text = data.get("content") or data.get("text") or data.get("body") or str(data)
                title = data.get("title") or data.get("headline") or url
            else:
                text = resp.text
                title = url

            return {"url": url, "title": title, "text": text, "fetched_at": datetime.utcnow().isoformat()}

        except Exception as e:
            logger.exception("Failed to fetch feed %s: %s", url, str(e))
            return {"url": url, "error": str(e), "fetched_at": datetime.utcnow().isoformat()}

    def analyze_update(self, update: Dict[str, Any]) -> Dict[str, Any]:
        text = update.get("text") or ""
        title = update.get("title") or update.get("url")

        nlp_result = self.nlp.parse_legislation_text(text)
        parsed_rules = self.parser.parse_legislation_text(text)

        # Simple risk scoring heuristics (placeholder for ML model)
        score = 0
        reasons = []
        if nlp_result.get("tax_changes"):
            score += 40
            reasons.append("tax_changes_detected")
        if nlp_result.get("new_taxes"):
            score += 30
            reasons.append("new_taxes_detected")
        if parsed_rules.get("compliance_requirements"):
            score += 20
            reasons.append("compliance_requirements")
        if nlp_result.get("mandates"):
            score += 20
            reasons.append("mandates_detected")

        # Normalize score to 0-100
        score = min(100, score)

        audit_record = {
            "title": title,
            "url": update.get("url"),
            "fetched_at": update.get("fetched_at"),
            "analyzed_at": datetime.utcnow().isoformat(),
            "nlp": nlp_result,
            "parsed_rules": parsed_rules,
            "risk_score": score,
            "risk_reasons": reasons,
        }

        logger.info("Analyzed update %s risk_score=%s reasons=%s", title, score, reasons)
        return audit_record

    def poll_once(self) -> List[Dict[str, Any]]:
        """Fetch all feeds once and return audit records list."""
        records = []
        for url in self.feeds:
            update = self.fetch_feed(url)
            if update.get("error"):
                logger.warning("Skipping update with error for %s", url)
                continue
            rec = self.analyze_update(update)
            records.append(rec)

        return records


__all__ = ["RegulatoryMonitor"]
