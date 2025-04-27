package com.delevery.deleveryspring.reposetry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.delevery.deleveryspring.Model.Food;

public interface FoodRepos extends JpaRepository<Food, Long> {
    List<Food> findByRestaurant_Id(Long restaurantId);

    List<Food> findByTopMeelsAndDeletedFalse(boolean topMeels);

    List<Food> findByTopMeels(boolean topMeels);

    @Query("SELECT f FROM Food f WHERE " +
    "(f.name LIKE %:keyword% OR f.foodCategory.name LIKE %:keyword%) " +
    "AND f.restaurant.id = :restaurantId")
    List<Food> searchFoodByRestaurant(
       @Param("keyword") String keyword,
       @Param("restaurantId") Long restaurantId
    );
   
    
}
