package com.delevery.deleveryspring.service;

import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.User;

@Service
public interface UserService {
    
    public User findUserByJwtToken(String jwt) throws Exception;
     
    public User findUserByEmail(String email) throws Exception;

    
}
