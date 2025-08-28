package com.university.course_managment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.User;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);
    Optional<Student> findByUserId(Long userId);
    // Add this method
    Optional<Student> findByUser(User user);
    boolean existsByUserId(Long userId);
    List<Student> findByCourses_Id(Long courseId);
}