package com.delevery.deleveryspring.service;

import com.delevery.deleveryspring.Model.Cart;
import com.delevery.deleveryspring.Model.CartItem;
import com.delevery.deleveryspring.request.AddCartItemRequest;

public interface CartService {
    
    public CartItem addItemToCart(AddCartItemRequest req , String jwt)throws Exception;

    public CartItem updateCartItemQuantity(Long cartItemId,int quantity)throws Exception;

    public Cart removeItemFromCart(Long cartItemId,String jwt)throws Exception;

    public Long calculateCartTotal(Cart cart) throws Exception;

    public Cart findCartById(Long id) throws Exception;

    public Cart findCartByUserId(Long UserId) throws Exception;

    public Cart cleanCart(Long UserId) throws Exception;

}
