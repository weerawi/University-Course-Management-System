package com.university.course_managment.service; 

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.course_managment.dto.CourseDTO;
import com.university.course_managment.dto.CreateCourseRequest;
import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.User;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public CourseDTO createCourse(CreateCourseRequest request) {
        Course course = Course.builder()
                .code(request.getCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .credits(request.getCredits())
                .capacity(request.getCapacity())
                .build();
        
        if (request.getInstructorId() != null) {
            User instructor = userRepository.findById(request.getInstructorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));
            
            if (instructor.getRole() != User.Role.INSTRUCTOR) {
                throw new RuntimeException("User is not an instructor");
            }
            
            course.setInstructor(instructor);
        }
        
        course = courseRepository.save(course);
        return mapToDTO(course);
    }
    
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return mapToDTO(course);
    }

    public Page<CourseDTO> searchCourses(String keyword, String department, Pageable pageable) {
        Page<Course> courses;
        
        if (keyword != null && !keyword.isEmpty()) {
            courses = courseRepository.findByTitleContainingOrCodeContaining(keyword, keyword, pageable);
        } else {
            courses = courseRepository.findAll(pageable);
        }
        
        return courses.map(this::mapToDTO);
    }
    
    @Transactional
    public CourseDTO updateCourse(Long id, CreateCourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setCapacity(request.getCapacity());
        
        if (request.getInstructorId() != null) {
            User instructor = userRepository.findById(request.getInstructorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));
            course.setInstructor(instructor);
        }
        
        course = courseRepository.save(course);
        return mapToDTO(course);
    }
    
    @Transactional
    // public void deleteCourse(Long id) {
    //     if (!courseRepository.existsById(id)) {
    //         throw new ResourceNotFoundException("Course not found");
    //     }
    //     courseRepository.deleteById(id);
    // } 
    public void deleteCourse(Long id) {
        // Check if course exists
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        try {
            // Simple delete - let database handle cascade or throw constraint error
            courseRepository.deleteById(id);
        } catch (Exception e) {
            // If foreign key constraint error, provide helpful message
            if (e.getMessage().contains("foreign key constraint")) {
                throw new RuntimeException("Cannot delete course. It has associated students or results. Please remove them first.");
            }
            throw new RuntimeException("Failed to delete course: " + e.getMessage());
        }
    }
    
    
    private CourseDTO mapToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        dto.setCapacity(course.getCapacity());
        dto.setEnrolledStudents(courseRepository.getEnrolledStudentCount(course.getId()));
        
        if (course.getInstructor() != null) {
            dto.setInstructorId(course.getInstructor().getId());
            dto.setInstructorName(course.getInstructor().getFirstName() + " " + 
                                 course.getInstructor().getLastName());
        }
        
        return dto;
    }
}