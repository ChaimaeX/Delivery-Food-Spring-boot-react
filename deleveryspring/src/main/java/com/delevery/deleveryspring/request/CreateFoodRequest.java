package com.delevery.deleveryspring.request;

import java.util.List;

import com.delevery.deleveryspring.Model.Category;
import com.delevery.deleveryspring.Model.IngredientsItem;

import lombok.Data;

@Data
public class CreateFoodRequest {
    private String name;
    private String description;
    private Long price;

    private Category category; // The category object itself. Optionally, this can be a categoryId if you only need the ID.

    private List<String> images; // List of image URLs

    private Long restaurantId; // The restaurant ID (used to associate the food with a restaurant)
    
    private boolean vegetarian; // Corrected the typo from "vegitarin" to "vegetarian"
    
    private boolean seasonal; // Corrected the typo from "seasional" to "seasonal"
    
    private List<IngredientsItem> ingredients; // List of ingredients. Optionally, this can be a list of ingredientIds.
}
