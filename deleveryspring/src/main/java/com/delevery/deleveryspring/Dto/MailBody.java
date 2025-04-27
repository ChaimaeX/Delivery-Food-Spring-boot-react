package com.delevery.deleveryspring.Dto;

import lombok.Builder;

@Builder
public record MailBody( String to, String subject ,String text) {
    
}
