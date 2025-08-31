package com.example.xpensa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
public class SpringSecurity {

    private final AuthenticationSuccessHandler successHandler;

    public SpringSecurity(AuthenticationSuccessHandler successHandler) {
        this.successHandler = successHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                		"/oauth2/**",
                        "/login",
                        "/login/**",
                        "/index.html",
                        "/error",
                        "/api/auth/**",
                        "/public/**",
                        "/assets/**",       // <-- React assets (Vite, etc.)
                        "/favicon.ico"
                		).permitAll()
                .anyRequest().authenticated()
            ).oauth2Login(oauth2 -> oauth2
            		.loginPage("/login")
            	    .defaultSuccessUrl("/mode-selection", true)
                    .successHandler(successHandler)
//            .oauth2Login(oauth2 -> oauth2
//                .loginPage("/login") // Optional: custom login page
//                .successHandler(successHandler)
            )
            .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity in dev (consider enabling in prod)
            .headers(headers -> headers.frameOptions().sameOrigin());

        return http.build();
    }
}
