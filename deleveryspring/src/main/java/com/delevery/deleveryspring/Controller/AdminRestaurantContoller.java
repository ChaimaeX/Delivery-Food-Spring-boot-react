package com.delevery.deleveryspring.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.Response.MessageResponse;
import com.delevery.deleveryspring.request.CreateRestaurantRequest;
import com.delevery.deleveryspring.service.PaymentService;
import com.delevery.deleveryspring.service.RestaurantService;
import com.delevery.deleveryspring.service.UserService;
import com.stripe.exception.StripeException;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminRestaurantContoller {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    // @Autowired
    // private PaymentService paymentService;

   
   @PostMapping()
   public ResponseEntity<Restaurant> createRestaurant(
        @RequestBody CreateRestaurantRequest req,
        @RequestHeader("Authorization") String jwt) throws Exception{

    try {
        System.out.println("Corps de la requête reçu : " + req);

        // Vérifier l'utilisateur via le JWT
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Retourne 401 si le JWT est invalide
        }

        // Créer le restaurant
        Restaurant restaurant = restaurantService.createRestaurant(req, user);

        
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED);

       } catch (Exception e) {
         
          throw new Exception("creer restaurant erreur ", e);
       
       }
    }
    
    // Update an existing restaurant
    @PutMapping("/{id}/")
    public ResponseEntity<Restaurant> updateRestaurant(@RequestBody CreateRestaurantRequest req,
                                                        @RequestHeader("Authorization") String jwt,
                                                        @PathVariable Long id) throws Exception {
        Restaurant restaurant = restaurantService.updateRestaurant(id, req);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    // Delete a restaurant
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteRestaurant(@RequestHeader("Authorization") String jwt,
                                                             @PathVariable Long id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Return 401 if the JWT is invalid
        }
        restaurantService.deleteRestaurant(id);
        MessageResponse res = new MessageResponse();
        res.setMessage("Restaurant deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Update restaurant status
    @PutMapping("/{id}/status")
    public ResponseEntity<Restaurant> updateRestaurantStatus(@RequestHeader("Authorization") String jwt,
                                                             @PathVariable Long id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Return 401 if the JWT is invalid
        }
        Restaurant restaurant = restaurantService.updateRestaurantStatus(id);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    // Find restaurant by user ID
    @GetMapping("/user")
    public ResponseEntity<Restaurant> findRestaurantByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Return 401 if the JWT is invalid
        }
        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }
}
