package com.ticktick.security.oauth2;

import com.ticktick.entity.User;
import com.ticktick.exception.OAuth2AuthenticationProcessingException;
import com.ticktick.repository.UserRepository;
import com.ticktick.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    
    private final UserRepository userRepository;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }
    
    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        Map<String, Object> attributes = oauth2User.getAttributes();
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, attributes);
        
        if (!StringUtils.hasText(userInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }
        
        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());
        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProvider().equals(User.AuthProvider.valueOf(registrationId.toUpperCase()))) {
                throw new OAuth2AuthenticationProcessingException(
                        "Looks like you're signed up with " + user.getProvider() + " account. " +
                        "Please use your " + user.getProvider() + " account to login."
                );
            }
            user = updateExistingUser(user, userInfo);
        } else {
            user = registerNewUser(userRequest, userInfo);
        }
        
        return UserPrincipal.create(user, attributes);
    }
    
    private User registerNewUser(OAuth2UserRequest userRequest, OAuth2UserInfo userInfo) {
        User user = User.builder()
                .name(userInfo.getName())
                .email(userInfo.getEmail())
                .profilePicture(userInfo.getImageUrl())
                .provider(User.AuthProvider.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase()))
                .providerId(userInfo.getId())
                .emailVerified(true)
                .roles(Set.of(User.Role.USER))
                .build();
        
        return userRepository.save(user);
    }
    
    private User updateExistingUser(User existingUser, OAuth2UserInfo userInfo) {
        existingUser.setName(userInfo.getName());
        existingUser.setProfilePicture(userInfo.getImageUrl());
        return userRepository.save(existingUser);
    }
}
