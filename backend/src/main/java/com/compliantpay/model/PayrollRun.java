package com.compliantpay.model;

import jakarta.persistence.*;
import jakarta.persistence.Index;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payroll_runs", indexes = {
    @Index(name = "idx_payrollrun_status", columnList = "status"),
    @Index(name = "idx_payrollrun_run_date", columnList = "run_date")
})
public class PayrollRun {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "pay_period", nullable = false)
    private String payPeriod;
    
    @Column(name = "run_date", nullable = false)
    private LocalDateTime runDate;
    
    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "employee_count", nullable = false)
    private Integer employeeCount;
    
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private PayrollStatus status;
    
    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;
    
    @Column(name = "compliance_rules_hash")
    private String complianceRulesHash;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    public enum PayrollStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CERTIFIED
    }
    
    // Constructors
    public PayrollRun() {
        this.runDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.status = PayrollStatus.PENDING;
    }
    
    public PayrollRun(String payPeriod, BigDecimal totalAmount, Integer employeeCount) {
        this();
        this.payPeriod = payPeriod;
        this.totalAmount = totalAmount;
        this.employeeCount = employeeCount;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }
    
    public LocalDateTime getRunDate() { return runDate; }
    public void setRunDate(LocalDateTime runDate) { this.runDate = runDate; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public Integer getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(Integer employeeCount) { this.employeeCount = employeeCount; }
    
    public PayrollStatus getStatus() { return status; }
    public void setStatus(PayrollStatus status) { this.status = status; }
    
    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }
    
    public String getComplianceRulesHash() { return complianceRulesHash; }
    public void setComplianceRulesHash(String complianceRulesHash) { this.complianceRulesHash = complianceRulesHash; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}