package com.delevery.deleveryspring.reposetry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Address;

public interface AdressRepos extends JpaRepository<Address,Long>{
    
    
}
