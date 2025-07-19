package com.university.course_managment.repository; 

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.User;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    List<Course> findByInstructor(User instructor);
    
    @Query("SELECT c FROM Course c WHERE c.capacity > SIZE(c.students)")
    List<Course> findAvailableCourses();
    
    @Query("SELECT COUNT(s) FROM Course c JOIN c.students s WHERE c.id = :courseId")
    Integer getEnrolledStudentCount(@Param("courseId") Long courseId);

    Page<Course> findByTitleContainingOrCodeContaining(String title, String code, Pageable pageable);
}