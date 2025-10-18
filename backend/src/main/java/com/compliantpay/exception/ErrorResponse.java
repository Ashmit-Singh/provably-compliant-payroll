package com.compliantpay.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Standardized error response structure for API errors
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    private int status;
    private String error;
    private String message;
    private String path;
    private String traceId;
    private List<ValidationError> validationErrors;
    private Map<String, Object> details;
    
    // Constructors
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    public ErrorResponse(int status, String error, String message, String path) {
        this();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
    
    public ErrorResponse(int status, String error, String message, String path, List<ValidationError> validationErrors) {
        this(status, error, message, path);
        this.validationErrors = validationErrors;
    }
    
    // Builder pattern for complex error responses
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private ErrorResponse errorResponse;
        
        public Builder() {
            this.errorResponse = new ErrorResponse();
        }
        
        public Builder status(int status) {
            errorResponse.status = status;
            return this;
        }
        
        public Builder error(String error) {
            errorResponse.error = error;
            return this;
        }
        
        public Builder message(String message) {
            errorResponse.message = message;
            return this;
        }
        
        public Builder path(String path) {
            errorResponse.path = path;
            return this;
        }
        
        public Builder traceId(String traceId) {
            errorResponse.traceId = traceId;
            return this;
        }
        
        public Builder validationErrors(List<ValidationError> validationErrors) {
            errorResponse.validationErrors = validationErrors;
            return this;
        }
        
        public Builder details(Map<String, Object> details) {
            errorResponse.details = details;
            return this;
        }
        
        public ErrorResponse build() {
            return errorResponse;
        }
    }
    
    // Validation error inner class
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ValidationError {
        private String field;
        private Object rejectedValue;
        private String message;
        
        public ValidationError() {}
        
        public ValidationError(String field, Object rejectedValue, String message) {
            this.field = field;
            this.rejectedValue = rejectedValue;
            this.message = message;
        }
        
        // Getters and Setters
        public String getField() { return field; }
        public void setField(String field) { this.field = field; }
        
        public Object getRejectedValue() { return rejectedValue; }
        public void setRejectedValue(Object rejectedValue) { this.rejectedValue = rejectedValue; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
    
    // Getters and Setters
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    
    public String getTraceId() { return traceId; }
    public void setTraceId(String traceId) { this.traceId = traceId; }
    
    public List<ValidationError> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(List<ValidationError> validationErrors) { this.validationErrors = validationErrors; }
    
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
    
    @Override
    public String toString() {
        return "ErrorResponse{" +
                "timestamp=" + timestamp +
                ", status=" + status +
                ", error='" + error + '\'' +
                ", message='" + message + '\'' +
                ", path='" + path + '\'' +
                ", traceId='" + traceId + '\'' +
                '}';
    }
}
