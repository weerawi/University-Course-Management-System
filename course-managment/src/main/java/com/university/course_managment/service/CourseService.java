package com.university.course_managment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.course_managment.dto.CourseDTO;
import com.university.course_managment.dto.CreateCourseRequest;
import com.university.course_managment.dto.StudentDTO;
import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.User;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.ResultRepository;
import com.university.course_managment.repository.StudentRepository;
import com.university.course_managment.repository.UserRepository;

@Service
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ResultRepository resultRepository;

    public CourseService(CourseRepository courseRepository, 
                        UserRepository userRepository,
                        StudentRepository studentRepository, 
                        ResultRepository resultRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.resultRepository = resultRepository;
    }
    
    @Transactional
    public CourseDTO createCourse(CreateCourseRequest request) {
        // Check if course code already exists
        if (courseRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Course with code " + request.getCode() + " already exists");
        }
        
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
    
    @Transactional
    public CourseDTO updateCourse(Long id, CreateCourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        // Check if new code conflicts with existing courses
        if (!course.getCode().equals(request.getCode())) {
            if (courseRepository.findByCode(request.getCode()).isPresent()) {
                throw new RuntimeException("Course with code " + request.getCode() + " already exists");
            }
        }
        
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setCapacity(request.getCapacity());
        
        if (request.getInstructorId() != null) {
            User instructor = userRepository.findById(request.getInstructorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));
            
            if (instructor.getRole() != User.Role.INSTRUCTOR) {
                throw new RuntimeException("User is not an instructor");
            }
            
            course.setInstructor(instructor);
        } else {
            course.setInstructor(null);
        }
        
        course = courseRepository.save(course);
        return mapToDTO(course);
    }
    
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        // Check if course has enrolled students
        if (!course.getStudents().isEmpty()) {
            throw new RuntimeException("Cannot delete course. " + course.getStudents().size() + 
                    " students are enrolled. Please remove all enrollments first.");
        }
        
        // Check if course has results
        if (!course.getResults().isEmpty()) {
            throw new RuntimeException("Cannot delete course. It has " + course.getResults().size() + 
                    " associated results. Please delete results first.");
        }
        
        courseRepository.deleteById(id);
    }
    
    private CourseDTO mapToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        dto.setCapacity(course.getCapacity());
        dto.setEnrolledStudents(course.getStudents() != null ? course.getStudents().size() : 0);
        
        if (course.getInstructor() != null) {
            dto.setInstructorId(course.getInstructor().getId());
            dto.setInstructorName(course.getInstructor().getFirstName() + " " + 
                                 course.getInstructor().getLastName());
        }
        
        return dto;
    }

    public List<StudentDTO> getCourseStudents(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        return course.getStudents().stream()
                .map(student -> StudentDTO.builder()
                        .id(student.getId())
                        .studentId(student.getStudentId())
                        .firstName(student.getUser().getFirstName())
                        .lastName(student.getUser().getLastName())
                        .email(student.getUser().getEmail())
                        .department(student.getDepartment())
                        .year(student.getYear())
                        .build())
                .collect(Collectors.toList());
    }
}