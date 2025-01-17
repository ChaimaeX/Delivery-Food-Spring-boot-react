package com.delevery.deleveryspring.service;

import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.reposetry.PaymentRespons;

public interface PaymentService  {

    public PaymentRespons createPaymentLink(Order order);
}
