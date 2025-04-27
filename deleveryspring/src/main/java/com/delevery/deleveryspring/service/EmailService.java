package com.delevery.deleveryspring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Dto.MailBody;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleEmail(MailBody mailBody) throws MailException {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(mailBody.to());
            message.setSubject(mailBody.subject());
            message.setText(mailBody.text());
            message.setFrom("aharakchaimae1212@gmail.com");
            
            mailSender.send(message); // Lance MailException si échec
            
        } catch (MailException e) {
            System.err.println("ÉCHEC ENVOI EMAIL : " + e.getMessage());
            throw e; // Relance l'exception pour annuler la transaction
        }
    }
}