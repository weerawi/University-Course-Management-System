package com.university.course_managment.controller;

import com.university.course_managment.dto.StudentDTO;
import com.university.course_managment.service.EnrollmentService;
import com.university.course_managment.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {
    
    private final EnrollmentService enrollmentService;
    private final StudentService studentService; // Add this
    
    // GET all students
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    // GET student by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }
    
    // CREATE student
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO created = studentService.createStudent(studentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    // UPDATE student
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updated = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(updated);
    }
    
    // DELETE student
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
    
    // Existing enrollment methods
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