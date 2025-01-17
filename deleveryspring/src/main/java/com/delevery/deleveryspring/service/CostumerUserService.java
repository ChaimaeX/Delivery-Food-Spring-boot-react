package com.delevery.deleveryspring.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.USER_ROLE;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.UserRepos;

@Service
public class CostumerUserService implements UserDetailsService {

    @Autowired
    private UserRepos userRepos;

    /**
     * Charge un utilisateur par son nom d'utilisateur (email dans ce cas).
     *
     * @param username le nom d'utilisateur ou email.
     * @return un objet UserDetails.
     * @throws UsernameNotFoundException si l'utilisateur n'est pas trouvé.
     */
   
     @Override
     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
         // البحث عن المستخدم من قاعدة البيانات
         User user = userRepos.findByEmail(username);
         if (user == null) {
             throw new UsernameNotFoundException("User not found with email: " + username);
         }
     
         // التحقق من الدور وإعطاء قيمة افتراضية إذا كان null
         USER_ROLE role = user.getRole();
         if (role == null) {
             role = USER_ROLE.ROLE_CUSTOMER; // دور افتراضي
         }
     
         // التأكد من أن الصلاحيات تأخذ شكل "ROLE_NAME"
         List<GrantedAuthority> authorities = new ArrayList<>();
         authorities.add(new SimpleGrantedAuthority(role.name()));
     
         // التحقق عبر السجلات
         System.out.println("User Role: " + role.name());
         System.out.println("Granted Authorities: " + authorities);
     
         // إرجاع تفاصيل المستخدم
         return new org.springframework.security.core.userdetails.User(
                 user.getEmail(),
                 user.getPassword(),
                 authorities
         );
     }
     
}
