package com.university.course_managment.dto.auth;

import com.university.course_managment.entity.User.Role;

public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, Long id, String email, String firstName, String lastName, Role role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    // Builder pattern
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private Role role;

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AuthResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AuthResponseBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public AuthResponseBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public AuthResponseBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(token, id, email, firstName, lastName, role);
        }
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}