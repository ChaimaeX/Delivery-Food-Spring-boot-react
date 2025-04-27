package com.delevery.deleveryspring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Exception.InvalidTokenException;
import com.delevery.deleveryspring.Model.SecureToken;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.config.JwtProvider;
import com.delevery.deleveryspring.mailing.AccountVerificationEmailContext;
import com.delevery.deleveryspring.reposetry.UserRepos;
import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.MessagingException;
import java.util.Objects;
import org.apache.commons.lang3.StringUtils;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class UserServiceImp implements UserService{

    @Value("${site.base.url.https}")
    private String baseUrl;

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private SecureTokenService secureTokenService;

    @Autowired
    private EmailVerifcationService emailVerifcationService;

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

    @Override
    public List<User> getAllUsers() throws Exception {
        List<User> users = userRepos.findAll();
        return users;
    }

    @Override
    public boolean verifyUser(String token) throws InvalidTokenException {
        if (StringUtils.isBlank(token)) {
            throw new InvalidTokenException("Token cannot be blank");
        }

        SecureToken secureToken = secureTokenService.findByToken(token);
        if (secureToken == null || !StringUtils.equals(token, secureToken.getToken()) || secureToken.isExpired()) {
            throw new InvalidTokenException("Token is not valid");
        }

        User user = secureToken.getUser();
        if (user == null) {
            log.error("No user associated with token: {}", token);
            return false;
        }

        user.setAccountVerified(true);
        userRepos.save(user);
        secureTokenService.removeToken(secureToken);
        
        log.info("User {} successfully verified", user.getEmail());
        return true;
    }

    @Override
    public void sendRegistrationConfirmationEmail(User user) {
        Objects.requireNonNull(user, "User cannot be null");
        
        SecureToken secureToken = secureTokenService.createToken(user);

        AccountVerificationEmailContext context = new AccountVerificationEmailContext();
        context.init(user);
        context.setToken(secureToken.getToken());
        context.buildVerificationUrl(baseUrl, secureToken.getToken());

        try {
            emailVerifcationService.sendMail(context);
            log.info("Verification email sent to {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}", user.getEmail(), e);
            // Consider throwing a custom exception or implementing a retry mechanism
        }
    }
}
