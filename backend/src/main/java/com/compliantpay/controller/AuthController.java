package com.compliantpay.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Added import
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody; // Added import
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.compliantpay.dto.AuthResponse;
import com.compliantpay.dto.LoginRequest;
import com.compliantpay.dto.MessageResponse;
import com.compliantpay.dto.RegisterRequest;
import com.compliantpay.model.User;
import com.compliantpay.repository.UserRepository;
import com.compliantpay.util.JwtUtils;

import jakarta.validation.Valid;


@CrossOrigin(origins = "*", maxAge = 3600) // Allow all origins for simplicity, restrict in production
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired // Inject JwtUtils
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Authenticate using Spring Security's AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // Set the authentication in the SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // *** Generate JWT Token ***
        String jwt = jwtUtils.generateJwtToken(authentication);

        User userDetails = (User) authentication.getPrincipal(); // Get our User object

        // Get roles
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // Use method reference
                .collect(Collectors.toList());

        // *** Return response with JWT ***
        return ResponseEntity.ok(new AuthResponse(jwt, // Include the token
                                                 userDetails.getUsername(),
                                                 roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // Check if username is already taken
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already taken
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(registerRequest.getUsername(),
                encoder.encode(registerRequest.getPassword()), // Encode the password
                registerRequest.getEmail());

        Set<String> strRoles = registerRequest.getRoles();
        // Roles are handled within the User entity's addRole method now, including prefix if needed

        if (strRoles == null || strRoles.isEmpty()) {
            user.addRole("USER"); // Default role
        } else {
            strRoles.forEach(role -> {
                // Let the addRole method handle potential prefixing and case
                user.addRole(role);
                /* // Previous logic, now simplified by addRole method
                switch (role.toLowerCase()) {
                    case "admin":
                        user.addRole("ADMIN");
                        break;
                    case "hr": // Example additional role
                         user.addRole("HR");
                         break;
                    default:
                        user.addRole("USER");
                }
                */
            });
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}