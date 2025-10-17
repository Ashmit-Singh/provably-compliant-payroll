package com.compliantpay.service.impl;

import com.compliantpay.model.*;
import com.compliantpay.repository.EmployeeRepository;
import com.compliantpay.repository.PayrollRunRepository;
import com.compliantpay.service.BlockchainService;
import com.compliantpay.service.ComplianceService;
import com.compliantpay.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PayrollServiceImpl implements PayrollService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private PayrollRunRepository payrollRunRepository;
    
    @Autowired
    private ComplianceService complianceService;
    
    @Autowired
    private BlockchainService blockchainService;
    
    @Transactional
    public PayrollRun processPayroll(PayrollRequest request) {
        // Validate employees
        List<Employee> employees = employeeRepository.findAllById(request.getEmployeeIds());
        if (employees.isEmpty()) {
            throw new RuntimeException("No valid employees found for payroll processing");
        }
        
        // Calculate total payroll
        BigDecimal totalAmount = calculateTotalPayroll(employees);
        
        // Create payroll run record
        PayrollRun payrollRun = new PayrollRun(
            request.getPayPeriod(),
            totalAmount,
            employees.size()
        );
        payrollRun.setStatus(PayrollRun.PayrollStatus.PROCESSING);
        
        PayrollRun savedPayroll = payrollRunRepository.save(payrollRun);
        
        try {
            // Calculate taxes and deductions for each employee
            Map<UUID, BigDecimal> taxCalculations = calculateTaxes(employees);
            
            // Generate payroll data hash for blockchain
            String payrollDataHash = generatePayrollDataHash(employees, taxCalculations);
            
            // Record on blockchain
            String txHash = blockchainService.recordPayrollTransaction(
                savedPayroll.getId().toString(),
                request.getPayPeriod(),
                totalAmount,
                payrollDataHash
            );
            
            // Update payroll run with blockchain info
            savedPayroll.setBlockchainTxHash(txHash);
            savedPayroll.setComplianceRulesHash(complianceService.getCurrentRulesHash());
            savedPayroll.setStatus(PayrollRun.PayrollStatus.CERTIFIED);
            savedPayroll.setProcessedAt(LocalDateTime.now());
            
            return payrollRunRepository.save(savedPayroll);
            
        } catch (Exception e) {
            savedPayroll.setStatus(PayrollRun.PayrollStatus.FAILED);
            payrollRunRepository.save(savedPayroll);
            throw new RuntimeException("Payroll processing failed: " + e.getMessage(), e);
        }
    }
    
    private BigDecimal calculateTotalPayroll(List<Employee> employees) {
        return employees.stream()
            .map(Employee::getSalary)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP); // Monthly amount
    }
    
    private Map<UUID, BigDecimal> calculateTaxes(List<Employee> employees) {
        Map<UUID, BigDecimal> taxResults = new HashMap<>();
        
        for (Employee employee : employees) {
            BigDecimal annualSalary = employee.getSalary();
            BigDecimal taxAmount = complianceService.calculateTax(employee.getLocation(), annualSalary);
            taxResults.put(employee.getId(), taxAmount);
        }
        
        return taxResults;
    }
    
    private String generatePayrollDataHash(List<Employee> employees, Map<UUID, BigDecimal> taxCalculations) {
        // Simple hash generation for demo - in production use proper cryptographic hash
        StringBuilder dataBuilder = new StringBuilder();
        
        for (Employee employee : employees) {
            dataBuilder.append(employee.getEmployeeId())
                      .append(employee.getSalary())
                      .append(taxCalculations.get(employee.getId()));
        }
        
        return Integer.toHexString(dataBuilder.toString().hashCode());
    }
    
    @Override
    public List<PayrollRun> getPayrollHistory() {
        return payrollRunRepository.findAllByOrderByRunDateDesc();
    }
    
    @Override
    public Optional<PayrollRun> getPayrollRun(UUID id) {
        return payrollRunRepository.findById(id);
    }
}