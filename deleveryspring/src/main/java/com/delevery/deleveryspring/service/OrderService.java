package com.delevery.deleveryspring.service;

import java.util.List;

import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.request.OrderRequest;

public interface OrderService {
    public Order createOrder(OrderRequest order, User user) throws Exception;

    public Order updateOrder(Long orderId,String orderStatus) throws Exception;

    public void calcelOreder(Long orderId) throws Exception;

    public List<Order> getUsersOrder(Long userId) throws Exception;

    public List<Order> getRestaurantsOrder(Long restaurantId,String orderStatus) throws Exception;

     public Order findOrderById(Long orderId) throws Exception;
    
}
