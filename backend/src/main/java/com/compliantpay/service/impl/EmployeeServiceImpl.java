package com.compliantpay.service.impl;

import com.compliantpay.model.Employee;
import com.compliantpay.repository.EmployeeRepository;
import com.compliantpay.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findByIsActiveTrue();
    }
    
    @Override
    public Optional<Employee> getEmployeeById(UUID id) {
        return employeeRepository.findById(id);
    }
    
    @Override
    public Optional<Employee> getEmployeeByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId);
    }
    
    @Override
    public Employee createEmployee(Employee employee) {
        // Generate employee ID if not provided
        if (employee.getEmployeeId() == null || employee.getEmployeeId().trim().isEmpty()) {
            String newEmployeeId = generateEmployeeId();
            employee.setEmployeeId(newEmployeeId);
        }
        
        // Validate unique constraints
        if (employeeRepository.existsByEmployeeId(employee.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID already exists: " + employee.getEmployeeId());
        }
        
        if (employee.getEmail() != null && employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + employee.getEmail());
        }
        
        return employeeRepository.save(employee);
    }
    
    @Override
    public Employee updateEmployee(UUID id, Employee employeeDetails) {
        return employeeRepository.findById(id)
            .map(employee -> {
                employee.setFirstName(employeeDetails.getFirstName());
                employee.setLastName(employeeDetails.getLastName());
                employee.setDepartment(employeeDetails.getDepartment());
                employee.setSalary(employeeDetails.getSalary());
                employee.setBenefitPlan(employeeDetails.getBenefitPlan());
                employee.setLocation(employeeDetails.getLocation());
                employee.setEmail(employeeDetails.getEmail());
                return employeeRepository.save(employee);
            })
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }
    
    @Override
    public void deleteEmployee(UUID id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employee.setIsActive(false);
        employeeRepository.save(employee);
    }
    
    @Override
    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }
    
    @Override
    public BigDecimal getTotalMonthlySalary() {
        return employeeRepository.findTotalMonthlySalary()
            .orElse(BigDecimal.ZERO)
            .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
    }
    
    private String generateEmployeeId() {
        long count = employeeRepository.count();
        return String.format("EMP%04d", count + 1);
    }
}