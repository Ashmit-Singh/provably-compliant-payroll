
package com.compliantpay.config;

import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000", "http://localhost:3001")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
        }

        // Enable gzip compression for API responses
        // This requires spring-boot-starter-web dependency
        // Add to application.properties: server.compression.enabled=true
        // For explicit config, you can use a filter:
        /*
        @Bean
        public FilterRegistrationBean<GzipFilter> gzipFilter() {
            FilterRegistrationBean<GzipFilter> registration = new FilterRegistrationBean<>();
            registration.setFilter(new GzipFilter());
            registration.addUrlPatterns("/api/*");
            return registration;
        }
        */
    }
// Removed misplaced closing brace