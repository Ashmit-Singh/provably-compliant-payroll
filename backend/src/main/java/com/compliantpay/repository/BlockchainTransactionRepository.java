package com.compliantpay.repository;

import com.compliantpay.model.BlockchainTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // ADD THIS IMPORT
import java.util.UUID;

@Repository
public interface BlockchainTransactionRepository extends JpaRepository<BlockchainTransaction, UUID> {
    List<BlockchainTransaction> findAllByOrderByTimestampDesc();
    List<BlockchainTransaction> findByTransactionType(String transactionType);
    Optional<BlockchainTransaction> findByTransactionHash(String transactionHash);
}