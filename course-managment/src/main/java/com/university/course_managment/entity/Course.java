package com.university.course_managment.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Course extends BaseEntity {
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Integer credits;
    
    private Integer capacity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    @JsonIgnoreProperties({"courses", "password", "hibernateLazyInitializer"})
    private User instructor;
    
    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    private Set<Student> students = new HashSet<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Result> results = new HashSet<>();

    // Constructors
    public Course() {}

    public Course(String code, String title, String description, Integer credits, Integer capacity, User instructor) {
        this.code = code;
        this.title = title;
        this.description = description;
        this.credits = credits;
        this.capacity = capacity;
        this.instructor = instructor;
    }

    // Builder pattern
    public static CourseBuilder builder() {
        return new CourseBuilder();
    }

    public static class CourseBuilder {
        private String code;
        private String title;
        private String description;
        private Integer credits;
        private Integer capacity;
        private User instructor;
        private Set<Student> students = new HashSet<>();
        private Set<Result> results = new HashSet<>();

        public CourseBuilder code(String code) {
            this.code = code;
            return this;
        }

        public CourseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public CourseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CourseBuilder credits(Integer credits) {
            this.credits = credits;
            return this;
        }

        public CourseBuilder capacity(Integer capacity) {
            this.capacity = capacity;
            return this;
        }

        public CourseBuilder instructor(User instructor) {
            this.instructor = instructor;
            return this;
        }

        public CourseBuilder students(Set<Student> students) {
            this.students = students;
            return this;
        }

        public CourseBuilder results(Set<Result> results) {
            this.results = results;
            return this;
        }

        public Course build() {
            Course course = new Course(code, title, description, credits, capacity, instructor);
            course.setStudents(students);
            course.setResults(results);
            return course;
        }
    }

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public User getInstructor() {
        return instructor;
    }

    public void setInstructor(User instructor) {
        this.instructor = instructor;
    }

    public Set<Student> getStudents() {
        return students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
    }

    public Set<Result> getResults() {
        return results;
    }

    public void setResults(Set<Result> results) {
        this.results = results;
    }

    @Override
    public String toString() {
        return "Course{" +
                "code='" + code + '\'' +
                ", title='" + title + '\'' +
                ", credits=" + credits +
                '}';
    }
}