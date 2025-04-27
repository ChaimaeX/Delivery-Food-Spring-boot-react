package com.delevery.deleveryspring.Model;


import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
     
    @ManyToOne  // many order has one user
    private User customer ;
     
    
    @JsonIgnore
    @ManyToOne
    private Restaurant restaurant;

    private Long totalAmount;

    private String orderStatus;

    private Date createdAt;

    @ManyToOne
    private Address deliveryAddress;

    @OneToMany
    private List<Orderitem> items;

    private int totalItem;

    private Long totalPrice;

    // When creating an order, it's in false state - no delivery person has accepted it yet
    private Boolean accepted = false;

    // Many orders can be assigned to one delivery person
    @ManyToOne
    private User deliveryPerson; 
    
}
