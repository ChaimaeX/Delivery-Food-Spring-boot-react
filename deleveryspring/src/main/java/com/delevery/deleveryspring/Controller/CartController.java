package com.delevery.deleveryspring.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.delevery.deleveryspring.Model.Cart;
import com.delevery.deleveryspring.Model.CartItem;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.request.AddCartItemRequest;
import com.delevery.deleveryspring.request.UpdateCartItemRequest;
import com.delevery.deleveryspring.service.CartService;
import com.delevery.deleveryspring.service.UserService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @PutMapping("/cart/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody AddCartItemRequest req,
                                                 @RequestHeader("Authorization") String jwt) throws Exception{

        CartItem cartItem =cartService.addItemToCart(req, jwt);
        return new ResponseEntity<>(cartItem,HttpStatus.OK);
                                                
    }
    @PutMapping("/cart-item/update")
    public ResponseEntity<CartItem> updateCartItemQuantity(@RequestBody UpdateCartItemRequest req,
                                                 @RequestHeader("Authorization") String jwt) throws Exception{

        CartItem cartItem =cartService.updateCartItemQuantity(req.getCartItemId(), req.getQuantity());
        return new ResponseEntity<>(cartItem,HttpStatus.OK);
                                                
    }

    @DeleteMapping("/cart-item/{id}/remove")
    public ResponseEntity<Cart> removeItem(@PathVariable Long id,
                                            @RequestHeader("Authorization") String jwt) throws Exception{

        Cart cart =cartService.removeItemFromCart(id, jwt);
        return new ResponseEntity<>(cart,HttpStatus.OK);
                                                
    }

    @PutMapping("/cart/clear")
    public ResponseEntity<Cart> clearCart(@RequestBody UpdateCartItemRequest req,
                                                 @RequestHeader("Authorization") String jwt) throws Exception{

        User user=userService.findUserByJwtToken(jwt);
        Cart cart =cartService.cleanCart(user);
        return new ResponseEntity<>(cart,HttpStatus.OK);
                                                
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> findUserCart(
                                                 @RequestHeader("Authorization") String jwt) throws Exception{
        User user=userService.findUserByJwtToken(jwt);
        Cart cart =cartService.findCartByUserId(user.getId(),jwt);
        return new ResponseEntity<>(cart,HttpStatus.OK);
                                                
    }
    
}
