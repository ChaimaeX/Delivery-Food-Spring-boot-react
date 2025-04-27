package com.delevery.deleveryspring.service;

import java.util.List;

import com.delevery.deleveryspring.Model.Category;
import com.delevery.deleveryspring.Model.Food;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.request.CreateFoodRequest;

public interface FoodService {

    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant);

    void deleteFood(Long foodId) throws Exception;

    public List<Food>  getRestaurantsFood(Long restaurantId,
                                          boolean isVegitarian,
                                          boolean isNonveg ,
                                          boolean isSeasonal,
                                          String foodCategory);

    public List<Food> searchFood(String keyword , Long restaurantId);

    public Food findFoodById(Long foodId) throws Exception;

    public Food updateAvailibityStatus(Long foodId) throws Exception;
    
    public List<Food> findTopMeels() throws Exception;

    public List<Food> findAllFood() throws Exception;


}  

