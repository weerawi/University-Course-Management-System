package com.university.course_managment.config; 

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.university.course_managment.entity.User;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.StudentRepository;
import com.university.course_managment.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    
    private final PasswordEncoder passwordEncoder;
    
    @Bean
    CommandLineRunner init(UserRepository userRepository,
                          StudentRepository studentRepository,
                          CourseRepository courseRepository) {
        return args -> {
            // Create default admin
            if (!userRepository.existsByEmail("admin@university.edu")) {
                User admin = User.builder()
                        .email("admin@university.edu")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("Admin")
                        .lastName("User")
                        .role(User.Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
            }
            
            // // Create default instructor
            // if (!userRepository.existsByEmail("instructor@university.edu")) {
            //     User instructor = User.builder()
            //             .email("instructor@university.edu")
            //             .password(passwordEncoder.encode("instructor123"))
            //             .firstName("John")
            //             .lastName("Doe")
            //             .role(User.Role.INSTRUCTOR)
            //             .enabled(true)
            //             .build();
            //     userRepository.save(instructor);
            // }
            
            // // Create default student
            // if (!userRepository.existsByEmail("student@university.edu")) {
            //     User studentUser = User.builder()
            //             .email("student@university.edu")
            //             .password(passwordEncoder.encode("student123"))
            //             .firstName("Jane")
            //             .lastName("Smith")
            //             .role(User.Role.STUDENT)
            //             .enabled(true)
            //             .build();
            //     studentUser = userRepository.save(studentUser);
                
            //     Student student = Student.builder()
            //             .studentId("STU001")
            //             .user(studentUser)
            //             .department("Computer Science")
            //             .year(3)
            //             .build();
            //     studentRepository.save(student);
            // }
        };
    }
}
