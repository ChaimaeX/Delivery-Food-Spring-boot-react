package com.delevery.deleveryspring.Controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.delevery.deleveryspring.Model.Cart;
import com.delevery.deleveryspring.Model.USER_ROLE;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.Response.AuthResponse;
import com.delevery.deleveryspring.config.JwtProvider;
import com.delevery.deleveryspring.reposetry.CartRepos;
import com.delevery.deleveryspring.reposetry.UserRepos;
import com.delevery.deleveryspring.request.LoginRequest;
import com.delevery.deleveryspring.service.CostumerUserService;

import lombok.Data;

@RestController
@RequestMapping("/auth")
@Data
public class AuthController {

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CostumerUserService costumerUserService;

    @Autowired
    private CartRepos cartRepos;

    /**
     * Inscription d'un nouvel utilisateur.
     */
@PostMapping("/signup")
public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) {
    // Vérification si l'email existe déjà
    User existingUser = userRepos.findByEmail(user.getEmail());
    if (existingUser != null) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already used with another account");
    }

    // Création de l'utilisateur
    User createdUser = new User();
    createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
    createdUser.setEmail(user.getEmail());
    createdUser.setRole(user.getRole());
    createdUser.setFullName(user.getFullName());
    User savedUser = userRepos.save(createdUser);

    // Création d'un panier associé
    Cart cart = new Cart();
    cart.setCustomer(savedUser);
    cartRepos.save(cart);

    // إعداد الصلاحيات
    List<GrantedAuthority> authorities = new ArrayList<>();
    authorities.add(new SimpleGrantedAuthority(savedUser.getRole().name()));

    // إعداد المصادقة بشكل صحيح
    Authentication authentication = new UsernamePasswordAuthenticationToken(
            savedUser.getEmail(), savedUser.getPassword(), authorities);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // إنشاء الـ JWT
    String jwt = jwtProvider.generateToken(authentication);

    // Construction de la réponse
    AuthResponse authResponse = new AuthResponse();
    authResponse.setJwt(jwt);
    authResponse.setMessage("Registration successful");
    authResponse.setRole(savedUser.getRole());

    return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
}


    /**
     * Connexion d'un utilisateur existant.
     */
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest req) {
        String email = req.getEmail();
        String password = req.getPassword();

        Authentication authentication = authenticate(email, password);

        // Extraction du rôle
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        // Génération du token JWT
        String jwt = jwtProvider.generateToken(authentication);

        // Construction de la réponse
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login successful");
        authResponse.setRole(USER_ROLE.valueOf(role));


        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    /**
     * Méthode privée pour authentifier un utilisateur.
     */
    private Authentication authenticate(String email, String password) {
        // Chargement des détails de l'utilisateur
        UserDetails userDetails = costumerUserService.loadUserByUsername(email);
        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username...");
        }

        // Vérification du mot de passe
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password...");
        }

        // Retourne une authentification valide
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
