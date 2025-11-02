package com.bloodleague.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {


            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                // Allow requests from the frontend. In production you should set
                // a specific frontend origin (or a comma-separated list) in an
                // environment variable and load it here. For convenience we allow
                // all origins using allowedOriginPatterns which supports wildcards.
                // This fixes CORS errors when the frontend is served from a
                // different generated domain (e.g. Railway).
                registry.addMapping("/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }

}
