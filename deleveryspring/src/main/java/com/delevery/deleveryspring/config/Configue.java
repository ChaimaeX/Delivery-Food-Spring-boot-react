package com.delevery.deleveryspring.config;

import java.util.Arrays;
import java.util.Collections;

import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Configuration
@EnableWebSecurity
public class Configue {
   


    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
     http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            // **Restriction stricte pour ADMIN**
            .requestMatchers("/api/aharak/**").hasRole("ADMIN") // Seul ADMIN y a accès
            // **Restriction stricte pour RESTAURANT_OWNER**
            .requestMatchers("/api/restaurant/**").hasRole("RESTAURANT_OWNER") // Seul RESTAURANT_OWNER y a accès
            // **Restriction stricte pour LIVREUR**
            .requestMatchers("/api/delivery/**").hasRole("LIVREUR") // Seul LIVREUR y a accès
            // **Accès public (sans auth)**
            .requestMatchers(HttpMethod.GET, "/api/restaurants").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/food").permitAll()
            // **Toutes les autres routes /api/** nécessitent une auth (sans restriction de rôle)**
            .requestMatchers("/api/**").authenticated()            
            // **Toutes les autres routes sont publiques**
            .anyRequest().permitAll()
        )
        .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()));

      return http.build();
    }
  
    private CorsConfigurationSource corsConfigurationSource() {

        return new CorsConfigurationSource(){
         @Override
         public CorsConfiguration getCorsConfiguration(HttpServletRequest request){
            CorsConfiguration cfg = new CorsConfiguration();

            cfg.setAllowedOrigins(Arrays.asList(
                "https://67a7e94de489e9518c3f5c10--nimble-bonbon-b7a680.netlify.app",
              "http://localhost:3000"
              
            ));
            cfg.setAllowedMethods(Collections.singletonList("*"));
            cfg.setAllowCredentials(true);
            cfg.setAllowedHeaders(Collections.singletonList("*"));
            cfg.setExposedHeaders(Arrays.asList("Authorization"));
            cfg.setMaxAge(3600L);
            return cfg;


        }
       };
     
  
}
   @Bean
   PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
   }
}
