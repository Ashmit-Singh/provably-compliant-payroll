package com.compliantpay.controller;

import com.compliantpay.model.PayrollRequest;
import com.compliantpay.model.PayrollRun;
import com.compliantpay.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PayrollController {
    
    @Autowired
    private PayrollService payrollService;
    
    @PostMapping("/run")
    public ResponseEntity<?> runPayroll(@Valid @RequestBody PayrollRequest request) {
        try {
            PayrollRun result = payrollService.processPayroll(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse("Payroll processing failed: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<PayrollRun>> getPayrollHistory() {
        List<PayrollRun> history = payrollService.getPayrollHistory();
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/run/{id}")
    public ResponseEntity<PayrollRun> getPayrollRun(@PathVariable UUID id) {
        return payrollService.getPayrollRun(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Helper class for error responses
    public static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}