package com.delevery.deleveryspring.service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.Address;
import com.delevery.deleveryspring.Model.Cart;
import com.delevery.deleveryspring.Model.CartItem;
import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.Orderitem;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.AdressRepos;
import com.delevery.deleveryspring.reposetry.OrderItemRepos;
import com.delevery.deleveryspring.reposetry.OrderRepos;
import com.delevery.deleveryspring.reposetry.UserRepos;
import com.delevery.deleveryspring.request.OrderRequest;

@Service
public class OrderServiceImp implements OrderService{


    @Autowired
    private OrderItemRepos orderItemRepos;

    @Autowired
    private OrderRepos orderRepos;

    @Autowired
    private AdressRepos adressRepos;

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CartService cartService;

    @Override
    public Order createOrder(OrderRequest order, User user) throws Exception {
        Address shippAdrees=order.getDelivery();

        Address saveAddress = adressRepos.save(shippAdrees);
        if (!user.getAddresses().contains(saveAddress)) {
            user.getAddresses().add(saveAddress);
            userRepos.save(user);  
        }
        Restaurant restaurant=restaurantService.findRestaurantById(order.getRestaurantId());

        Order createdOrder = new Order();
        createdOrder.setCustomer(user);
        // createdOrder.setCreatedAt(new Date(0));
        createdOrder.setOrderStatus("OENDIG");
        createdOrder.setDeliveryAddress(saveAddress);
        createdOrder.setRestaurant(restaurant);

        Cart cart=cartService.findCartById(user.getId());

        List<Orderitem> orderItems =new ArrayList<>();

        for(CartItem cartItem:cart.getItem()){
             Orderitem orderitem = new Orderitem();
             orderitem.setFood(cartItem.getFood());
             orderitem.setIngredients(cartItem.getIngredients());
             orderitem.setQuantity(cartItem.getQuantity());
             orderitem.setTotalPrice(cartItem.getTotalPrice());
             
             Orderitem savedOrderItem=orderItemRepos.save(orderitem);
             orderItems.add(savedOrderItem);
        }
        Long totalPrice=cartService.calculateCartTotal(cart);

        createdOrder.setItems(orderItems);
        createdOrder.setTotalPrice(totalPrice);

        Order savedOrder = orderRepos.save(createdOrder);

        restaurant.getOrders().add(savedOrder);
        return createdOrder;

    }

    @Override
    public Order updateOrder(Long orderId, String orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        if (orderStatus.equals("OUT_FOR_DELIVERY") 
            || orderStatus.equals("DELIVERED") 
            || orderStatus.equals("COMPLETED")
            || orderStatus.equals("PENDING")) {

            order.setOrderStatus(orderStatus);
            return orderRepos.save(order);
        }
        throw new Exception("PLEASE SELECT A VALID ORDER STATUS");
    }

    @Override
    public void calcelOreder(Long orderId) throws Exception {
        Order order = findOrderById(orderId);
        orderRepos.deleteById(orderId);
        throw new UnsupportedOperationException("Unimplemented method 'calculeOreder'");
    }

    @Override
    public List<Order> getUsersOrder(Long userId) throws Exception {
        
        return orderRepos.findByCustomerId(userId);

    }

    @Override
    public List<Order> getRestaurantsOrder(Long restaurantId, String orderStatus) throws Exception {
      List<Order> orders= orderRepos.findByRestaurantId(restaurantId);
      if (orderStatus!=null) {
        orders = orders.stream().filter(order->
           order.getOrderStatus().equals(orderStatus)).collect(Collectors.toList());
      }
      return orders; 
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> optionalOrder=orderRepos.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new Exception("order not found ");
        }

        return optionalOrder.get();
    }
    
}
