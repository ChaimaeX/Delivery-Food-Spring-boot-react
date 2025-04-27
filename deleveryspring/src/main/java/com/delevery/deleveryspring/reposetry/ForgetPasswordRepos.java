package com.delevery.deleveryspring.reposetry;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.delevery.deleveryspring.Model.FogetPassword;
import com.delevery.deleveryspring.Model.User;
import java.util.List;


public interface ForgetPasswordRepos extends JpaRepository<FogetPassword,Long> {

     // Option 2: Custom JPQL query with proper syntax
    @Query("SELECT fp FROM FogetPassword fp WHERE fp.otp = :otp AND fp.user = :user")
    Optional<FogetPassword> findByOtpAndUser(@Param("otp") Integer otp, 
                                                 @Param("user") User user);

    @Modifying
    void deleteByUser(User user);
}
