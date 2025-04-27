package com.delevery.deleveryspring.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.delevery.deleveryspring.Model.Delivery;
import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.service.OrderService;
import com.delevery.deleveryspring.service.UserService;
import com.delevery.deleveryspring.service.order_deleveryService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/delivery")
public class DeleveryController {

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private order_deleveryService order_deleveryService;

    @PostMapping("/orders/{orderId}")
    public ResponseEntity<Order> assignOrder(@PathVariable Long orderId,
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User deliveryPerId =userService.findUserByJwtToken(jwt);
        Order order =orderService.assignDeliveryPerson( orderId,deliveryPerId);
        // PaymentRespons res = paymentService.createPaymentLink(order);
        return new ResponseEntity<>(order,HttpStatus.OK);
                                                
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> LivreurOrderHistory(
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User deliveryPerId =userService.findUserByJwtToken(jwt);
        List<Order> orders =orderService.getOrderByDeliveryPerson(deliveryPerId);
        return new ResponseEntity<>(orders,HttpStatus.OK);
                                                
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<Order>> findOrderStatus(@PathVariable boolean status,
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User deliveryPerId =userService.findUserByJwtToken(jwt);
        List<Order> orders =orderService.findOrderStatus(status);
        return new ResponseEntity<>(orders,HttpStatus.OK);
                                                
    }

    @GetMapping("/orders/id/{orderId}")
    public ResponseEntity<Order> findOrderById(@PathVariable Long orderId,
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User deliveryPerId =userService.findUserByJwtToken(jwt);
        Order order =orderService.findOrderById(orderId);
        return new ResponseEntity<>(order,HttpStatus.OK);
                                                
    }

}
