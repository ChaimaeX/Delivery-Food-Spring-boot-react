package com.delevery.deleveryspring.reposetry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.Address;



public interface AdressRepos extends JpaRepository<Address,Long>{
   
}
