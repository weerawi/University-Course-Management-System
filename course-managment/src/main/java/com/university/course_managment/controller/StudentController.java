package com.university.course_managment.controller; 

import com.university.course_managment.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {
    
    private final EnrollmentService enrollmentService;
    
    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> enrollInCourse(@PathVariable Long courseId) {
        enrollmentService.enrollInCourse(courseId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/drop/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> dropCourse(@PathVariable Long courseId) {
        enrollmentService.dropCourse(courseId);
        return ResponseEntity.ok().build();
    }
}