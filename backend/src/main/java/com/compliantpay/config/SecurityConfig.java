package com.compliantpay.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {}) // Enable CORS with default configuration
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/**", "/h2-console/**").permitAll() // Allow all API and H2 console access
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}