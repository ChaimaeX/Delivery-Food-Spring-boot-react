package com.delevery.deleveryspring.service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.Category;
import com.delevery.deleveryspring.Model.Food;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.reposetry.FoodRepos;
import com.delevery.deleveryspring.request.CreateFoodRequest;

@Service
public class FoodServiceImp implements FoodService{

    @Autowired
    private FoodRepos foodRepos;

    

    @Override
    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant) {
        // TODO Auto-generated method stub
        Food food = new Food();
        food.setFoodCategory(category);
        food.setRestaurant(restaurant);
        food.setDesciption(req.getDescription());
        food.setImages(req.getImages());
        food.setName(req.getName());
        food.setPrice(req.getPrice());
        food.setIntegredients(req.getIngredients());
        food.setSeasonal(req.isSeasonal());
        food.setIsvegetarian(req.isVegetarian());
        food.setCreationDate(new Date(0));

        Food saveFood=foodRepos.save(food);
        restaurant.getFoods().add(saveFood);

        return foodRepos.save(saveFood);
    }

    @Override
    public void deleteFood(Long foodId) throws Exception {
        Food food = findFoodById(foodId);
        food.setRestaurant(null);
        foodRepos.save(food);
       
    }

    public List<Food> getRestaurantsFood(Long restaurantId,
                                      boolean isVegetarian,
                                      boolean isNonveg,
                                      boolean isSeasonal,
                                      String foodCategory) {
               
                List<Food> foods = foodRepos.findByRestaurant_Id(restaurantId);
                
                if (foods == null || foods.isEmpty()) {
                      System.out.println("Aucun aliment trouvé pour ce restaurant.");
                       return foods;  // Retourne une liste vide si aucun aliment n'est trouvé
                }

                if (isVegetarian) {
                       foods = filterByVegetarian(foods, isVegetarian);
                       
                }
                if (isNonveg) {
                       foods = filterByNouveg(foods, isNonveg);
                 }
                 if (isSeasonal) {
                       foods = filterByisSeasonal(foods, isSeasonal);
                 }
                if (foodCategory != null && !foodCategory.trim().isEmpty()) {
                      foods = filterByCategory(foods, foodCategory);
                 }
    
                  return foods;
                }

                        
    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
              return foods.stream().filter(food ->{
                if (food.getFoodCategory()!=null) {
                    return food.getFoodCategory().getName().equals(foodCategory);
                }
                return false;
              }).collect(Collectors.toList());   
    }
            
    private List<Food> filterByVegetarian(List<Food> foods, boolean isVegitarian) {
             
        // System.err.println("foods:  "+foods);
        return foods.stream().filter(food -> food.isIsvegetarian()==
        isVegitarian).collect(Collectors.toList());
          
    }
    private List<Food> filterByNouveg(List<Food> foods, boolean isNonveg) {
        return foods.stream().filter(food -> food.isIsvegetarian()==false).collect(Collectors.toList());
    }
    private List<Food> filterByisSeasonal(List<Food> foods, boolean isSeasional) {
        return foods.stream().filter(food -> food.isSeasonal()==isSeasional).collect(Collectors.toList());
    }
            
    @Override
    public List<Food> searchFood(String keyword) {
    
        // return foodRepos.searchFood(keyword);
        return null;
    }

    @Override
    public Food findFoodById(Long foodId) throws Exception {
        Optional<Food> optionalFood=foodRepos.findById(foodId);

        if (optionalFood.isEmpty()) {
            throw new Exception("food not exist ....");
        }
        return optionalFood.get();
    }

    @Override
    public Food updateAvailibityStatus(Long foodId) throws Exception {
       Food food=findFoodById(foodId);
       food.setAvailable(!food.isAvailable());
       
       return foodRepos.save(food);
    }

    
    
}
