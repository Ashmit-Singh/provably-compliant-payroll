package com.compliantpay.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Data Transfer Object for Payroll Request with comprehensive validation
 */
public class PayrollRequestDTO {
    
    @NotBlank(message = "Pay period is required")
    @Size(max = 50, message = "Pay period must not exceed 50 characters")
    private String payPeriod;
    
    @NotNull(message = "Pay date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Future(message = "Pay date must be in the future")
    private LocalDate payDate;
    
    @NotEmpty(message = "Employee IDs list cannot be empty")
    @Size(min = 1, max = 1000, message = "Must include between 1 and 1000 employees")
    private List<UUID> employeeIds;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    @DecimalMax(value = "99999999.99", message = "Total amount must not exceed 99,999,999.99")
    @Digits(integer = 8, fraction = 2, message = "Total amount must have at most 8 integer digits and 2 decimal places")
    private BigDecimal totalAmount;
    
    @Min(value = 1, message = "Employee count must be at least 1")
    @Max(value = 1000, message = "Employee count must not exceed 1000")
    private Integer employeeCount;
    
    @Pattern(regexp = "^(PENDING|PROCESSING|COMPLETED|FAILED|CERTIFIED)$", 
             message = "Status must be one of: PENDING, PROCESSING, COMPLETED, FAILED, CERTIFIED")
    private String status;
    
    @Size(max = 100, message = "Blockchain transaction hash must not exceed 100 characters")
    @Pattern(regexp = "^0x[a-fA-F0-9]{64}$", message = "Invalid blockchain transaction hash format")
    private String blockchainTxHash;
    
    @Size(max = 100, message = "Compliance rules hash must not exceed 100 characters")
    private String complianceRulesHash;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime processedAt;
    
    // Additional validation groups for different scenarios
    public interface Create {}
    public interface Update {}
    public interface Process {}
    
    // Constructors
    public PayrollRequestDTO() {}
    
    public PayrollRequestDTO(String payPeriod, LocalDate payDate, List<UUID> employeeIds, String description) {
        this.payPeriod = payPeriod;
        this.payDate = payDate;
        this.employeeIds = employeeIds;
        this.description = description;
        this.status = "PENDING";
    }
    
    // Getters and Setters
    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }
    
    public LocalDate getPayDate() { return payDate; }
    public void setPayDate(LocalDate payDate) { this.payDate = payDate; }
    
    public List<UUID> getEmployeeIds() { return employeeIds; }
    public void setEmployeeIds(List<UUID> employeeIds) { this.employeeIds = employeeIds; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public Integer getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(Integer employeeCount) { this.employeeCount = employeeCount; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }
    
    public String getComplianceRulesHash() { return complianceRulesHash; }
    public void setComplianceRulesHash(String complianceRulesHash) { this.complianceRulesHash = complianceRulesHash; }
    
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public java.time.LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(java.time.LocalDateTime processedAt) { this.processedAt = processedAt; }
    
    @Override
    public String toString() {
        return "PayrollRequestDTO{" +
                "payPeriod='" + payPeriod + '\'' +
                ", payDate=" + payDate +
                ", employeeIds=" + employeeIds +
                ", description='" + description + '\'' +
                ", totalAmount=" + totalAmount +
                ", employeeCount=" + employeeCount +
                ", status='" + status + '\'' +
                '}';
    }
}
