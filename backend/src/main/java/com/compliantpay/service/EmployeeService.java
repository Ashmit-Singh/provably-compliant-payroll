package com.compliantpay.service;

import com.compliantpay.model.Employee;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeService {
    
    List<Employee> getAllEmployees();
    
    Optional<Employee> getEmployeeById(UUID id);
    
    Optional<Employee> getEmployeeByEmployeeId(String employeeId);
    
    Employee createEmployee(Employee employee);
    
    Employee updateEmployee(UUID id, Employee employeeDetails);
    
    void deleteEmployee(UUID id);
    
    List<Employee> getEmployeesByDepartment(String department);
    
    BigDecimal getTotalMonthlySalary();
}