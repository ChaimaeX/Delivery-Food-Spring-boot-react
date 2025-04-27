package com.delevery.deleveryspring.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.service.OrderService;
import com.delevery.deleveryspring.service.RestaurantService;
import com.delevery.deleveryspring.service.UserService;

import lombok.Data;



@RestController
@Data
@RequestMapping("/api/aharak")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private OrderService OrderService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
                      @RequestHeader("Authorization") String jwt) throws Exception{

        User Admin =userService.findUserByJwtToken(jwt);
        List<User> users = userService.getAllUsers();
       return new ResponseEntity<>(users,HttpStatus.OK);
    }
    
    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants(
                          @RequestHeader("Authorization") String jwt) throws Exception{
        
        User Admin =userService.findUserByJwtToken(jwt);
        List<Restaurant> restaurants = restaurantService.getAllRestaurant();
       return new ResponseEntity<>(restaurants,HttpStatus.OK);
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders(
        @RequestHeader("Authorization") String jwt) throws Exception{

        User Admin =userService.findUserByJwtToken(jwt);
        List<Order> Orders = OrderService.findAllOrder();
       return new ResponseEntity<>(Orders,HttpStatus.OK);
    }
    
    // @GetMapping("/Orders/{id}")
    // public ResponseEntity<List<Order>> getAllOrders() throws Exception{
    //     List<Order> Orders = OrderService.findAllOrder();
    //    return new ResponseEntity<>(Orders,HttpStatus.OK);
    // }
    
}
