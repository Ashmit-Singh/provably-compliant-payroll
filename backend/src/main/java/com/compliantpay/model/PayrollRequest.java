package com.compliantpay.model;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PayrollRequest {
    
    @NotBlank(message = "Pay period is required")
    private String payPeriod;
    
    @NotNull(message = "Employee IDs are required")
    private List<UUID> employeeIds;
    
    private Boolean includeBenefits = true;
    private Boolean processPayments = false;
    
    // Getters and Setters
    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }
    
    public List<UUID> getEmployeeIds() { return employeeIds; }
    public void setEmployeeIds(List<UUID> employeeIds) { this.employeeIds = employeeIds; }
    
    public Boolean getIncludeBenefits() { return includeBenefits; }
    public void setIncludeBenefits(Boolean includeBenefits) { this.includeBenefits = includeBenefits; }
    
    public Boolean getProcessPayments() { return processPayments; }
    public void setProcessPayments(Boolean processPayments) { this.processPayments = processPayments; }
}