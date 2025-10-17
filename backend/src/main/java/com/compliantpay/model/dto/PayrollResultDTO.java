package com.compliantpay.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class PayrollResultDTO {
    private UUID id;
    private String payPeriod;
    private LocalDateTime runDate;
    private BigDecimal totalAmount;
    private Integer employeeCount;
    private String status;
    private String blockchainTxHash;
    private LocalDateTime processedAt;

    // Constructors
    public PayrollResultDTO() {}

    public PayrollResultDTO(UUID id, String payPeriod, LocalDateTime runDate, 
                           BigDecimal totalAmount, Integer employeeCount, String status) {
        this.id = id;
        this.payPeriod = payPeriod;
        this.runDate = runDate;
        this.totalAmount = totalAmount;
        this.employeeCount = employeeCount;
        this.status = status;
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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}