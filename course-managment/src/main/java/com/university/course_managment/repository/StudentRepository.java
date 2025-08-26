package com.university.course_managment.repository; 

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.User;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByUser(User user);
    boolean existsByStudentId(String studentId);
}