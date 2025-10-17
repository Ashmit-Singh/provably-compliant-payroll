package com.compliantpay.service.impl;

import com.compliantpay.model.TaxRule;
import com.compliantpay.service.ComplianceService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class ComplianceServiceImpl implements ComplianceService {
    
    // Mock tax rules data - in production this would come from database
    private final Map<String, List<TaxRule>> taxRulesCache = new HashMap<>();
    
    public ComplianceServiceImpl() {
        initializeMockTaxRules();
    }
    
    @Override
    public BigDecimal calculateTax(String jurisdiction, BigDecimal annualIncome) {
        List<TaxRule> rules = getTaxRulesForJurisdiction(jurisdiction);
        BigDecimal totalTax = BigDecimal.ZERO;
        
        for (TaxRule rule : rules) {
            if (rule.getIsActive() && isRuleApplicable(rule, annualIncome)) {
                if (rule.getTaxRate() != null) {
                    BigDecimal taxableAmount = calculateTaxableAmount(rule, annualIncome);
                    totalTax = totalTax.add(taxableAmount.multiply(rule.getTaxRate()));
                }
                if (rule.getFixedAmount() != null) {
                    totalTax = totalTax.add(rule.getFixedAmount());
                }
            }
        }
        
        return totalTax.setScale(2, RoundingMode.HALF_UP);
    }
    
    private List<TaxRule> getTaxRulesForJurisdiction(String jurisdiction) {
        return taxRulesCache.getOrDefault(jurisdiction, List.of());
    }
    
    private boolean isRuleApplicable(TaxRule rule, BigDecimal income) {
        boolean minCondition = rule.getMinIncome() == null || income.compareTo(rule.getMinIncome()) >= 0;
        boolean maxCondition = rule.getMaxIncome() == null || income.compareTo(rule.getMaxIncome()) <= 0;
        return minCondition && maxCondition;
    }
    
    private BigDecimal calculateTaxableAmount(TaxRule rule, BigDecimal income) {
        if (rule.getMinIncome() == null) {
            return income;
        }
        
        BigDecimal maxForBracket = rule.getMaxIncome() != null ? 
            rule.getMaxIncome().min(income) : income;
        
        return maxForBracket.subtract(rule.getMinIncome()).max(BigDecimal.ZERO);
    }
    
    @Override
    public String getCurrentRulesHash() {
        // Generate a hash representing the current state of compliance rules
        // For demo purposes, return a simple hash
        return Integer.toHexString(taxRulesCache.hashCode());
    }
    
    @Override
    public Map<String, Object> getTaxRulesForJurisdictionWithDetails(String jurisdiction) {
        List<TaxRule> rules = getTaxRulesForJurisdiction(jurisdiction);
        
        Map<String, Object> result = new HashMap<>();
        result.put("jurisdiction", jurisdiction);
        result.put("rules", rules);
        result.put("lastUpdated", java.time.LocalDateTime.now().toString());
        
        return result;
    }
    
    private void initializeMockTaxRules() {
        // USA - California rules
        List<TaxRule> caRules = List.of(
            createTaxRule("USA - California", "Bracket 1", 0, 9325, new BigDecimal("0.01")),
            createTaxRule("USA - California", "Bracket 2", 9326, 22107, new BigDecimal("0.02")),
            createTaxRule("USA - California", "Bracket 3", 22108, 34892, new BigDecimal("0.04")),
            createTaxRule("USA - California", "Bracket 4", 34893, 48435, new BigDecimal("0.06")),
            createTaxRule("USA - California", "Bracket 5", 48436, 61214, new BigDecimal("0.08")),
            createTaxRule("USA - California", "Bracket 6", 61215, 312686, new BigDecimal("0.093")),
            createTaxRule("USA - California", "SDI Tax", 0, null, new BigDecimal("0.011"))
        );
        taxRulesCache.put("USA - California", caRules);
        
        // Canada - Ontario rules
        List<TaxRule> onRules = List.of(
            createTaxRule("Canada - Ontario", "Bracket 1", 0, 49231, new BigDecimal("0.0505")),
            createTaxRule("Canada - Ontario", "Bracket 2", 49232, 98463, new BigDecimal("0.0915")),
            createTaxRule("Canada - Ontario", "Bracket 3", 98464, 150000, new BigDecimal("0.1116")),
            createTaxRule("Canada - Ontario", "Bracket 4", 150001, 220000, new BigDecimal("0.1216")),
            createTaxRule("Canada - Ontario", "Bracket 5", 220001, null, new BigDecimal("0.1316"))
        );
        taxRulesCache.put("Canada - Ontario", onRules);
        
        // India - Tamil Nadu rules
        List<TaxRule> tnRules = List.of(
            createTaxRule("India - Tamil Nadu", "No Tax", 0, 250000, BigDecimal.ZERO),
            createTaxRule("India - Tamil Nadu", "Bracket 1", 250001, 500000, new BigDecimal("0.05")),
            createTaxRule("India - Tamil Nadu", "Bracket 2", 500001, 1000000, new BigDecimal("0.20")),
            createTaxRule("India - Tamil Nadu", "Bracket 3", 1000001, null, new BigDecimal("0.30"))
        );
        taxRulesCache.put("India - Tamil Nadu", tnRules);
    }
    
    private TaxRule createTaxRule(String jurisdiction, String name, 
                                 int min, Integer max, BigDecimal rate) {
        TaxRule rule = new TaxRule();
        rule.setJurisdiction(jurisdiction);
        rule.setRuleName(name);
        rule.setRuleType("INCOME_TAX");
        rule.setMinIncome(BigDecimal.valueOf(min));
        if (max != null) {
            rule.setMaxIncome(BigDecimal.valueOf(max));
        }
        rule.setTaxRate(rate);
        rule.setIsActive(true);
        return rule;
    }
}