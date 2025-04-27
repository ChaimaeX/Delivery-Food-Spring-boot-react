package com.delevery.deleveryspring.Exception;


    
    public class OrderProcessingException extends RuntimeException {
        public OrderProcessingException(String message, Throwable cause) {
            super(message, cause);
        }
    }


