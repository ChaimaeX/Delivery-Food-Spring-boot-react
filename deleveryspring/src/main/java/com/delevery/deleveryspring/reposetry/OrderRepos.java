package com.delevery.deleveryspring.reposetry;


import java.util.Collections;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.User;

import jakarta.transaction.Transactional;

public interface OrderRepos extends JpaRepository<Order,Long> {
    public List<Order> findByCustomerId(Long userId);

    default List<Order> findOrdersByCustomerId(Long userId) {
        List<Order> orders = findByCustomerId(userId);
        return orders != null ? orders : Collections.emptyList(); // ← Garantit une liste vide
    }

    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId AND o.deliveryAddress.deleted = false")
    List<Order> findOrders(@Param("userId") Long userId);

    public Order findByDeliveryAddressId(Long addressId);

    public List<Order> findByRestaurantId(Long restaurantId);

    public List<Order> findByDeliveryPerson(User deliveryPerson);

    public List<Order> findByAccepted(Boolean accepted);


    // List<Order> findByOrderStatusAndRestaurantId(String orderStatus, Long restaurantId);

    

   
    
}
