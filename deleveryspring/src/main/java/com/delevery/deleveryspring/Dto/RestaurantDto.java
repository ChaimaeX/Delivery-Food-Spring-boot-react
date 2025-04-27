package com.delevery.deleveryspring.Dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class RestaurantDto {
    
    private String title;
    
    @Column(length = 1000)
    private List<String> images;

    private String description;

    private Long id;

    @Column(nullable = false)
    private boolean open;

   
}
