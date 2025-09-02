package com.university.course_managment.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.course_managment.dto.CreateUserRequest;
import com.university.course_managment.dto.UpdateUserRequest;
import com.university.course_managment.dto.UserDTO;
import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.User;
import com.university.course_managment.entity.User.Role;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.StudentRepository;
import com.university.course_managment.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, StudentRepository studentRepository,
                      CourseRepository courseRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getUsersByRole(String role) {
        Role roleEnum = Role.valueOf(role);
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == roleEnum)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getUnassignedStudentUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .filter(user -> !studentRepository.existsByUserId(user.getId()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDTO(user);
    }

    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.valueOf(request.getRole()))
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Don't allow role change if user has dependencies
        if (!user.getRole().name().equals(request.getRole())) {
            if (user.getRole() == Role.STUDENT && studentRepository.existsByUserId(id)) {
                throw new RuntimeException("Cannot change role. User has a student profile.");
            }
            if (user.getRole() == Role.INSTRUCTOR && !courseRepository.findByInstructor(user).isEmpty()) {
                throw new RuntimeException("Cannot change role. User is assigned to courses.");
            }
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.valueOf(request.getRole()));
        user.setEnabled(request.isEnabled());

        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Check if this is the last admin
        if (user.getRole() == Role.ADMIN) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.ADMIN)
                    .count();
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot delete the last admin user");
            }
        }
        
        // Check dependencies
        if (user.getRole() == Role.STUDENT) {
            // Delete student profile first if exists
            Optional<Student> student = studentRepository.findByUserId(id);
            if (student.isPresent()) {
                // Clear enrollments first
                student.get().getCourses().clear();
                studentRepository.save(student.get());
                // Delete student profile
                studentRepository.delete(student.get());
            }
        }
        
        if (user.getRole() == Role.INSTRUCTOR) {
            // Remove instructor from courses
            List<Course> courses = courseRepository.findByInstructor(user);
            for (Course course : courses) {
                course.setInstructor(null);
                courseRepository.save(course);
            }
        }
        
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDTO updatePassword(Long id, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setPassword(passwordEncoder.encode(password));
        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }
    
    private UserDTO mapToDTO(User user) {
        boolean hasStudentProfile = false;
        if (user.getRole() == Role.STUDENT) {
            hasStudentProfile = studentRepository.existsByUserId(user.getId());
        }
        
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .hasStudentProfile(hasStudentProfile)
                .build();
    }
}