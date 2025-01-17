package com.delevery.deleveryspring.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.Category;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.reposetry.CategoryRepos;

@Service
public class CategoryServiceImp implements CategoryService {
    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CategoryRepos categoryRepos;

    
    @Override
    public Category CreateCategory(String name, Long UserId) throws Exception{
        Restaurant restaurant = restaurantService.getRestaurantByUserId(UserId);
        Category category = new Category();
        category.setName(name);
        category.setRestaurant(restaurant);
        return categoryRepos.save(category);
    }

    @Override
    public List<Category> findCategoryByRestaurantId(Long id) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(id);//change
        return categoryRepos.findByRestaurantId(restaurant.getId());
    }

    @Override
    public Category FindCategoryBy(Long id) throws Exception {
        Optional<Category> optionalCategory = categoryRepos.findById(id);

        if (optionalCategory.isEmpty()) {
            throw new Exception("category not found");

        }
        return optionalCategory.get();

       
    }
    
}
