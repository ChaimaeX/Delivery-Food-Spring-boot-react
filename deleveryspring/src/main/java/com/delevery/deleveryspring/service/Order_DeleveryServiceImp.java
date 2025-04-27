package com.delevery.deleveryspring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.Delivery;
import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.order_deleveryRepos;



@Service
public class Order_DeleveryServiceImp implements order_deleveryService{

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private order_deleveryRepos order_deleveryRepos ;

    @Override
    public Delivery createOrder_Delevery(Long orderId,String jwt,boolean status) throws Exception {

        Order order = orderService.findOrderById(orderId);
        if (order == null) {
            throw new Exception("Commande non trouvée avec l'ID: " + orderId);
        }
    
        User livreur = userService.findUserByJwtToken(jwt);
        if (livreur == null) {
            throw new Exception("Utilisateur non trouvé avec le token JWT: " + jwt);
        }
        Delivery order_Delevery = new Delivery();
       
        order_Delevery.setDeliverer(livreur);
        order_Delevery.setOrder(order);
        order_Delevery.setIsAccepted(status);

        order_deleveryRepos.save(order_Delevery);
        return order_Delevery;
    }

    @Override
    public List<Delivery> getOrdersAccepted() throws Exception {
        List<Delivery> orders =  order_deleveryRepos.findByIsAccepted(true);

        return orders;
    }

    @Override
    public Delivery getOrderDeleveryById() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getOrderDeleveryById'");
    }

    @Override
    public List<Delivery> getAllOrderDelevery() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllOrderDelevery'");
    }
    
}
