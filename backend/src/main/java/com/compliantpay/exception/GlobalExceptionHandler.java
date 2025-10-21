package com.compliantpay.exception;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

/**
 * Global exception handler for the application
 * Provides centralized error handling and standardized error responses
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /**
     * Handle custom business exceptions
     */
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException ex, WebRequest request) {
        String traceId = generateTraceId();
        logger.warn("Custom exception occurred: {} - TraceId: {}", ex.getMessage(), traceId);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(ex.getHttpStatus())
                .error(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.status(ex.getHttpStatus()).body(errorResponse);
    }
    
    /**
     * Handle validation errors from @Valid annotations
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("Validation error occurred: {} - TraceId: {}", ex.getMessage(), traceId);
        
        List<ErrorResponse.ValidationError> validationErrors = new ArrayList<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            validationErrors.add(new ErrorResponse.ValidationError(
                    error.getField(),
                    error.getRejectedValue(),
                    error.getDefaultMessage()
            ));
        }
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Failed")
                .message("Request validation failed")
                .path(getPath(request))
                .traceId(traceId)
                .validationErrors(validationErrors)
                .build();
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    /**
     * Handle constraint violation exceptions
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("Constraint violation occurred: {} - TraceId: {}", ex.getMessage(), traceId);
        
        List<ErrorResponse.ValidationError> validationErrors = new ArrayList<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String propertyPath = violation.getPropertyPath().toString();
            validationErrors.add(new ErrorResponse.ValidationError(
                    propertyPath,
                    violation.getInvalidValue(),
                    violation.getMessage()
            ));
        }
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Constraint Violation")
                .message("Request constraint validation failed")
                .path(getPath(request))
                .traceId(traceId)
                .validationErrors(validationErrors)
                .build();
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    /**
     * Handle data integrity violations (e.g., unique constraint violations)
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.error("Data integrity violation occurred: {} - TraceId: {}", ex.getMessage(), traceId);
        
        String message = "Data integrity violation occurred";
        if (ex.getMessage().contains("duplicate key")) {
            message = "Duplicate entry found. Please check your data and try again.";
        } else if (ex.getMessage().contains("foreign key")) {
            message = "Referenced data not found. Please check your references.";
        }
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .error("Data Integrity Violation")
                .message(message)
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
    
    /**
     * Handle authentication exceptions
     */
    @ExceptionHandler({AuthenticationException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("Authentication failed: {} - TraceId: {}", ex.getMessage(), traceId);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Authentication Failed")
                .message("Invalid credentials or authentication required")
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
    
    /**
     * Handle access denied exceptions
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("Access denied: {} - TraceId: {}", ex.getMessage(), traceId);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .error("Access Denied")
                .message("Insufficient permissions to access this resource")
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }
    
    /**
     * Handle malformed JSON requests
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("Malformed JSON request: {} - TraceId: {}", ex.getMessage(), traceId);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Malformed Request")
                .message("Invalid JSON format in request body")
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    /**
     * Handle missing request parameters
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("Missing request parameter: {} - TraceId: {}", ex.getMessage(), traceId);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Missing Parameter")
                .message("Required parameter '" + ex.getParameterName() + "' is missing")
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    /**
     * Handle method argument type mismatch
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("Type mismatch: {} - TraceId: {}", ex.getMessage(), traceId);
        
        Class<?> requiredType = ex.getRequiredType();
        String typeName = (requiredType != null) ? requiredType.getSimpleName() : "unknown";
        String message = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s",
                ex.getValue(), ex.getName(), typeName);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Type Mismatch")
                .message(message)
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    /**
     * Handle unsupported HTTP methods
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("Unsupported HTTP method: {} - TraceId: {}", ex.getMessage(), traceId);
        
        String message = String.format("Method '%s' is not supported for this endpoint. Supported methods: %s",
                ex.getMethod(), String.join(", ", ex.getSupportedMethods()));
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.METHOD_NOT_ALLOWED.value())
                .error("Method Not Allowed")
                .message(message)
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
    }
    
    /**
     * Handle 404 errors
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(
            NoHandlerFoundException ex, WebRequest request) {
        
        String traceId = generateTraceId();
        logger.warn("No handler found: {} - TraceId: {}", ex.getMessage(), traceId);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("Not Found")
                .message("The requested resource was not found")
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        String traceId = generateTraceId();
        logger.error("Unexpected error occurred: {} - TraceId: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message("An unexpected error occurred. Please try again later.")
                .path(getPath(request))
                .traceId(traceId)
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    
    /**
     * Generate a unique trace ID for request tracking
     */
    private String generateTraceId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
    
    /**
     * Extract the request path from WebRequest
     */
    private String getPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }
}