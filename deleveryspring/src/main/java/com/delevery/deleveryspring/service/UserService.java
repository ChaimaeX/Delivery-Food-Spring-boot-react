package com.delevery.deleveryspring.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Exception.InvalidTokenException;
import com.delevery.deleveryspring.Model.User;

@Service
public interface UserService {
    
    public User findUserByJwtToken(String jwt) throws Exception;
     
    public User findUserByEmail(String email) throws Exception; 

    public List<User> getAllUsers() throws Exception;

    public boolean verifyUser(String token) throws InvalidTokenException;

    public void sendRegistrationConfirmationEmail(User user);

    
}
