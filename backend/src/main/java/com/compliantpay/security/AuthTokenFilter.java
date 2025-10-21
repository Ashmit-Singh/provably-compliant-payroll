
package com.compliantpay.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.compliantpay.service.impl.UserDetailsServiceImpl;
import com.compliantpay.util.JwtUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT Authentication Filter
 * Intercepts requests and validates JWT tokens
 */
@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    
    private JwtUtils jwtUtils;

    
    private UserDetailsServiceImpl userDetailsService;

    

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Extract JWT from the Authorization header
            String jwt = parseJwt(request);

            // Validate the token
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // Extract username from the token
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                // Load UserDetails using the username
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Create an Authentication object
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Set details (like IP address, session ID)
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the Authentication object in the SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("Set Authentication context for user: " + username);
            }
        } catch (RuntimeException e) {
            logger.error("Cannot set user authentication", e);
        }
        // Continue the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT from "Authorization: Bearer <token>" header
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        logger.trace("No JWT token found in Authorization header");
        return null;
    }
}
