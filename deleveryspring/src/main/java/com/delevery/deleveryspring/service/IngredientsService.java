package com.delevery.deleveryspring.service;

import java.util.List;

import com.delevery.deleveryspring.Model.IngredientsCategory;
import com.delevery.deleveryspring.Model.IngredientsItem;

public interface IngredientsService {
    
    public IngredientsCategory createIngredientsCategory(String name , Long restaurant) throws Exception;

    public IngredientsCategory  findIngredientsCategoryById(Long id) throws Exception;

    public List<IngredientsCategory> findIngredientsCategoryByRestaurantId(Long id) throws Exception;

    public IngredientsItem createIngredientsItem(Long restaurantId,String ingredientName , Long categoryId) throws Exception;

    public List<IngredientsItem> findRestaurantsIngredients(Long restaurantId);

    public IngredientsItem updateStock(Long id) throws Exception;

    

    


}
