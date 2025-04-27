package com.delevery.deleveryspring.Model;

import java.util.Date;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class FogetPassword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long fpid;

    @Column(nullable = false)
    private Integer otp;

    @Column(nullable = false)
    private Date  expirationTime;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    
}
