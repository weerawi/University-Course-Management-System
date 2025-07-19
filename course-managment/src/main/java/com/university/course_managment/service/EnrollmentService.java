package com.university.course_managment.service; 

import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.User;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    
    @Transactional
    public void enrollInCourse(Long courseId) {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        
        Student student = studentRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        // Check if already enrolled
        if (student.getCourses().contains(course)) {
            throw new RuntimeException("Already enrolled in this course");
        }
        
        // Check capacity
        Integer enrolled = courseRepository.getEnrolledStudentCount(courseId);
        if (enrolled >= course.getCapacity()) {
            throw new RuntimeException("Course is full");
        }
        
        student.getCourses().add(course);
        studentRepository.save(student);
    }
    
    @Transactional
    public void dropCourse(Long courseId) {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        
        Student student = studentRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        if (!student.getCourses().contains(course)) {
            throw new RuntimeException("Not enrolled in this course");
        }
        
        student.getCourses().remove(course);
        studentRepository.save(student);
    }
}
