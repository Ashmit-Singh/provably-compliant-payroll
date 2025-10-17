package com.compliantpay.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class EmployeeDTO {
    private UUID id;
    private String employeeId;
    private String name;
    private String department;
    private BigDecimal salary;
    private String benefitPlan;
    private String location;
    private String email;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public EmployeeDTO() {}

    public EmployeeDTO(UUID id, String employeeId, String name, String department, 
                      BigDecimal salary, String benefitPlan, String location) {
        this.id = id;
        this.employeeId = employeeId;
        this.name = name;
        this.department = department;
        this.salary = salary;
        this.benefitPlan = benefitPlan;
        this.location = location;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }

    public String getBenefitPlan() { return benefitPlan; }
    public void setBenefitPlan(String benefitPlan) { this.benefitPlan = benefitPlan; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}