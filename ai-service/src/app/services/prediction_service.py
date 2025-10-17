import logging
import pandas as pd
import numpy as np
from typing import Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        logger.info("Prediction Service initialized")
    
    def predict_impact(self, employee_data: List[Dict[str, Any]], 
                      parsed_rules: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict the financial impact of legislative changes on payroll costs
        """
        try:
            logger.info("Predicting legislative impact")
            
            # Convert employee data to DataFrame for analysis
            df = pd.DataFrame(employee_data)
            
            # Calculate baseline costs
            baseline_analysis = self._calculate_baseline_costs(df)
            
            # Calculate impact of changes
            impact_analysis = self._calculate_impact(df, parsed_rules, baseline_analysis)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(impact_analysis, df)
            
            return {
                **impact_analysis,
                "recommendations": recommendations,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error predicting impact: {str(e)}")
            raise
    
    def _calculate_baseline_costs(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate baseline payroll costs"""
        total_annual_salary = df['salary'].sum()
        total_monthly_salary = total_annual_salary / 12
        
        return {
            "total_annual_salary": total_annual_salary,
            "total_monthly_salary": total_monthly_salary,
            "employee_count": len(df)
        }
    
    def _calculate_impact(self, df: pd.DataFrame, parsed_rules: Dict[str, Any], 
                         baseline: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate the financial impact of legislative changes"""
        
        total_impact = 0
        affected_employees = []
        cost_breakdown = {}
        
        # Calculate tax increase impact
        if parsed_rules.get('tax_changes'):
            tax_impact = self._calculate_tax_impact(df, parsed_rules['tax_changes'])
            total_impact += tax_impact['total_increase']
            affected_employees.extend(tax_impact['affected_employees'])
            cost_breakdown['increased_tax_burden'] = tax_impact['total_increase']
        
        # Calculate new taxes impact
        if parsed_rules.get('new_taxes'):
            new_tax_impact = self._calculate_new_tax_impact(df, parsed_rules['new_taxes'])
            total_impact += new_tax_impact
            cost_breakdown['new_taxes'] = new_tax_impact
        
        # Calculate mandates impact
        if parsed_rules.get('mandates'):
            mandate_impact = self._calculate_mandate_impact(df, parsed_rules['mandates'])
            total_impact += mandate_impact
            cost_breakdown['mandates'] = mandate_impact
        
        # Remove duplicates from affected employees
        unique_affected = []
        seen_employees = set()
        for emp in affected_employees:
            if emp['employee_id'] not in seen_employees:
                unique_affected.append(emp)
                seen_employees.add(emp['employee_id'])
        
        return {
            "projected_cost_increase": total_impact,
            "affected_employee_count": len(unique_affected),
            "monthly_increase": total_impact / 12,
            "effective_date": parsed_rules.get('effective_date', 'Unknown'),
            "cost_breakdown": cost_breakdown,
            "affected_employees": unique_affected
        }
    
    def _calculate_tax_impact(self, df: pd.DataFrame, tax_changes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate impact of tax changes"""
        total_increase = 0
        affected_employees = []
        
        for change in tax_changes:
            if change['type'] == 'tax_increase':
                # Apply tax increase to all employees above certain threshold
                threshold = 150000  # Default threshold for high earners
                high_earners = df[df['salary'] > threshold]
                
                for _, emp in high_earners.iterrows():
                    increase = emp['salary'] * (change['rate'] / 100)
                    total_increase += increase
                    
                    affected_employees.append({
                        "employee_id": emp['employee_id'],
                        "name": emp['name'],
                        "additional_cost": increase,
                        "reason": f"{change['rate']}% tax increase"
                    })
        
        return {
            "total_increase": total_increase,
            "affected_employees": affected_employees
        }
    
    def _calculate_new_tax_impact(self, df: pd.DataFrame, new_taxes: List[Dict[str, Any]]) -> float:
        """Calculate impact of new taxes"""
        total_impact = 0
        
        for tax in new_taxes:
            if tax['type'] == 'percentage':
                # Apply percentage tax to total payroll
                total_impact += df['salary'].sum() * (tax['rate'] / 100)
            elif tax['type'] == 'fixed':
                # Apply fixed amount per employee
                amount = float(tax['amount'].replace('$', '').replace(',', ''))
                total_impact += len(df) * amount
        
        return total_impact
    
    def _calculate_mandate_impact(self, df: pd.DataFrame, mandates: List[Dict[str, Any]]) -> float:
        """Calculate impact of employer mandates"""
        total_impact = 0
        
        for mandate in mandates:
            if mandate['type'] == 'healthcare_mandate':
                amount = float(mandate['amount'].replace('$', '').replace(',', ''))
                total_impact += len(df) * amount * 12  # Annual cost
        
        return total_impact
    
    def _generate_recommendations(self, impact_analysis: Dict[str, Any], 
                                df: pd.DataFrame) -> List[str]:
        """Generate strategic recommendations based on impact analysis"""
        recommendations = []
        
        total_increase = impact_analysis['projected_cost_increase']
        affected_count = impact_analysis['affected_employee_count']
        
        if total_increase > 0:
            percentage_increase = (total_increase / df['salary'].sum()) * 100
            
            recommendations.append(
                f"Increase payroll budget by approximately ${total_increase:,.0f} "
                f"({percentage_increase:.1f}%) annually"
            )
            
            if affected_count > 0:
                recommendations.append(
                    f"Review compensation strategy for {affected_count} affected employees"
                )
            
            recommendations.extend([
                "Consider timing bonus payments to optimize tax liabilities",
                "Evaluate remote work arrangements for jurisdictional tax advantages",
                "Schedule compliance review before legislation effective date"
            ])
        
        return recommendations