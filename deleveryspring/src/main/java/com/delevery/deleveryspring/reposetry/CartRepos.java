package com.delevery.deleveryspring.reposetry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Cart;

public interface CartRepos extends JpaRepository<Cart,Long> {
    
    public Cart findByCustomerId(Long userId);
}
