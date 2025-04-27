package com.delevery.deleveryspring.service;

import java.time.LocalDateTime;
import java.nio.charset.StandardCharsets;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.SecureToken;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.SecureTokenRepos;

@Service  // Ensure Spring picks this up as a service bean
public class SecureTokenServiceImp implements SecureTokenService {

    private static final BytesKeyGenerator DEFAULT_TOKEN_GENERATOR = KeyGenerators.secureRandom(12);  // Made final since it's static

    @Value("${secure.token.validity.seconds:2800}")  // Externalized config with default
    private int tokenValidityInSeconds;

    private final SecureTokenRepos secureTokenRepository;  // Made final for immutability

    @Autowired
    public SecureTokenServiceImp(SecureTokenRepos secureTokenRepository) {  // Constructor injection
        this.secureTokenRepository = secureTokenRepository;
    }

    @Override
    public SecureToken createToken(User user) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("User must be persisted before creating token");
        }

        String tokenValue = Base64.encodeBase64URLSafeString(
            DEFAULT_TOKEN_GENERATOR.generateKey()
        );
        
        SecureToken secureToken = new SecureToken();
        secureToken.setToken(tokenValue);
        secureToken.setExpireAt(LocalDateTime.now().plusSeconds(tokenValidityInSeconds));
        secureToken.setUser(user);
        
        return saveSecureToken(secureToken);
    }

    @Override
    public SecureToken saveSecureToken(SecureToken secureToken) {  // Changed return type to SecureToken
        return secureTokenRepository.save(secureToken);
    }

    @Override
    public SecureToken findByToken(String token) {
        return secureTokenRepository.findByToken(token);
            // .orElse(null);  // Handle Optional properly
    }

    @Override
    public void removeToken(SecureToken token) {
        secureTokenRepository.delete(token);
    }

    @Override
    public void removeTokenByValue(String token) {  // Additional useful method
        secureTokenRepository.removeByToken(token);
    }
}