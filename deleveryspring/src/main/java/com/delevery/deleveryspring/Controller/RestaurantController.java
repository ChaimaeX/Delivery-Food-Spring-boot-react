package com.delevery.deleveryspring.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.delevery.deleveryspring.Dto.RestaurantDto;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.service.RestaurantService;
import com.delevery.deleveryspring.service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "https://67a7e94de489e9518c3f5c10--nimble-bonbon-b7a680.netlify.app")
public class RestaurantController {
    
    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    
    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurant(@RequestHeader("Authorization") String jwt,
                                                        @RequestParam String keyword) throws Exception{

                                    User user =  userService.findUserByJwtToken(jwt);
                                    List<Restaurant> restaurant = restaurantService.searchRestaurants(keyword);

                                    return new ResponseEntity<>(restaurant,HttpStatus.OK);

    }

    @GetMapping()
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Restaurant>> getAllRestaurant() throws Exception{

                                    // User user =  userService.findUserByJwtToken(jwt);
                                    List<Restaurant> restaurant = restaurantService.getAllRestaurant();
                                    System.out.println("Restaurants retrieved: " + restaurant.size());
                                    return new ResponseEntity<>(restaurant,HttpStatus.OK);

    }
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> findRestaurantById(@RequestHeader("Authorization") String jwt,
                                                               @PathVariable Long id ) throws Exception{

                                    User user =  userService.findUserByJwtToken(jwt);
                                    Restaurant restaurant = restaurantService.findRestaurantById(id);

                                    return new ResponseEntity<>(restaurant,HttpStatus.OK);

    }
    @PutMapping("/{id}/add-favorite/{status}")
    public ResponseEntity<RestaurantDto> addToFavorite(@RequestHeader("Authorization") String jwt,
                                                       @PathVariable boolean status,
                                                    @PathVariable Long id ) throws Exception{

                                    User user =  userService.findUserByJwtToken(jwt);
                                   
                                    RestaurantDto restaurant=restaurantService.addToFavorites(id,status, user);

                                    return new ResponseEntity<>(restaurant,HttpStatus.OK);

    }

    
}
