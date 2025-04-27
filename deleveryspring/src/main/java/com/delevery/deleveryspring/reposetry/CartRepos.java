package com.delevery.deleveryspring.reposetry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Cart;
import com.delevery.deleveryspring.Model.User;

import java.util.List;


public interface CartRepos extends JpaRepository<Cart,Long> {
    
    public Cart  findByCustomer(User customer);

    // public Cart findByU
}
