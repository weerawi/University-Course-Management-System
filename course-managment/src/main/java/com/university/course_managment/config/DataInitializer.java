package com.university.course_managment.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.university.course_managment.entity.User;
import com.university.course_managment.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    
    private final PasswordEncoder passwordEncoder;
    
    @Bean
    CommandLineRunner init(UserRepository userRepository) {
        return args -> {
            // Create default admin only
            if (!userRepository.existsByEmail("admin@university.edu")) {
                User admin = User.builder()
                        .email("admin@university.edu")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("System")
                        .lastName("Admin")
                        .role(User.Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created: admin@university.edu / admin123");
            }
        };
    }
}