package com.delevery.deleveryspring.service;

import java.util.List;

import com.delevery.deleveryspring.Dto.RestaurantDto;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.request.CreateRestaurantRequest;

public interface RestaurantService {
    
    public Restaurant createRestaurant(CreateRestaurantRequest req ,User user);

    public Restaurant updateRestaurant(Long RestaurantId, CreateRestaurantRequest updateRestaurant) throws Exception;

    public void deleteRestaurant( Long RestaurantId) throws Exception;

    public List<Restaurant> getAllRestaurant();

    public List<Restaurant> searchRestaurants(String keywoard);

    public Restaurant findRestaurantById(Long id) throws Exception;

    public Restaurant getRestaurantByUserId(Long userId) throws Exception;

    public RestaurantDto addToFavorites(Long restaurant,boolean status , User user) throws Exception;

    // close open restau
    public Restaurant updateRestaurantStatus(Long id) throws Exception;
}
