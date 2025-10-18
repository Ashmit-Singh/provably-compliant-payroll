package com.compliantpay.dto;

import java.util.List;

// Response for successful login/registration (can be adapted for JWT/Session)
public class AuthResponse {
    private String message;
    private String username;
    private List<String> roles;
    private String token; // For JWT

    // Constructor for simple message
    public AuthResponse(String message) {
        this.message = message;
    }

     // Constructor for JWT response
    public AuthResponse(String token, String username, List<String> roles) {
        this.token = token;
        this.username = username;
        this.roles = roles;
        this.message = "Login successful!";
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}