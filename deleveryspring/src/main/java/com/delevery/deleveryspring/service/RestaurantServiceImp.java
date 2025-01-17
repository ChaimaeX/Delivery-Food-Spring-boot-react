package com.delevery.deleveryspring.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Dto.RestaurantDto;
import com.delevery.deleveryspring.Model.Address;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.AdressRepos;
import com.delevery.deleveryspring.reposetry.RestaurantRepos;
import com.delevery.deleveryspring.reposetry.UserRepos;
import com.delevery.deleveryspring.request.CreateRestaurantRequest;



@Service
public class RestaurantServiceImp implements RestaurantService {

    @Autowired
    private RestaurantRepos restaurantRepos;

    @Autowired
    private AdressRepos AddressRepos;

    @Autowired
    private UserRepos userRepos;



    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {
        // TODO Auto-generated method stub
        Address address = AddressRepos.save(req.getAddress());
        Restaurant restaurant = new Restaurant();
        restaurant.setAddress(address);
        restaurant.setContact(req.getContactInformation());
        restaurant.setCuisineType(req.getCuisineType());
        restaurant.setDescription(req.getDescription());
        restaurant.setImages(req.getImages());
        restaurant.setName(req.getName());
        restaurant.setOpeninHours(req.getOpeningHours());
        restaurant.setRegistrationDate(LocalDateTime.now());
        restaurant.setOwner(user);



        return restaurantRepos.save(restaurant);
       
    }

    @Override
    public Restaurant updateRestaurant(Long RestaurantId, CreateRestaurantRequest updateRestaurant) throws Exception {
        // TODO Auto-generated method stub
        Restaurant restaurant = findRestaurantById(RestaurantId);
        if(restaurant.getCuisineType()!=null){
            restaurant.setCuisineType(updateRestaurant.getCuisineType());
        }
        if (restaurant.getDescription()!=null) {
            restaurant.setDescription(updateRestaurant.getDescription());
            
        }
        if (restaurant.getName()!=null) {
            restaurant.setName(updateRestaurant.getName());
            
        }

        return restaurantRepos.save(restaurant);
    }

    @Override
    public void deleteRestaurant(Long RestaurantId) throws Exception {
        
        Restaurant restaurant=findRestaurantById(RestaurantId);

        restaurantRepos.delete(restaurant); 

        
    }

    @Override
    public List<Restaurant> getAllRestaurant() {
        // TODO Auto-generated method stub
        List<Restaurant> restaurants = restaurantRepos.findAll();
        return restaurants;
       

    }

    @Override
    public List<Restaurant> searchRestaurants(String keywoard) {
        return restaurantRepos.findBySearchQuery(keywoard);
    }

    @Override
    public Restaurant findRestaurantById(Long id) throws Exception {
        
        Optional<Restaurant> opt = restaurantRepos.findById(id);

        if (opt.isEmpty()) {
            throw new Exception("restaurant not found with id" +id);
        }

        return opt.get();
    }

    @Override
    public Restaurant getRestaurantByUserId(Long userId) throws Exception {

        Restaurant restaurant = restaurantRepos.findByOwnerId(userId);
        if (restaurant==null) {
            throw new Exception("restaurant not found with owner id"+userId);
        }
        return restaurant;
    }

    @Override
    public RestaurantDto addToFavorites(Long restaurantId, User user) throws Exception {
        // TODO Auto-generated method stub
        Restaurant restaurant = findRestaurantById(restaurantId);
        RestaurantDto dto = new RestaurantDto();
        dto.setDescription(restaurant.getDescription());
        dto.setImages(restaurant.getImages());
        dto.setTitle(restaurant.getName());
        dto.setId(restaurantId);

        boolean isFavorited = false;
        List<RestaurantDto> favorites = user.getFavorites();
        for(RestaurantDto favorite : favorites){
            if ( favorite.getId().equals(restaurantId)) {
                isFavorited = true;
                break;
            }
        }

        if (isFavorited) {
            favorites.removeIf(favorite -> favorite.getId().equals(restaurantId));
            
        }else
           favorites.add(dto);

        userRepos.save(user);
        return dto;
    }

    @Override
    public Restaurant updateRestaurantStatus(Long id) throws Exception {
        // TODO Auto-generated method stub
        Restaurant restaurant = findRestaurantById(id);
        restaurant.setOpen(!restaurant.isOpen());
        return restaurantRepos.save(restaurant);
    }
    
}
