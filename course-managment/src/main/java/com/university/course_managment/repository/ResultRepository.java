package com.university.course_managment.repository; 

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Result;
import com.university.course_managment.entity.Student;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudent(Student student);
    List<Result> findByCourse(Course course);
    Optional<Result> findByStudentAndCourse(Student student, Course course);
    List<Result> findByStudentAndSemester(Student student, String semester);
    
    // Add method to find by student, course, year, and semester
    Optional<Result> findByStudentAndCourseAndYearAndSemester(
            Student student, Course course, Integer year, String semester);
    
    List<Result> findByYearAndSemester(Integer year, String semester);
}