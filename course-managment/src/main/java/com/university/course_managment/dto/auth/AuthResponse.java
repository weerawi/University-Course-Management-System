package com.university.course_managment.dto.auth; 

import com.university.course_managment.entity.User.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private Long id; 
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}