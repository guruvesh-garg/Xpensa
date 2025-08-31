package com.example.xpensa.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.security.Principal;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/status")
    public ResponseEntity<?> authStatus(HttpSession session, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
        OAuth2User oAuth2User = authToken.getPrincipal();

        Map<String, Object> userInfo = Map.of(
            "email", oAuth2User.getAttribute("email"),
            "name", oAuth2User.getAttribute("name")
        );

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
