package com.delevery.deleveryspring.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.Cart;
import com.delevery.deleveryspring.Model.CartItem;
import com.delevery.deleveryspring.Model.Food;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.CartItemRepos;
import com.delevery.deleveryspring.reposetry.CartRepos;
import com.delevery.deleveryspring.reposetry.FoodRepos;
import com.delevery.deleveryspring.request.AddCartItemRequest;

@Service
public class CartServiceImp implements CartService {

    @Autowired
    private UserService userService;

    @Autowired
    private CartRepos cartRepos;


    @Autowired
    private CartItemRepos cartItemRepos;

    @Autowired 
    private FoodService foodService;

    @Override
    public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        Food food = foodService.findFoodById(req.getFoodId());

        Cart cart = cartRepos.findByCustomerId(user.getId());

        for(CartItem cartItem : cart.getItem()){
            if (cartItem.getFood().equals(food)) {
                int newQuantity=cartItem.getQuantity()+req.getQuantity();
                return updateCartItemQuantity(cartItem.getId(), newQuantity);
            }
        }

        CartItem newCartItem = new CartItem();
        newCartItem.setFood(food);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(req.getQuantity());
        newCartItem.setTotalPrice(req.getQuantity()*food.getPrice());

        CartItem saveCartItem=cartItemRepos.save(newCartItem);
        cart.getItem().add(saveCartItem);
        return saveCartItem;
    }

    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws Exception {
        Optional<CartItem> cartItemOptional = cartItemRepos.findById(cartItemId);

        if (cartItemOptional.isEmpty()) {
            throw new Exception("cart item not found");
        }
        CartItem item = cartItemOptional.get();
        item.setQuantity(quantity);  
        item.setTotalPrice(item.getFood().getPrice()*quantity);
        return cartItemRepos.save(item);
    }

    @Override
    public Cart removeItemFromCart(Long cartItemId, String jwt) throws Exception {
       User user=userService.findUserByEmail(jwt);
       Cart cart=cartRepos.findByCustomerId(user.getId());

       Optional<CartItem> cartItemOptional = cartItemRepos.findById(cartItemId);

       if (cartItemOptional.isEmpty()) {
           throw new Exception("cart item not found");
       }
       CartItem item=cartItemOptional.get();

       cart.getItem().remove(item);
       return cartRepos.save(cart);
        
    }

    @Override
    public Long calculateCartTotal(Cart cart) throws Exception {

       Long total=0L;
       
       for(CartItem cartItem :cart.getItem()){
          total +=cartItem.getFood().getPrice()*cartItem.getQuantity();

       }
       return total;
    }

    @Override
    public Cart findCartById(Long id) throws Exception {
       Optional<Cart> optionalCart=cartRepos.findById(id);
       if (optionalCart.isEmpty()) {
           throw new Exception("cart not found with id"+id);
       }
        return optionalCart.get();
    }

    @Override
    public Cart findCartByUserId(Long UserId) throws Exception {
    //    User user=userService.findUserByJwtToken(jwt);
       Cart cart=cartRepos.findByCustomerId(UserId);
       cart.setTotal(calculateCartTotal(cart));
       return cart;
    }

    @Override
    public Cart cleanCart(Long userId) throws Exception {
        Cart cart=findCartByUserId(userId);
        cart.getItem().clear();   
        
        return cartRepos.save(cart);
    }
    
}