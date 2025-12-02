package com.ticktick.controller;

import com.ticktick.dto.auth.AuthResponse;
import com.ticktick.dto.auth.LoginRequest;
import com.ticktick.dto.auth.SignUpRequest;
import com.ticktick.dto.auth.UserDTO;
import com.ticktick.security.UserPrincipal;
import com.ticktick.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        // This endpoint returns the current authenticated user
        return ResponseEntity.ok(UserDTO.builder()
                .id(currentUser.getId())
                .email(currentUser.getEmail())
                .build());
    }
}
