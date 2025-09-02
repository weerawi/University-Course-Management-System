package com.university.course_managment.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Student;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.ResultRepository;
import com.university.course_managment.repository.StudentRepository;

@Service
public class EnrollmentService {
    
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final ResultRepository resultRepository;

    public EnrollmentService(StudentRepository studentRepository, 
                            CourseRepository courseRepository,
                            ResultRepository resultRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.resultRepository = resultRepository;
    }
    
    @Transactional
    public void enrollInCourse(Long courseId, Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        // Check if already enrolled
        if (student.getCourses().contains(course)) {
            throw new RuntimeException("Already enrolled in this course");
        }
        
        // Check capacity
        if (course.getStudents().size() >= course.getCapacity()) {
            throw new RuntimeException("Course is full");
        }
        
        // Add enrollment
        student.getCourses().add(course);
        course.getStudents().add(student);
        
        studentRepository.save(student);
        courseRepository.save(course);
    }
    
    @Transactional
    public void dropCourse(Long courseId, Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        if (!student.getCourses().contains(course)) {
            throw new RuntimeException("Not enrolled in this course");
        }
        
        // Check if student has results for this course
        if (resultRepository.findByStudentAndCourse(student, course).isPresent()) {
            throw new RuntimeException("Cannot drop course with existing results");
        }
        
        // Remove enrollment
        student.getCourses().remove(course);
        course.getStudents().remove(student);
        
        studentRepository.save(student);
        courseRepository.save(course);
    }
}