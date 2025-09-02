package com.university.course_managment.dto;

public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private boolean enabled;
    private boolean hasStudentProfile;

    // Constructors
    public UserDTO() {}

    public UserDTO(Long id, String email, String firstName, String lastName, 
                  String role, boolean enabled, boolean hasStudentProfile) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.enabled = enabled;
        this.hasStudentProfile = hasStudentProfile;
    }

    // Builder pattern
    public static UserDTOBuilder builder() {
        return new UserDTOBuilder();
    }

    public static class UserDTOBuilder {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private boolean enabled;
        private boolean hasStudentProfile;

        public UserDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserDTOBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserDTOBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserDTOBuilder role(String role) {
            this.role = role;
            return this;
        }

        public UserDTOBuilder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public UserDTOBuilder hasStudentProfile(boolean hasStudentProfile) {
            this.hasStudentProfile = hasStudentProfile;
            return this;
        }

        public UserDTO build() {
            return new UserDTO(id, email, firstName, lastName, role, enabled, hasStudentProfile);
        }
    }

    // Getters and Setters
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

    public boolean isHasStudentProfile() {
        return hasStudentProfile;
    }

    public void setHasStudentProfile(boolean hasStudentProfile) {
        this.hasStudentProfile = hasStudentProfile;
    }
}