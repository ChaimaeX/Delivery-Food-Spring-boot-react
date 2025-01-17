package com.delevery.deleveryspring.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.PaymentRespons;
import com.delevery.deleveryspring.request.OrderRequest;
import com.delevery.deleveryspring.service.OrderService;
import com.delevery.deleveryspring.service.PaymentService;
import com.delevery.deleveryspring.service.UserService;

@RestController
@RequestMapping("/api")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @PostMapping("/orders")
    public ResponseEntity<PaymentRespons> createOrder(@RequestBody OrderRequest req,
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User user=userService.findUserByJwtToken(jwt);
        Order order =orderService.createOrder(req, user);
        PaymentRespons res = paymentService.createPaymentLink(order);
        return new ResponseEntity<>(res,HttpStatus.OK);
                                                
    }

    
    @GetMapping("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory(
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User user=userService.findUserByJwtToken(jwt);
        List<Order> orders =orderService.getUsersOrder(user.getId());
        return new ResponseEntity<>(orders,HttpStatus.OK);
                                                
    }
}
