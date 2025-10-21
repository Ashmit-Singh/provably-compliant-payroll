
package com.compliantpay.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority; // Import UserDetails
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; // Import Collection

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Index;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity; // Import Collectors
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_username", columnList = "username"),
    @Index(name = "idx_user_email", columnList = "email")
})
public class User implements UserDetails {



    // Already defined above, remove duplicate

        // Subscription tier: BASIC, PRO, ENTERPRISE
        @Column(name = "subscription_tier", nullable = false)
        private String subscriptionTier = "BASIC";

        // Premium feature flags (feature gating)
        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(name = "user_features", joinColumns = @JoinColumn(name = "user_id"))
        @Column(name = "feature")
        private Set<String> enabledFeatures = new HashSet<>();

        // Usage tracking for billing (e.g., API calls, payroll runs)
        @Column(name = "usage_count")
        private int usageCount = 0;

        // White-label configuration (JSON string for custom branding/settings)
        @Column(name = "white_label_config", columnDefinition = "TEXT")
        private String whiteLabelConfig;

        // Stripe/Payment API integration fields
        @Column(name = "stripe_customer_id")
        private String stripeCustomerId;
        @Column(name = "stripe_subscription_id")
        private String stripeSubscriptionId;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @NotBlank(message = "Password is required")
    @Column(nullable = false, length = 60) // Length 60 for BCrypt hash
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private final boolean enabled = true; // Flag to enable/disable user login

    // Store roles (e.g., "ROLE_USER", "ROLE_ADMIN")
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();

    // Optional: Link to Employee entity
    /*
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;
    */

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public User(String username, String password, String email) {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.subscriptionTier = "BASIC";
        this.username = username;
        this.password = password; // Hashing done in service
        this.email = email;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public String getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(String subscriptionTier) { this.subscriptionTier = subscriptionTier; }

    public Set<String> getEnabledFeatures() { return enabledFeatures; }
    public void setEnabledFeatures(Set<String> enabledFeatures) { this.enabledFeatures = enabledFeatures; }

    public int getUsageCount() { return usageCount; }
    public void setUsageCount(int usageCount) { this.usageCount = usageCount; }
    public void incrementUsageCount() { this.usageCount++; }

    public String getWhiteLabelConfig() { return whiteLabelConfig; }
    public void setWhiteLabelConfig(String whiteLabelConfig) { this.whiteLabelConfig = whiteLabelConfig; }

    public String getStripeCustomerId() { return stripeCustomerId; }
    public void setStripeCustomerId(String stripeCustomerId) { this.stripeCustomerId = stripeCustomerId; }

    public String getStripeSubscriptionId() { return stripeSubscriptionId; }
    public void setStripeSubscriptionId(String stripeSubscriptionId) { this.stripeSubscriptionId = stripeSubscriptionId; }
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    // Username getter is required by UserDetails, already present
    @Override
    public String getUsername() { return username; }
    @Override
    public String getPassword() { return password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    @Override
    public boolean isEnabled() { return enabled; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    /*
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    */

    // --- UserDetails Implementation ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert the Set<String> roles to a Collection<GrantedAuthority>
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Or add logic for account expiration
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Or add logic for account locking
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Or add logic for password expiration
    }

    // Helper method to add roles easily
    public void addRole(String role) {
        // Ensure roles start with "ROLE_" prefix if using Spring Security's defaults
        if (role != null && !role.startsWith("ROLE_")) {
            this.roles.add("ROLE_" + role.toUpperCase());
        } else if (role != null) {
            this.roles.add(role.toUpperCase());
        }
    }
}