package com.compliantpay.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "blockchain_transactions")
public class BlockchainTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "transaction_type", nullable = false)
    private String transactionType; // PAYROLL_RUN, EMPLOYEE_UPDATE, etc.
    
    @Column(name = "details", nullable = false)
    private String details;
    
    @Column(name = "transaction_hash", unique = true, nullable = false)
    private String transactionHash;
    
    @Column(name = "data_hash", nullable = false)
    private String dataHash;
    
    @Column(name = "previous_hash", nullable = false)
    private String previousHash;
    
    @Column(name = "block_number")
    private Long blockNumber;
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "status", nullable = false)
    private String status; // PENDING, CONFIRMED, FAILED
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public BlockchainTransaction() {
        this.timestamp = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }
    
    public BlockchainTransaction(String transactionType, String details, 
                               String transactionHash, String dataHash, String previousHash) {
        this();
        this.transactionType = transactionType;
        this.details = details;
        this.transactionHash = transactionHash;
        this.dataHash = dataHash;
        this.previousHash = previousHash;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    
    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }
    
    public String getDataHash() { return dataHash; }
    public void setDataHash(String dataHash) { this.dataHash = dataHash; }
    
    public String getPreviousHash() { return previousHash; }
    public void setPreviousHash(String previousHash) { this.previousHash = previousHash; }
    
    public Long getBlockNumber() { return blockNumber; }
    public void setBlockNumber(Long blockNumber) { this.blockNumber = blockNumber; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}