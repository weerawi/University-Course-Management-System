package com.university.course_managment.dto;

import java.util.List;

public class StudentDTO {
    private Long id;
    private String studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private Integer year;
    private Long userId;
    private List<CourseDTO> courses;
    private Integer enrolledCourses;

    // Constructors
    public StudentDTO() {}

    public StudentDTO(Long id, String studentId, String firstName, String lastName, 
                     String email, String department, Integer year, Long userId, 
                     List<CourseDTO> courses, Integer enrolledCourses) {
        this.id = id;
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.year = year;
        this.userId = userId;
        this.courses = courses;
        this.enrolledCourses = enrolledCourses;
    }

    // Builder pattern
    public static StudentDTOBuilder builder() {
        return new StudentDTOBuilder();
    }

    public static class StudentDTOBuilder {
        private Long id;
        private String studentId;
        private String firstName;
        private String lastName;
        private String email;
        private String department;
        private Integer year;
        private Long userId;
        private List<CourseDTO> courses;
        private Integer enrolledCourses;

        public StudentDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public StudentDTOBuilder studentId(String studentId) {
            this.studentId = studentId;
            return this;
        }

        public StudentDTOBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public StudentDTOBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public StudentDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public StudentDTOBuilder department(String department) {
            this.department = department;
            return this;
        }

        public StudentDTOBuilder year(Integer year) {
            this.year = year;
            return this;
        }

        public StudentDTOBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public StudentDTOBuilder courses(List<CourseDTO> courses) {
            this.courses = courses;
            return this;
        }

        public StudentDTOBuilder enrolledCourses(Integer enrolledCourses) {
            this.enrolledCourses = enrolledCourses;
            return this;
        }

        public StudentDTO build() {
            return new StudentDTO(id, studentId, firstName, lastName, email, 
                                department, year, userId, courses, enrolledCourses);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CourseDTO> getCourses() {
        return courses;
    }

    public void setCourses(List<CourseDTO> courses) {
        this.courses = courses;
    }

    public Integer getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(Integer enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }
}