package com.delevery.deleveryspring.service;

import java.util.List;

import com.delevery.deleveryspring.Model.Category;


public interface CategoryService {

    public Category CreateCategory(String name , Long UserId)throws Exception;

    public List<Category> findCategoryByRestaurantId(Long id)throws Exception;

    public Category FindCategoryBy(Long id) throws Exception;

    public Void DeleteCategoryById(Long id) throws Exception;
    


    
}
