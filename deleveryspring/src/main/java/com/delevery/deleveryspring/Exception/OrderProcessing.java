package com.delevery.deleveryspring.Exception;

    
    public class OrderProcessing extends RuntimeException {
        public OrderProcessing(String message, Throwable cause) {
            super(message, cause);
        }
    }


