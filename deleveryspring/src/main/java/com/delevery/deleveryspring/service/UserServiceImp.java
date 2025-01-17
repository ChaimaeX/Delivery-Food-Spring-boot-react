package com.delevery.deleveryspring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.config.JwtProvider;
import com.delevery.deleveryspring.reposetry.UserRepos;

@Service
public class UserServiceImp implements UserService{

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
    
       String email = jwtProvider.getEmailFromJwtToken(jwt);
       User user = findUserByEmail(email);
       return user;
 
        // throw new UnsupportedOperationException("Unimplemented method 'findUSerByJwtToken'");
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        // TODO Auto-generated method stub
        User user = userRepos.findByEmail(email);
        if (user==null) {
             throw new Exception("user not found");
        }
        // throw new UnsupportedOperationException("Unimplemented method 'findUserByEmail'");

        return user;
    }
    
}
