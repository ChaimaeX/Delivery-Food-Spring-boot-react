package com.delevery.deleveryspring.request;

import java.util.List;

import com.delevery.deleveryspring.Model.CartIngredients;

import lombok.Data;

@Data
public class AddCartItemRequest {
    private Long foodId;
    private int quantity;

    private List<String> ingredients;
}
