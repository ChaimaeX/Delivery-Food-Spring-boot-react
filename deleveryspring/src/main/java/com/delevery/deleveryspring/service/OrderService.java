package com.delevery.deleveryspring.service;

import java.util.List;

import com.delevery.deleveryspring.Model.Address;
import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.request.OrderRequest;

public interface OrderService {
    public Order createOrder(OrderRequest order, User user,String jwt) throws Exception;

    public Order updateOrder(Long orderId,String orderStatus) throws Exception;

    public void calcelOreder(Long orderId) throws Exception;

    public List<Order> getUsersOrder(Long userId) throws Exception;

    public List<Order> getRestaurantsOrder(Long restaurantId,String orderStatus) throws Exception;

    public Order findOrderById(Long orderId) throws Exception;

    public List<Address> getUsersAddress(User user) throws Exception;
    
    // public Void DeleteOrderAddress(Long id)  throws UnsupportedOperationException;

    // public List<Order> filterOrder(Long restaurantId, String orderStatus) throws Exception;

    public List<Order> findAllOrder() throws Exception ;

    public void deleteAddress(Long id) throws Exception;

    public Order assignDeliveryPerson(Long orderId, User deliveryPerson) throws Exception;

    public List<Order> getOrderByDeliveryPerson(User deliveryPerson) throws Exception;

    public List<Order> findOrderStatus(boolean status);
    
}
