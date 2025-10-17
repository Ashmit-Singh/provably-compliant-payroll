package com.compliantpay.service;

import com.compliantpay.model.BlockchainTransaction;

import java.util.List;

public interface BlockchainService {
    
    String recordPayrollTransaction(String payrollId, String payPeriod, 
                                  java.math.BigDecimal totalAmount, String dataHash);
    
    String recordEmployeeTransaction(String transactionType, String employeeId, String details);
    
    List<BlockchainTransaction> getTransactionHistory();
    
    boolean verifyTransaction(String transactionHash);
    
    String getLastBlockHash();
}