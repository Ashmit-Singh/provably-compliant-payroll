package com.compliantpay.repository;

import com.compliantpay.model.PayrollRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PayrollRunRepository extends JpaRepository<PayrollRun, UUID> {
    List<PayrollRun> findAllByOrderByRunDateDesc();
    List<PayrollRun> findByStatus(PayrollRun.PayrollStatus status);
}