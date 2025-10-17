package com.compliantpay.repository;

import com.compliantpay.model.TaxRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaxRuleRepository extends JpaRepository<TaxRule, UUID> {
    List<TaxRule> findByJurisdictionAndIsActiveTrue(String jurisdiction);
    List<TaxRule> findByIsActiveTrue();
}