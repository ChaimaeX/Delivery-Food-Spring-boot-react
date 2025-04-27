package com.delevery.deleveryspring.Exception;

public class OrderCalculationException extends RuntimeException {
    public OrderCalculationException(String message, Throwable cause) {
        super(message, cause);
    }
}
