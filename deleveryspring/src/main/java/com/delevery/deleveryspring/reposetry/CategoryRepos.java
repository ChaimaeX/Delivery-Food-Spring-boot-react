package com.delevery.deleveryspring.reposetry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Category;

public interface CategoryRepos extends JpaRepository<Category,Long> {

    public List<Category> findByRestaurantId(Long id);
    
}
