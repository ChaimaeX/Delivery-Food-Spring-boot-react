package com.delevery.deleveryspring.reposetry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.delevery.deleveryspring.Model.User;

import jakarta.transaction.Transactional;

import java.util.List;
import com.delevery.deleveryspring.Model.Address;
import com.delevery.deleveryspring.Model.USER_ROLE;



public interface UserRepos extends JpaRepository<User,Long>{
    
    public User findByEmail(String username);

    public User findByAddresses(Address addresses);

    @Transactional
    @Modifying
    @Query("update User u set u.password =?2 where u.email =?1")
    void updatePassword(String email , String password);

    public List<User> findByRole(USER_ROLE role);
}
