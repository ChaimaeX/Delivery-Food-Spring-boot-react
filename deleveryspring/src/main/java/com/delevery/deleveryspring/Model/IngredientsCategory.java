package com.delevery.deleveryspring.Model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class IngredientsCategory {
    
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id ;

    private String name;

    @JsonIgnore
    @ManyToOne
    private Restaurant restaurant;
    
    @JsonIgnore
    @OneToMany(mappedBy = "category" ,cascade = CascadeType.ALL)
    private List<IngredientsItem> ingredientsItem = new ArrayList<>();
}