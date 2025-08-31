package com.example.xpensa.handler;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.xpensa.model.UserEntity;
import com.example.xpensa.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;
    
    @Value("${frontend.url}")
    private String redirectUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();
        
        

        if (!(principal instanceof OAuth2User)) {
            throw new IllegalStateException("Authentication principal is not an OAuth2User");
        }

        OAuth2User oAuth2User = (OAuth2User) principal;

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");

        if (email == null || googleId == null) {
            throw new IllegalStateException("Missing required OAuth2 user attributes");
        }

        // Save user in DB if not exists
        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            UserEntity newUser = new UserEntity();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setGoogleId(googleId);
            return userRepository.save(newUser);
        });

        // Store user in session
        request.getSession().setAttribute("user", user);
        
        
        // Redirect to frontend
        response.sendRedirect(redirectUrl+"/mode-selection");
    }
}
