package com.compliantpay.service.impl;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.compliantpay.model.BlockchainTransaction;
import com.compliantpay.service.BlockchainService;
// ...existing code...

@Service
public class BlockchainServiceImpl implements BlockchainService {
    
    private final List<BlockchainTransaction> transactionLedger = new ArrayList<>();
    private String lastHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
    
    @Override
    public String recordPayrollTransaction(String payrollId, String payPeriod, 
                                         java.math.BigDecimal totalAmount, String dataHash) {
        String details = String.format("Payroll Run: %s - Total: $%s", payPeriod, totalAmount);
        
        String transactionHash = generateTransactionHash(
            "PAYROLL_RUN", 
            details, 
            dataHash, 
            lastHash
        );
        
        BlockchainTransaction transaction = new BlockchainTransaction(
            "PAYROLL_RUN",
            details,
            transactionHash,
            dataHash,
            lastHash
        );
        transaction.setStatus("CONFIRMED");
        transaction.setBlockNumber(System.currentTimeMillis());
        
        transactionLedger.add(transaction);
        lastHash = transactionHash;
        
        return transactionHash;
    }
    
    @Override
    public String recordEmployeeTransaction(String transactionType, String employeeId, String details) {
        String dataHash = generateDataHash(employeeId + details);
        String transactionHash = generateTransactionHash(
            transactionType,
            details,
            dataHash,
            lastHash
        );
        
        BlockchainTransaction transaction = new BlockchainTransaction(
            transactionType,
            details,
            transactionHash,
            dataHash,
            lastHash
        );
        transaction.setStatus("CONFIRMED");
        transaction.setBlockNumber(System.currentTimeMillis());
        
        transactionLedger.add(transaction);
        lastHash = transactionHash;
        
        return transactionHash;
    }
    
    private String generateTransactionHash(String type, String details, String dataHash, String previousHash) {
        try {
            String input = type + details + dataHash + previousHash + LocalDateTime.now().toString();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            return "0x" + hexString.toString();
            
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating transaction hash", e);
        }
    }
    
    private String generateDataHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (int i = 0; i < 8; i++) { // Short hash for display
                String hex = Integer.toHexString(0xff & hash[i]);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            return hexString.toString() + "...";
            
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating data hash", e);
        }
    }
    
    @Override
    public List<BlockchainTransaction> getTransactionHistory() {
        return new ArrayList<>(transactionLedger);
    }
    
    @Override
    public boolean verifyTransaction(String transactionHash) {
        return transactionLedger.stream()
            .anyMatch(tx -> tx.getTransactionHash().equals(transactionHash) && 
                           "CONFIRMED".equals(tx.getStatus()));
    }
    
    @Override
    public String getLastBlockHash() {
        return lastHash;
    }
}