package com.delevery.deleveryspring.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.delevery.deleveryspring.Model.Address;
import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.AdressRepos;
import com.delevery.deleveryspring.reposetry.OrderRepos;
import com.delevery.deleveryspring.reposetry.PaymentRespons;
import com.delevery.deleveryspring.request.OrderRequest;
import com.delevery.deleveryspring.service.OrderService;
import com.delevery.deleveryspring.service.PaymentService;
import com.delevery.deleveryspring.service.UserService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/api")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    // @Autowired
    // private AdressRepos adressRepos;

    // @Autowired
    // private OrderRepos orderRepos;



    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest req,
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User user=userService.findUserByJwtToken(jwt);
        Order order =orderService.createOrder(req, user,jwt);
       
        return new ResponseEntity<>(order,HttpStatus.OK);
                                                
    }

    @GetMapping("/orders/Addresses")
    public ResponseEntity<List<Address>> findUserAddresses(
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User user=userService.findUserByJwtToken(jwt);
        List<Address> addresses =orderService.getUsersAddress(user);
        // PaymentRespons res = paymentService.createPaymentLink(order);
        return new ResponseEntity<>(addresses,HttpStatus.OK);
                                                                                
    }

    
    @GetMapping("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory(
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User user=userService.findUserByJwtToken(jwt);
        List<Order> orders =orderService.getUsersOrder(user.getId());
        return new ResponseEntity<>(orders,HttpStatus.OK);
                                                
    }

    @DeleteMapping("/order/{id_Address}")
    public ResponseEntity<String> deleteAdressOrder(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id_Address) {
    
        try {
            // Vérification du token JWT (si nécessaire, vous pouvez valider le token ici)
            User user = userService.findUserByJwtToken(jwt);
            
            orderService.deleteAddress(id_Address);

            return new ResponseEntity<>("adress deleted",HttpStatus.OK); 


        } catch (Exception e) {
            // En cas d'erreur, renvoyer une réponse générique ou détaillée selon l'exception
            return new ResponseEntity<>("Error deleting address: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

}
