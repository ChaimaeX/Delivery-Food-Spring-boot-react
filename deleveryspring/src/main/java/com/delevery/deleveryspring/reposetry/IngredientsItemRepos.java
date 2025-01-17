package com.delevery.deleveryspring.reposetry;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.IngredientsItem;

public interface IngredientsItemRepos extends JpaRepository<IngredientsItem,Long>{


    List<IngredientsItem>  findByRestaurantId(Long id); 
    
}