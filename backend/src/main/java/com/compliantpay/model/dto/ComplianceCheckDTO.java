package com.compliantpay.model.dto;

import java.time.LocalDateTime;

public class ComplianceCheckDTO {
    private String jurisdiction;
    private String ruleType;
    private String status;
    private String message;
    private LocalDateTime checkedAt;

    // Constructors
    public ComplianceCheckDTO() {}

    public ComplianceCheckDTO(String jurisdiction, String ruleType, String status, String message) {
        this.jurisdiction = jurisdiction;
        this.ruleType = ruleType;
        this.status = status;
        this.message = message;
        this.checkedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getJurisdiction() { return jurisdiction; }
    public void setJurisdiction(String jurisdiction) { this.jurisdiction = jurisdiction; }

    public String getRuleType() { return ruleType; }
    public void setRuleType(String ruleType) { this.ruleType = ruleType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCheckedAt() { return checkedAt; }
    public void setCheckedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; }
}