package com.compliantpay.service;

import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> predictLegislationImpact(String legislationText, Map<String, Object> employeeData);
    Map<String, Object> getPayrollTrends();
}