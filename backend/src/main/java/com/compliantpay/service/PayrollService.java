package com.compliantpay.service;

import com.compliantpay.model.PayrollRequest;
import com.compliantpay.model.PayrollRun;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PayrollService {
    
    PayrollRun processPayroll(PayrollRequest request);
    
    List<PayrollRun> getPayrollHistory();
    
    Optional<PayrollRun> getPayrollRun(UUID id);
}