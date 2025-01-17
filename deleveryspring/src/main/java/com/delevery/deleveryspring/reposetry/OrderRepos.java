package com.delevery.deleveryspring.reposetry;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Order;

public interface OrderRepos extends JpaRepository<Order,Long> {
    public List<Order> findByCustomerId(Long userId);

    public List<Order> findByRestaurantId(Long restaurantId);
    
}
