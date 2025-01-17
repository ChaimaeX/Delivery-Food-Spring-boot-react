package com.delevery.deleveryspring.reposetry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Cart;
import com.delevery.deleveryspring.Model.CartItem;

public interface CartItemRepos extends JpaRepository<CartItem,Long> {
    public Cart findByCustomerId(Long userId);
    
}
