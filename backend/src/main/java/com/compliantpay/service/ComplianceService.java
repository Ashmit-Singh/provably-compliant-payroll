package com.compliantpay.service;

import java.math.BigDecimal;
import java.util.Map;

public interface ComplianceService {
    BigDecimal calculateTax(String jurisdiction, BigDecimal annualIncome);
    String getCurrentRulesHash();
    Map<String, Object> getTaxRulesForJurisdictionWithDetails(String jurisdiction);
}