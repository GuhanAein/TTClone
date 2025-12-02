package com.ticktick.service;

import com.ticktick.dto.auth.AuthResponse;
import com.ticktick.dto.auth.LoginRequest;
import com.ticktick.dto.auth.SignUpRequest;
import com.ticktick.dto.auth.UserDTO;
import com.ticktick.entity.User;
import com.ticktick.exception.BadRequestException;
import com.ticktick.repository.UserRepository;
import com.ticktick.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address already in use");
        }
        
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider(User.AuthProvider.LOCAL)
                .emailVerified(false)
                .roles(Set.of(User.Role.USER))
                .build();
        
        user = userRepository.save(user);
        
        String accessToken = tokenProvider.generateToken(user.getId());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserDTO(user))
                .build();
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        
        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserDTO(user))
                .build();
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }
        
        Long userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        String newAccessToken = tokenProvider.generateToken(userId);
        String newRefreshToken = tokenProvider.generateRefreshToken(userId);
        
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(mapToUserDTO(user))
                .build();
    }
    
    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profilePicture(user.getProfilePicture())
                .provider(user.getProvider())
                .emailVerified(user.getEmailVerified())
                .roles(user.getRoles())
                .darkMode(user.getDarkMode())
                .timezone(user.getTimezone())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
