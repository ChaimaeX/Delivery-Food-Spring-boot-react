package com.delevery.deleveryspring.Model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.delevery.deleveryspring.Dto.RestaurantDto;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long id;
    private String fullName;
    private String email;
    
    private String password;
    private boolean accountVerified;
    private boolean loginDisabled;

    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER; // Default role

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private FogetPassword forgetPassword;
 
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL , mappedBy = "customer")
    private List<Order> orders = new ArrayList<>();
 
    @ElementCollection
    private List<RestaurantDto> favorites = new ArrayList<>();
     
    @OneToMany(cascade = CascadeType.ALL , orphanRemoval = true )
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    Set<SecureToken> tokens;

    public User orElseThrow(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    }







    
}
