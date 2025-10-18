package com.compliantpay.exception;

/**
 * Base custom exception class for the application
 */
public abstract class CustomException extends RuntimeException {
    
    private final String errorCode;
    private final Object[] args;
    
    protected CustomException(String message, String errorCode, Object... args) {
        super(message);
        this.errorCode = errorCode;
        this.args = args;
    }
    
    protected CustomException(String message, Throwable cause, String errorCode, Object... args) {
        super(message, cause);
        this.errorCode = errorCode;
        this.args = args;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public Object[] getArgs() {
        return args;
    }
    
    public abstract int getHttpStatus();
}
