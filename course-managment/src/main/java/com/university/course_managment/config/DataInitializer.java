package com.university.course_managment.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Student;
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
                System.out.println("Admin user created: admin@university.edu / admin123");
            }
            
            // Create default instructor
            if (!userRepository.existsByEmail("instructor@university.edu")) {
                User instructor = User.builder()
                        .email("instructor@university.edu")
                        .password(passwordEncoder.encode("instructor123"))
                        .firstName("John")
                        .lastName("Doe")
                        .role(User.Role.INSTRUCTOR)
                        .enabled(true)
                        .build();
                instructor = userRepository.save(instructor);
                System.out.println("Instructor user created: instructor@university.edu / instructor123");
                
                // Create sample courses
                if (!courseRepository.existsByCode("CS101")) {
                    Course course1 = Course.builder()
                            .code("CS101")
                            .title("Introduction to Programming")
                            .description("Learn the basics of programming")
                            .credits(3)
                            .capacity(30)
                            .instructor(instructor)
                            .build();
                    courseRepository.save(course1);
                    
                    Course course2 = Course.builder()
                            .code("CS102")
                            .title("Data Structures")
                            .description("Learn about data structures and algorithms")
                            .credits(4)
                            .capacity(25)
                            .instructor(instructor)
                            .build();
                    courseRepository.save(course2);
                    System.out.println("Sample courses created");
                }
            }
            
            // Create default student
            if (!userRepository.existsByEmail("student@university.edu")) {
                User studentUser = User.builder()
                        .email("student@university.edu")
                        .password(passwordEncoder.encode("student123"))
                        .firstName("Jane")
                        .lastName("Smith")
                        .role(User.Role.STUDENT)
                        .enabled(true)
                        .build();
                studentUser = userRepository.save(studentUser);
                
                Student student = Student.builder()
                        .studentId("STU001")
                        .user(studentUser)
                        .department("Computer Science")
                        .year(3)
                        .build();
                studentRepository.save(student);
                System.out.println("Student user created: student@university.edu / student123");
            }
        };
    }
}