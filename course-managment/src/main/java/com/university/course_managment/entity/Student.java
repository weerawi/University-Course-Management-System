package com.university.course_managment.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student extends BaseEntity {
    
    @Column(unique = true, nullable = false)
    private String studentId;
    
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    private String department;
    
    private Integer year;
    
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "student_courses",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Result> results = new HashSet<>();

    // Constructors
    public Student() {}

    public Student(String studentId, User user, String department, Integer year) {
        this.studentId = studentId;
        this.user = user;
        this.department = department;
        this.year = year;
    }

    // Builder pattern
    public static StudentBuilder builder() {
        return new StudentBuilder();
    }

    public static class StudentBuilder {
        private String studentId;
        private User user;
        private String department;
        private Integer year;
        private Set<Course> courses = new HashSet<>();
        private Set<Result> results = new HashSet<>();

        public StudentBuilder studentId(String studentId) {
            this.studentId = studentId;
            return this;
        }

        public StudentBuilder user(User user) {
            this.user = user;
            return this;
        }

        public StudentBuilder department(String department) {
            this.department = department;
            return this;
        }

        public StudentBuilder year(Integer year) {
            this.year = year;
            return this;
        }

        public StudentBuilder courses(Set<Course> courses) {
            this.courses = courses;
            return this;
        }

        public StudentBuilder results(Set<Result> results) {
            this.results = results;
            return this;
        }

        public Student build() {
            Student student = new Student(studentId, user, department, year);
            student.setCourses(courses);
            student.setResults(results);
            return student;
        }
    }

    // Getters and Setters
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Set<Course> getCourses() {
        return courses;
    }

    public void setCourses(Set<Course> courses) {
        this.courses = courses;
    }

    public Set<Result> getResults() {
        return results;
    }

    public void setResults(Set<Result> results) {
        this.results = results;
    }

    @Override
    public String toString() {
        return "Student{" +
                "studentId='" + studentId + '\'' +
                ", department='" + department + '\'' +
                ", year=" + year +
                '}';
    }
}