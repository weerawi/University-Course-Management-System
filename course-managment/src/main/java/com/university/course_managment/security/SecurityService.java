package com.university.course_managment.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.university.course_managment.entity.User;

@Service
public class SecurityService {

    public boolean isSameUser(Long userId, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            return user.getId().equals(userId);
        }
        return false;
    }
}