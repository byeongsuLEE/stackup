package com.ssafy.stackup.common.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    public ResourceNotFoundException() {
        super();
    }
    public ResourceNotFoundException(Throwable cause) {
        super(cause);
    }
}
