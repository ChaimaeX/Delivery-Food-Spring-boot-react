package com.delevery.deleveryspring.reposetry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.IngredientsCategory;

public interface IngredientCategoryRepos extends JpaRepository<IngredientsCategory,Long> {
    List<IngredientsCategory> findByRestaurantId(Long Id);
    
}
