package com.university.course_managment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication; 
import com.university.course_managment.dto.CourseDTO;
import com.university.course_managment.dto.StudentDTO;
import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.User;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.ResultRepository;
import com.university.course_managment.repository.StudentRepository;
import com.university.course_managment.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {
    
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ResultRepository resultRepository;
    private final PasswordEncoder passwordEncoder;
    
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToDTO(student);
    }
    
    @Transactional
    public StudentDTO createStudent(StudentDTO studentDTO) {
        // Check if studentId already exists
        if (studentRepository.existsByStudentId(studentDTO.getStudentId())) {
            throw new RuntimeException("Student ID " + studentDTO.getStudentId() + " already exists");
        }
        
        User user;
        
        // If userId is provided, use existing user
        if (studentDTO.getUserId() != null) {
            user = userRepository.findById(studentDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + studentDTO.getUserId()));
            
            // Check if user already has a student profile
            if (studentRepository.existsByUserId(user.getId())) {
                throw new RuntimeException("User already has a student profile");
            }
            
            // Verify user has STUDENT role
            if (user.getRole() != User.Role.STUDENT) {
                throw new RuntimeException("User must have STUDENT role");
            }
        } else {
            // Create new user if not provided
            if (studentDTO.getEmail() == null || studentDTO.getEmail().isEmpty()) {
                throw new RuntimeException("Email is required for new student");
            }
            
            if (userRepository.existsByEmail(studentDTO.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            
            user = User.builder()
                    .email(studentDTO.getEmail())
                    .password(passwordEncoder.encode("student123")) // Default password
                    .firstName(studentDTO.getFirstName())
                    .lastName(studentDTO.getLastName())
                    .role(User.Role.STUDENT)
                    .enabled(true)
                    .build();
            user = userRepository.save(user);
        }
        
        Student student = Student.builder()
                .studentId(studentDTO.getStudentId())
                .user(user)
                .department(studentDTO.getDepartment())
                .year(studentDTO.getYear())
                .build();
        
        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }
    
    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        // Check if new studentId conflicts with existing ones
        if (!student.getStudentId().equals(studentDTO.getStudentId())) {
            if (studentRepository.existsByStudentId(studentDTO.getStudentId())) {
                throw new RuntimeException("Student ID " + studentDTO.getStudentId() + " already exists");
            }
        }
        
        student.setStudentId(studentDTO.getStudentId());
        student.setDepartment(studentDTO.getDepartment());
        student.setYear(studentDTO.getYear());
        
        // Update user information if provided
        if (studentDTO.getFirstName() != null) {
            student.getUser().setFirstName(studentDTO.getFirstName());
        }
        if (studentDTO.getLastName() != null) {
            student.getUser().setLastName(studentDTO.getLastName());
        }
        
        Student updated = studentRepository.save(student);
        return mapToDTO(updated);
    }
    
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        // Check if student has results
        if (!student.getResults().isEmpty()) {
            throw new RuntimeException("Cannot delete student. Student has " + 
                    student.getResults().size() + " results. Please delete results first.");
        }
        
        // Clear course enrollments
        student.getCourses().clear();
        studentRepository.save(student);
        
        // Delete the student
        studentRepository.deleteById(id);
    }
    
    public List<CourseDTO> getEnrolledCourses(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        return student.getCourses().stream()
                .map(this::mapCourseToDTO)
                .collect(Collectors.toList());
    }
    
    private StudentDTO mapToDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .firstName(student.getUser().getFirstName())
                .lastName(student.getUser().getLastName())
                .email(student.getUser().getEmail())
                .department(student.getDepartment())
                .year(student.getYear())
                .userId(student.getUser().getId())
                .enrolledCourses(student.getCourses() != null ? student.getCourses().size() : 0)
                .build();
    }
    
    private CourseDTO mapCourseToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        dto.setCapacity(course.getCapacity());
        if (course.getInstructor() != null) {
            dto.setInstructorName(course.getInstructor().getFirstName() + " " + 
                                course.getInstructor().getLastName());
            dto.setInstructorId(course.getInstructor().getId());
        }
        return dto;
    }

    public StudentDTO getStudentByUserId(Long userId) {
    Student student = studentRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found for user id: " + userId));
    return mapToDTO(student);
}

public boolean isOwnProfile(Long studentId, Authentication authentication) {
    if (authentication != null && authentication.getPrincipal() instanceof User) {
        User user = (User) authentication.getPrincipal();
        Student student = studentRepository.findById(studentId).orElse(null);
        return student != null && student.getUser().getId().equals(user.getId());
    }
    return false;
}
}