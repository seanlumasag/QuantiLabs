package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class CorsConfig {

    /**
     * Configure CORS settings for the backend.
     * This allows specified frontends and ml-services to make cross-origin
     * requests to the API.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**") // Apply CORS rules to all endpoints
                        .allowedOrigins(
                                // Local development frontend (React)
                                "http://localhost:5173")

                        // Allow typical CRUD operations
                        .allowedMethods("GET", "POST", "PUT", "DELETE")

                        // Allow all headers (like Content-Type, Authorization)
                        .allowedHeaders("*");
            }
        };
    }
}