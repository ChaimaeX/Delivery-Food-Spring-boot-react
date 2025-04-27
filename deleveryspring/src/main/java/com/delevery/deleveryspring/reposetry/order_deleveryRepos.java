package com.delevery.deleveryspring.reposetry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Delivery;



public interface order_deleveryRepos extends JpaRepository<Delivery,Long>{
    
    List<Delivery> findByIsAccepted(Boolean isAccepted);
} 
