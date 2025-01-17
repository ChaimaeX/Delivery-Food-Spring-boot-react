package com.delevery.deleveryspring.Model;

import java.util.ArrayList;
import java.util.List;

import com.delevery.deleveryspring.Dto.RestaurantDto;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

    
    private USER_ROLE role;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL , mappedBy = "customer")
    private List<Order> orders = new ArrayList<>();
 
    @ElementCollection
    private List<RestaurantDto> favorites = new ArrayList<>();
     
    @OneToMany(cascade = CascadeType.ALL , orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();







    
}
