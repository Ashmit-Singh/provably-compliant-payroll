package com.compliantpay.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.compliantpay.model.Employee;
import com.compliantpay.service.EmployeeService;
import com.compliantpay.util.SecurityUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;
    
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable UUID id) {
        return employeeService.getEmployeeById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/employee-id/{employeeId}")
    public ResponseEntity<Employee> getEmployeeByEmployeeId(@PathVariable String employeeId) {
        String cleanId = SecurityUtils.sanitize(employeeId);
        return employeeService.getEmployeeByEmployeeId(cleanId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) {
        try {
            // sanitize string fields on server side
            employee.setEmployeeId(SecurityUtils.sanitize(employee.getEmployeeId()));
            employee.setFirstName(SecurityUtils.sanitize(employee.getFirstName()));
            employee.setLastName(SecurityUtils.sanitize(employee.getLastName()));
            employee.setDepartment(SecurityUtils.sanitize(employee.getDepartment()));
            employee.setLocation(SecurityUtils.sanitize(employee.getLocation()));
            Employee createdEmployee = employeeService.createEmployee(employee);
            return ResponseEntity.ok(createdEmployee);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable UUID id, 
            @Valid @RequestBody Employee employeeDetails) {
        try {
            // sanitize fields
            employeeDetails.setFirstName(SecurityUtils.sanitize(employeeDetails.getFirstName()));
            employeeDetails.setLastName(SecurityUtils.sanitize(employeeDetails.getLastName()));
            employeeDetails.setDepartment(SecurityUtils.sanitize(employeeDetails.getDepartment()));
            employeeDetails.setLocation(SecurityUtils.sanitize(employeeDetails.getLocation()));
            Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable UUID id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        String clean = SecurityUtils.sanitize(department);
        List<Employee> employees = employeeService.getEmployeesByDepartment(clean);
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/metrics/total-monthly-salary")
    public ResponseEntity<BigDecimal> getTotalMonthlySalary() {
        BigDecimal totalSalary = employeeService.getTotalMonthlySalary();
        return ResponseEntity.ok(totalSalary);
    }
}