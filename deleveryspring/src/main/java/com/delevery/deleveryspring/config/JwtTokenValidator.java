package com.delevery.deleveryspring.config;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenValidator extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String jwt = request.getHeader(JwtConstant.JWT_HEADER);

        if (jwt != null && !jwt.isEmpty()) {
            try {
                // Validation du format Bearer
                if (!jwt.startsWith("Bearer ")) {
                    throw new BadCredentialsException("Invalid token format");
                }
                jwt = jwt.substring(7);

                // Validation basique du format JWT
                if (jwt.split("\\.").length != 3) {
                    throw new BadCredentialsException("Invalid JWT structure");
                }

                // Décodage et vérification du JWT
                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();

                // Extraction des claims
                String email = claims.get("email", String.class);
                String authoritiesStr = claims.get("authorities", String.class);

                // Validation et normalisation des rôles
                List<GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList(
                    authoritiesStr.replace("[", "").replace("]", "").replace(" ", "")
                );

                // Vérification des rôles valides
                validateRoles(authorities);

                // Création de l'authentication
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    email, null, authorities);
                
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Invalid token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private void validateRoles(List<GrantedAuthority> authorities) {
        if (authorities == null || authorities.isEmpty()) {
            throw new BadCredentialsException("No roles found in token");
        }

        // Liste des rôles valides dans votre système
        final Set<String> validRoles = Set.of(
            "ROLE_ADMIN", 
            "ROLE_RESTAURANT_OWNER", 
            "ROLE_LIVREUR",
            "ROLE_CUSTOMER"
        );

        for (GrantedAuthority authority : authorities) {
            if (!validRoles.contains(authority.getAuthority())) {
                throw new BadCredentialsException("Invalid role: " + authority.getAuthority());
            }
        }
    }
}