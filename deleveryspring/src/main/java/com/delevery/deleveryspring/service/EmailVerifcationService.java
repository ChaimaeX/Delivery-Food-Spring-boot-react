package com.delevery.deleveryspring.service;

import com.delevery.deleveryspring.mailing.AbstractEmailContext;

import jakarta.mail.MessagingException;


public interface EmailVerifcationService {
    
    void sendMail(final AbstractEmailContext email) throws MessagingException;
}
