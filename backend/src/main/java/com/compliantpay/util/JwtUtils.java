package com.compliantpay.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value; // Import Value
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey; // Use javax.crypto.SecretKey
import java.util.Date;

@Component // Mark this as a Spring component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    // --- Configuration (move to application.yml/properties later) ---
    @Value("${app.jwt.secret}") // Read secret from application properties
    private String jwtSecret;

    @Value("${app.jwt.expirationMs}") // Read expiration time from application properties
    private int jwtExpirationMs;
    // --- End Configuration ---

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // Generate a JWT token from Authentication object
    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .subject((userPrincipal.getUsername())) // Set username as subject
                .issuedAt(new Date()) // Set issued timestamp
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Set expiration
                .signWith(key()) // Sign with the secret key using HMAC-SHA
                .compact(); // Build the token string
    }

    // Extract username from a JWT token
    public String getUserNameFromJwtToken(String token) {
         try {
             return Jwts.parser()
                        .verifyWith(key()) // Verify using the secret key
                        .build()
                        .parseSignedClaims(token) // Parse the token
                        .getPayload() // Get the claims (payload) part
                        .getSubject(); // Get the subject (username)
         } catch (JwtException e) {
             logger.error("Error parsing JWT token: {}", e.getMessage());
             return null; // Or throw a specific exception
         }
    }

    // Validate a JWT token
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                .verifyWith(key()) // Verify using the secret key
                .build()
                .parseSignedClaims(authToken); // Try parsing the token
            return true; // If no exception, it's valid
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) { // Catch broader exceptions like SignatureException
             logger.error("JWT validation error: {}", e.getMessage());
        }
        return false; // If any exception occurred, it's invalid
    }
}