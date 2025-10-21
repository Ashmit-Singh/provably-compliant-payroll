package com.compliantpay.controller;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // Moved import
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // Moved import

import com.compliantpay.model.User; // Moved import

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
    if (principal != null && principal instanceof User user) {
            // Return a Map or a dedicated UserProfileDTO (never include password)
            Map<String, Object> userMap = new java.util.HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("roles", user.getAuthorities().stream().map(a -> a.getAuthority()).toList());
            userMap.put("enabled", user.isEnabled());
            userMap.put("subscriptionTier", user.getSubscriptionTier());
            userMap.put("enabledFeatures", user.getEnabledFeatures());
            userMap.put("usageCount", user.getUsageCount());
            userMap.put("whiteLabelConfig", user.getWhiteLabelConfig());
            userMap.put("stripeCustomerId", user.getStripeCustomerId());
            userMap.put("stripeSubscriptionId", user.getStripeSubscriptionId());
            return ResponseEntity.ok(userMap);
        }
        // Fallback if principal is a standard UserDetails (less likely with our setup but good practice)
    else if (principal instanceof UserDetails userDetails) {
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
            System.err.println("Unexpected principal type: " + (principal != null ? principal.getClass().getName() : "null")); // Log unexpected type
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