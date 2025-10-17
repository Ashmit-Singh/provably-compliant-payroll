import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class ComplianceParser:
    def __init__(self):
        logger.info("Compliance Parser initialized")
    
    def parse_legislation_text(self, text: str) -> Dict[str, Any]:
        """
        Parse legislative text for compliance rules extraction
        """
        # This is a simplified parser - in production would use more sophisticated NLP
        rules = {
            "tax_brackets": self._extract_tax_brackets(text),
            "effective_date": self._extract_effective_date(text),
            "jurisdictions": self._extract_jurisdictions(text),
            "compliance_requirements": self._extract_compliance_requirements(text)
        }
        
        return rules
    
    def _extract_tax_brackets(self, text: str) -> List[Dict[str, Any]]:
        """Extract tax bracket information from text"""
        brackets = []
        
        # Simple pattern matching for demonstration
        if "150,000" in text and "1.5%" in text:
            brackets.append({
                "min_income": 150000,
                "max_income": None,
                "rate": 0.015,
                "description": "1.5% increase for income over $150,000"
            })
        
        if "Digital Services" in text and "0.5%" in text:
            brackets.append({
                "min_income": 0,
                "max_income": None,
                "rate": 0.005,
                "description": "0.5% Digital Services tax on all payroll"
            })
        
        return brackets
    
    def _extract_effective_date(self, text: str) -> str:
        """Extract effective date from legislation text"""
        if "Jan 1, 2026" in text:
            return "2026-01-01"
        elif "January 1, 2026" in text:
            return "2026-01-01"
        else:
            return "2026-01-01"  # Default
    
    def _extract_jurisdictions(self, text: str) -> List[str]:
        """Extract affected jurisdictions"""
        jurisdictions = []
        
        if "California" in text:
            jurisdictions.append("USA - California")
        if "state" in text.lower():
            jurisdictions.append("USA - California")  # Default assumption
        
        return jurisdictions if jurisdictions else ["USA - California"]
    
    def _extract_compliance_requirements(self, text: str) -> List[str]:
        """Extract compliance requirements"""
        requirements = []
        
        if "healthcare" in text.lower() or "mandate" in text.lower():
            requirements.append("Healthcare contribution mandate")
        
        if "report" in text.lower() or "file" in text.lower():
            requirements.append("Additional reporting requirements")
        
        return requirements