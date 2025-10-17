package com.compliantpay.controller;

import com.compliantpay.service.ComplianceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/compliance")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ComplianceController {
    
    @Autowired
    private ComplianceService complianceService;
    
    @GetMapping("/tax-rules/{jurisdiction}")
    public ResponseEntity<Map<String, Object>> getTaxRules(@PathVariable String jurisdiction) {
        Map<String, Object> rules = complianceService.getTaxRulesForJurisdictionWithDetails(jurisdiction);
        return ResponseEntity.ok(rules);
    }
    
    @GetMapping("/calculate-tax")
    public ResponseEntity<BigDecimal> calculateTax(
            @RequestParam String jurisdiction,
            @RequestParam BigDecimal annualIncome) {
        try {
            BigDecimal taxAmount = complianceService.calculateTax(jurisdiction, annualIncome);
            return ResponseEntity.ok(taxAmount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/rules-hash")
    public ResponseEntity<String> getCurrentRulesHash() {
        String rulesHash = complianceService.getCurrentRulesHash();
        return ResponseEntity.ok(rulesHash);
    }
}