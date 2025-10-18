package com.compliantpay.service.impl;

import com.compliantpay.model.User;
import com.compliantpay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional // Ensures user data (like roles) is loaded within the transaction
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find the user by username using the repository
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        // The User entity already implements UserDetails, so we can return it directly
        return user;
    }
}