import logging
import re
from typing import Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class NLPService:
    def __init__(self):
        logger.info("NLP Service initialized")
    
    def parse_legislation_text(self, text: str) -> Dict[str, Any]:
        """
        Parse legislative text to extract key information using rule-based approach.
        In production, this would use more advanced NLP models.
        """
        try:
            logger.info("Parsing legislation text")
            
            # Extract key information using regex patterns
            effective_date = self._extract_date(text)
            tax_changes = self._extract_tax_changes(text)
            new_taxes = self._extract_new_taxes(text)
            mandates = self._extract_mandates(text)
            
            return {
                "effective_date": effective_date,
                "tax_changes": tax_changes,
                "new_taxes": new_taxes,
                "mandates": mandates,
                "parsed_successfully": True
            }
            
        except Exception as e:
            logger.error(f"Error parsing legislation text: {str(e)}")
            return {
                "parsed_successfully": False,
                "error": str(e)
            }
    
    def _extract_date(self, text: str) -> str:
        """Extract effective date from text"""
        # Look for common date patterns
        patterns = [
            r'effective\s+(\w+\s+\d{1,2},\s+\d{4})',
            r'starting\s+(\w+\s+\d{1,2},\s+\d{4})',
            r'beginning\s+(\w+\s+\d{1,2},\s+\d{4})',
            r'(\w+\s+\d{1,2},\s+\d{4})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        # Default to next year if no date found
        next_year = datetime.now().year + 1
        return f"January 1, {next_year}"
    
    def _extract_tax_changes(self, text: str) -> List[Dict[str, Any]]:
        """Extract tax rate changes from text"""
        changes = []
        
        # Look for tax increase patterns
        increase_patterns = [
            r'increase.*?(\d+\.?\d*)%',
            r'(\d+\.?\d*)%.*?increase',
            r'additional.*?(\d+\.?\d*)%',
            r'raise.*?(\d+\.?\d*)%'
        ]
        
        for pattern in increase_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                changes.append({
                    "type": "tax_increase",
                    "rate": float(match.group(1)),
                    "description": f"Increase tax rate by {match.group(1)}%"
                })
        
        # Look for income threshold changes
        threshold_pattern = r'(\$[\d,]+).*?(\d+\.?\d*)%'
        matches = re.finditer(threshold_pattern, text)
        for match in matches:
            changes.append({
                "type": "new_tax_bracket",
                "threshold": match.group(1),
                "rate": float(match.group(2)),
                "description": f"New {match.group(2)}% tax bracket for income over {match.group(1)}"
            })
        
        return changes
    
    def _extract_new_taxes(self, text: str) -> List[Dict[str, Any]]:
        """Extract new taxes from text"""
        taxes = []
        
        # Look for new tax patterns
        patterns = [
            (r'new.*?(\d+\.?\d*)%.*?tax', "percentage"),
            (r'(\d+\.?\d*)%.*?tax.*?on.*?payroll', "percentage"),
            (r'(\$[\d,]+).*?per.*?employee', "fixed")
        ]
        
        for pattern, tax_type in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                if tax_type == "percentage":
                    taxes.append({
                        "type": "percentage",
                        "rate": float(match.group(1)),
                        "description": f"New {match.group(1)}% tax"
                    })
                else:
                    taxes.append({
                        "type": "fixed",
                        "amount": match.group(1),
                        "description": f"New {match.group(1)} tax per employee"
                    })
        
        return taxes
    
    def _extract_mandates(self, text: str) -> List[Dict[str, Any]]:
        """Extract employer mandates from text"""
        mandates = []
        
        # Look for healthcare mandate patterns
        healthcare_patterns = [
            r'(\$[\d,]+).*?healthcare',
            r'healthcare.*?(\$[\d,]+)',
            r'(\$[\d,]+).*?per.*?employee.*?monthly',
            r'employer.*?contribute.*?(\$[\d,]+)'
        ]
        
        for pattern in healthcare_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                mandates.append({
                    "type": "healthcare_mandate",
                    "amount": match.group(1),
                    "description": f"Healthcare mandate: {match.group(1)} per employee"
                })
        
        return mandates