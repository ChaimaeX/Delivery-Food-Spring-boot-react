package com.delevery.deleveryspring.service;

import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.reposetry.PaymentRespons;

public interface PaymentService  {

    public PaymentRespons createPaymentLink(Order order);

    public String createConnectedAccount(String email);

    public String transferToRestaurant(String restaurantStripeAccountId, long amount);

    public String createOnboardingLink(String restaurantStripeAccountId);
}
