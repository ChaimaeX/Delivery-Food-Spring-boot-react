package com.delevery.deleveryspring.config;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtProvider {

    // Génération de la clé secrète à partir de la constante
    private final SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    /**
     * Génère un token JWT pour un utilisateur authentifié.
     * 
     * @param auth L'objet Authentication contenant les détails de l'utilisateur.
     * @return Le token JWT généré.
     */
    public String generateToken(Authentication auth) {

        // Collections <? extends GrantedAuthority>authoritie = (Collections) auth.getAuthorities();
        System.out.println("Authenticated User: " + auth.getName());
        System.out.println("Authorities: " + auth.getAuthorities());

        String roles = populateAuthorities(auth.getAuthorities());

        // Construction du token JWT
        return Jwts.builder()
                .setIssuedAt(new Date()) // Date de génération
                .setExpiration(new Date( new Date().getTime()+86400000)) // Expiration dans 24h
                .claim("email", auth.getName()) // Ajout de l'email de l'utilisateur
                .claim("authorities", roles) // Ajout des rôles/autorités
                .signWith(key) // Signature avec la clé secrète
                .compact(); // Construction finale
    }

    /**
     * Extrait l'email stocké dans un token JWT.
     * 
     * @param jwt Le token JWT.
     * @return L'email de l'utilisateur contenu dans le token.
     */
    public String getEmailFromJwtToken(String jwt) {
    
        jwt = jwt.substring(7); // Supprime le préfixe "Bearer " si présent
        
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        return claims.get("email", String.class); // Extraction de l'email
    }

    
    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> roles = new HashSet<>();
        for (GrantedAuthority authority : authorities) {
            System.out.println("Authority: " + authority.getAuthority()); // سجل الصلاحيات
            roles.add(authority.getAuthority());
        }
        return String.join(",", roles);
    }
    
}
