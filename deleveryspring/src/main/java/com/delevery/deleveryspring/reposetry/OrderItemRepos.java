package com.delevery.deleveryspring.reposetry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Orderitem;

public interface OrderItemRepos extends JpaRepository<Orderitem,Long> {

    
}
