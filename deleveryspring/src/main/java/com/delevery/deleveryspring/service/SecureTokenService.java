package com.delevery.deleveryspring.service;

import com.delevery.deleveryspring.Model.SecureToken;
import com.delevery.deleveryspring.Model.User;

public interface SecureTokenService {
    
    SecureToken createToken(User user);

    SecureToken saveSecureToken(SecureToken secureToken);

    SecureToken findByToken(String token);

    void removeToken(SecureToken token);

    public void removeTokenByValue(String token);
}
