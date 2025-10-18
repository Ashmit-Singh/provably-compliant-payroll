package com.compliantpay.exception;

import org.springframework.http.HttpStatus;

/**
 * Business logic related exceptions
 */
public class BusinessException extends CustomException {
    
    public BusinessException(String message, String errorCode, Object... args) {
        super(message, errorCode, args);
    }
    
    public BusinessException(String message, Throwable cause, String errorCode, Object... args) {
        super(message, cause, errorCode, args);
    }
    
    @Override
    public int getHttpStatus() {
        return HttpStatus.BAD_REQUEST.value();
    }
    
    // Common business exceptions
    public static class EmployeeNotFoundException extends BusinessException {
        public EmployeeNotFoundException(String employeeId) {
            super("Employee not found with ID: " + employeeId, "EMPLOYEE_NOT_FOUND", employeeId);
        }
    }
    
    public static class DuplicateEmployeeException extends BusinessException {
        public DuplicateEmployeeException(String field, String value) {
            super("Employee already exists with " + field + ": " + value, "DUPLICATE_EMPLOYEE", field, value);
        }
    }
    
    public static class PayrollProcessingException extends BusinessException {
        public PayrollProcessingException(String message) {
            super("Payroll processing failed: " + message, "PAYROLL_PROCESSING_FAILED", message);
        }
        
        public PayrollProcessingException(String message, Throwable cause) {
            super("Payroll processing failed: " + message, cause, "PAYROLL_PROCESSING_FAILED", message);
        }
    }
    
    public static class InsufficientDataException extends BusinessException {
        public InsufficientDataException(String message) {
            super("Insufficient data for operation: " + message, "INSUFFICIENT_DATA", message);
        }
    }
    
    public static class ComplianceValidationException extends BusinessException {
        public ComplianceValidationException(String message) {
            super("Compliance validation failed: " + message, "COMPLIANCE_VALIDATION_FAILED", message);
        }
    }
    
    public static class BlockchainTransactionException extends BusinessException {
        public BlockchainTransactionException(String message) {
            super("Blockchain transaction failed: " + message, "BLOCKCHAIN_TRANSACTION_FAILED", message);
        }
        
        public BlockchainTransactionException(String message, Throwable cause) {
            super("Blockchain transaction failed: " + message, cause, "BLOCKCHAIN_TRANSACTION_FAILED", message);
        }
    }
}
