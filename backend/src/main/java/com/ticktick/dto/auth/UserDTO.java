package com.ticktick.dto.auth;

import com.ticktick.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private String profilePicture;
    private User.AuthProvider provider;
    private Boolean emailVerified;
    private Set<User.Role> roles;
    private Boolean darkMode;
    private String timezone;
    private LocalDateTime createdAt;
}
