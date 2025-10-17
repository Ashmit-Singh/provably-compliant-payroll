package com.compliantpay.controller;

import com.compliantpay.model.BlockchainTransaction;
import com.compliantpay.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blockchain")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class BlockchainController {
    
    @Autowired
    private BlockchainService blockchainService;
    
    @GetMapping("/transactions")
    public ResponseEntity<List<BlockchainTransaction>> getTransactions() {
        List<BlockchainTransaction> transactions = blockchainService.getTransactionHistory();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/verify/{transactionHash}")
    public ResponseEntity<Boolean> verifyTransaction(@PathVariable String transactionHash) {
        boolean isValid = blockchainService.verifyTransaction(transactionHash);
        return ResponseEntity.ok(isValid);
    }
    
    @GetMapping("/last-hash")
    public ResponseEntity<String> getLastHash() {
        String lastHash = blockchainService.getLastBlockHash();
        return ResponseEntity.ok(lastHash);
    }
}