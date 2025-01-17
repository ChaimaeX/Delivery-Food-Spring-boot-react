package com.delevery.deleveryspring.reposetry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.delevery.deleveryspring.Model.User;


public interface UserRepos extends JpaRepository<User,Long>{
    
    public User findByEmail(String username);
}
