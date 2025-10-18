package com.compliantpay.controller;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.compliantpay.service.ComplianceService;
import com.compliantpay.util.SecurityUtils;

@RestController
@RequestMapping("/api/compliance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ComplianceController {

    @Autowired
    private ComplianceService complianceService;

    @GetMapping("/tax-rules/{jurisdiction}")
    public ResponseEntity<Map<String, Object>> getTaxRules(@PathVariable String jurisdiction) {
        String clean = SecurityUtils.sanitize(jurisdiction);
        Map<String, Object> rules = complianceService.getTaxRulesForJurisdictionWithDetails(clean);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/calculate-tax")
    public ResponseEntity<Map<String, BigDecimal>> calculateTax(
            @RequestParam String jurisdiction,
            @RequestParam BigDecimal annualIncome) {
        try {
            String clean = SecurityUtils.sanitize(jurisdiction);
            BigDecimal taxAmount = complianceService.calculateTax(clean, annualIncome);
            return ResponseEntity.ok(Map.of("calculatedTax", taxAmount));
        } catch (Exception e) {
            // In a real app, handle exceptions more gracefully
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/rules-hash")
    public ResponseEntity<String> getCurrentRulesHash() {
        String rulesHash = complianceService.getCurrentRulesHash();
        return ResponseEntity.ok(rulesHash);
    }
}