package com.compliantpay.repository;

import com.compliantpay.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // Method to find a user by their username (for UserDetailsService)
    Optional<User> findByUsername(String username);

    // Method to find a user by their email
    Optional<User> findByEmail(String email);

    // Check if a username already exists (for registration)
    Boolean existsByUsername(String username);

    // Check if an email already exists (for registration)
    Boolean existsByEmail(String email);
}