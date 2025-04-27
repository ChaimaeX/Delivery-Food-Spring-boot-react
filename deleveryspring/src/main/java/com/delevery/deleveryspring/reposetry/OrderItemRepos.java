package com.delevery.deleveryspring.reposetry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.delevery.deleveryspring.Model.Orderitem;

public interface OrderItemRepos extends JpaRepository<Orderitem,Long> {

   
}
