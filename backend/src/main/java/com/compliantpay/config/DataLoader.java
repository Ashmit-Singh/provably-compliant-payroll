package com.compliantpay.config;

import com.compliantpay.model.Employee;
import com.compliantpay.model.PayrollRun;
import com.compliantpay.repository.EmployeeRepository;
import com.compliantpay.repository.PayrollRunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

// @Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PayrollRunRepository payrollRunRepository;

    @Override
    public void run(String... args) throws Exception {
        // Load sample data if database is empty
        if (employeeRepository.count() == 0) {
            loadSampleData();
        }
    }

    private void loadSampleData() {
        loadSampleEmployees();
        loadSamplePayrollRuns();
    }

    private void loadSampleEmployees() {
        // Employee 1
        Employee emp1 = new Employee();
        emp1.setId(UUID.fromString("11111111-1111-1111-1111-111111111111"));
        emp1.setEmployeeId("EMP001");
        emp1.setFirstName("Alice");
        emp1.setLastName("Johnson");
        emp1.setDepartment("Engineering");
        emp1.setSalary(new BigDecimal("120000.00"));
        emp1.setBenefitPlan("Premium Health");
        emp1.setLocation("USA - California");
        emp1.setEmail("alice.johnson@company.com");
        emp1.setIsActive(true);
        emp1.setCreatedAt(LocalDateTime.now());
        emp1.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp1);

        // Employee 2
        Employee emp2 = new Employee();
        emp2.setId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
        emp2.setEmployeeId("EMP002");
        emp2.setFirstName("Bob");
        emp2.setLastName("Williams");
        emp2.setDepartment("Product");
        emp2.setSalary(new BigDecimal("115000.00"));
        emp2.setBenefitPlan("Standard Health + Vision");
        emp2.setLocation("USA - California");
        emp2.setEmail("bob.williams@company.com");
        emp2.setIsActive(true);
        emp2.setCreatedAt(LocalDateTime.now());
        emp2.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp2);

        // Employee 3
        Employee emp3 = new Employee();
        emp3.setId(UUID.fromString("33333333-3333-3333-3333-333333333333"));
        emp3.setEmployeeId("EMP003");
        emp3.setFirstName("Charlie");
        emp3.setLastName("Brown");
        emp3.setDepartment("Marketing");
        emp3.setSalary(new BigDecimal("95000.00"));
        emp3.setBenefitPlan("Standard Health");
        emp3.setLocation("Canada - Ontario");
        emp3.setEmail("charlie.brown@company.com");
        emp3.setIsActive(true);
        emp3.setCreatedAt(LocalDateTime.now());
        emp3.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp3);

        // Employee 4
        Employee emp4 = new Employee();
        emp4.setId(UUID.fromString("44444444-4444-4444-4444-444444444444"));
        emp4.setEmployeeId("EMP004");
        emp4.setFirstName("Diana");
        emp4.setLastName("Miller");
        emp4.setDepartment("Engineering");
        emp4.setSalary(new BigDecimal("145000.00"));
        emp4.setBenefitPlan("Premium Health + Dental");
        emp4.setLocation("USA - California");
        emp4.setEmail("diana.miller@company.com");
        emp4.setIsActive(true);
        emp4.setCreatedAt(LocalDateTime.now());
        emp4.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp4);

        // Employee 5
        Employee emp5 = new Employee();
        emp5.setId(UUID.fromString("55555555-5555-5555-5555-555555555555"));
        emp5.setEmployeeId("EMP005");
        emp5.setFirstName("Ethan");
        emp5.setLastName("Davis");
        emp5.setDepartment("Sales");
        emp5.setSalary(new BigDecimal("105000.00"));
        emp5.setBenefitPlan("Standard Health");
        emp5.setLocation("India - Tamil Nadu");
        emp5.setEmail("ethan.davis@company.com");
        emp5.setIsActive(true);
        emp5.setCreatedAt(LocalDateTime.now());
        emp5.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp5);

        // Employee 6
        Employee emp6 = new Employee();
        emp6.setId(UUID.fromString("66666666-6666-6666-6666-666666666666"));
        emp6.setEmployeeId("EMP006");
        emp6.setFirstName("Fiona");
        emp6.setLastName("Garcia");
        emp6.setDepartment("HR");
        emp6.setSalary(new BigDecimal("88000.00"));
        emp6.setBenefitPlan("Standard Health + Vision");
        emp6.setLocation("Canada - Ontario");
        emp6.setEmail("fiona.garcia@company.com");
        emp6.setIsActive(true);
        emp6.setCreatedAt(LocalDateTime.now());
        emp6.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp6);

        // Employee 7
        Employee emp7 = new Employee();
        emp7.setId(UUID.fromString("77777777-7777-7777-7777-777777777777"));
        emp7.setEmployeeId("EMP007");
        emp7.setFirstName("George");
        emp7.setLastName("Rodriguez");
        emp7.setDepartment("Engineering");
        emp7.setSalary(new BigDecimal("130000.00"));
        emp7.setBenefitPlan("Premium Health");
        emp7.setLocation("USA - California");
        emp7.setEmail("george.rodriguez@company.com");
        emp7.setIsActive(true);
        emp7.setCreatedAt(LocalDateTime.now());
        emp7.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp7);

        System.out.println("Sample employees loaded successfully!");
    }

    private void loadSamplePayrollRuns() {
        // Sample payroll run 1
        PayrollRun payroll1 = new PayrollRun();
        payroll1.setId(UUID.fromString("88888888-8888-8888-8888-888888888888"));
        payroll1.setPayPeriod("September 2025");
        payroll1.setRunDate(LocalDateTime.of(2025, 9, 30, 17, 0, 0));
        payroll1.setTotalAmount(new BigDecimal("71800.00"));
        payroll1.setEmployeeCount(7);
        payroll1.setStatus(PayrollRun.PayrollStatus.CERTIFIED);
        payroll1.setBlockchainTxHash("0x4a2b1c8d9e0f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b");
        payroll1.setComplianceRulesHash("a1b2c3d4");
        payroll1.setCreatedAt(LocalDateTime.now());
        payroll1.setProcessedAt(LocalDateTime.now());
        payrollRunRepository.save(payroll1);

        // Sample payroll run 2
        PayrollRun payroll2 = new PayrollRun();
        payroll2.setId(UUID.fromString("99999999-9999-9999-9999-999999999999"));
        payroll2.setPayPeriod("October 2025");
        payroll2.setRunDate(LocalDateTime.of(2025, 10, 31, 17, 0, 0));
        payroll2.setTotalAmount(new BigDecimal("72300.00"));
        payroll2.setEmployeeCount(7);
        payroll2.setStatus(PayrollRun.PayrollStatus.CERTIFIED);
        payroll2.setBlockchainTxHash("0x5b3c2d9e0f1a4b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8b0c");
        payroll2.setComplianceRulesHash("a1b2c3d4");
        payroll2.setCreatedAt(LocalDateTime.now());
        payroll2.setProcessedAt(LocalDateTime.now());
        payrollRunRepository.save(payroll2);

        System.out.println("Sample payroll runs loaded successfully!");
    }
}