package com.university.course_managment.dto;

public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String role;
    private boolean enabled;

    // Constructors
    public UpdateUserRequest() {}

    public UpdateUserRequest(String firstName, String lastName, String role, boolean enabled) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.enabled = enabled;
    }

    // Getters and Setters
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}