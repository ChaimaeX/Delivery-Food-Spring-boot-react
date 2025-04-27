package com.delevery.deleveryspring.request;

import com.delevery.deleveryspring.Model.Address;

import lombok.Data;

@Data
public class OrderRequest {
    private Long restaurantId;
    private Address delivery;
    // private Long TotalAmount;
}
