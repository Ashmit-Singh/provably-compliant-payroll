package com.compliantpay.controller;

import com.compliantpay.model.User;
// import com.compliantpay.repository.UserRepository; // Keep commented unless needed directly here
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority; // Moved import
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map; // Moved import
import java.util.stream.Collectors; // Moved import

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    // You might inject UserRepository or a dedicated UserService here later
    // @Autowired
    // UserRepository userRepository;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()") // Ensure user is logged in
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if authentication object exists and represents a logged-in user
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated")); // Return structured error
        }

        Object principal = authentication.getPrincipal();

        // Check if the principal is our custom User object
        if (principal instanceof User) {
            User currentUser = (User) principal;
            // Return a Map or a dedicated UserProfileDTO (never include password)
            return ResponseEntity.ok(Map.of(
                    "id", currentUser.getId(),
                    "username", currentUser.getUsername(),
                    "email", currentUser.getEmail(),
                    "roles", currentUser.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList()),
                    "enabled", currentUser.isEnabled()
                    // Add other safe fields if needed
            ));
        }
        // Fallback if principal is a standard UserDetails (less likely with our setup but good practice)
        else if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            return ResponseEntity.ok(Map.of(
                    "username", userDetails.getUsername(),
                    "roles", userDetails.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList()),
                     "enabled", userDetails.isEnabled()
            ));
        }
        // Handle unexpected principal type
        else {
            System.err.println("Unexpected principal type: " + principal.getClass().getName()); // Log unexpected type
            return ResponseEntity.status(500).body(Map.of("error", "Could not determine user details from principal"));
        }
    }

    // Example of an admin-only endpoint
    @GetMapping("/admin-check")
    @PreAuthorize("hasRole('ADMIN')") // Only users with ROLE_ADMIN can access
    public ResponseEntity<Map<String, String>> adminCheck() {
        return ResponseEntity.ok(Map.of("message", "Admin content visible!"));
    }
}