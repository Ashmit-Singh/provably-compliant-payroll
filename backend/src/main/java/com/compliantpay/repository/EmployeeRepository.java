package com.compliantpay.repository;

import com.compliantpay.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal; // ADD THIS IMPORT
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByIsActiveTrue();
    
    List<Employee> findByLocation(String location);
    
    @Query("SELECT e.department, COUNT(e) FROM Employee e WHERE e.isActive = true GROUP BY e.department")
    List<Object[]> findEmployeeCountByDepartment();
    
    @Query("SELECT SUM(e.salary) FROM Employee e WHERE e.isActive = true")
    Optional<BigDecimal> findTotalMonthlySalary();
    
    boolean existsByEmployeeId(String employeeId);
    
    boolean existsByEmail(String email);
}