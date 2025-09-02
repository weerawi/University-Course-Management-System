package com.university.course_managment.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.course_managment.dto.CourseDTO;
import com.university.course_managment.dto.StudentDTO;
import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.User;
import com.university.course_managment.repository.StudentRepository;
import com.university.course_managment.service.EnrollmentService;
import com.university.course_managment.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {
    
    private final EnrollmentService enrollmentService;
    private final StudentService studentService;
    private final StudentRepository studentRepository;

    public StudentController(EnrollmentService enrollmentService, 
                           StudentService studentService,
                           StudentRepository studentRepository) {
        this.enrollmentService = enrollmentService;
        this.studentService = studentService;
        this.studentRepository = studentRepository;
    }
    
    // GET all students - Admin only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    // GET student by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR') or (hasRole('STUDENT') and @studentService.isOwnProfile(#id, authentication))")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id, Authentication authentication) {
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }
    
    // CREATE student - Admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO created = studentService.createStudent(studentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    // UPDATE student - Admin only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updated = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(updated);
    }
    
    // DELETE student - Admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
    
    // ENROLL in course - Student only
    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> enrollInCourse(@PathVariable Long courseId, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        enrollmentService.enrollInCourse(courseId, currentUser.getId());
        return ResponseEntity.ok().build();
    }
    
    // DROP course - Student only
    @DeleteMapping("/drop/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> dropCourse(@PathVariable Long courseId, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        enrollmentService.dropCourse(courseId, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    // GET student's enrolled courses
    @GetMapping("/{id}/courses")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR') or (hasRole('STUDENT') and @studentService.isOwnProfile(#id, authentication))")
    public ResponseEntity<List<CourseDTO>> getStudentCourses(@PathVariable Long id) {
        List<CourseDTO> courses = studentService.getEnrolledCourses(id);
        return ResponseEntity.ok(courses);
    }
    
    // GET current student's profile
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDTO> getCurrentStudentProfile(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        
        // Try to find student profile
        Optional<Student> studentOpt = studentRepository.findByUserId(currentUser.getId());
        
        if (studentOpt.isEmpty()) {
            // Create a basic student profile if it doesn't exist
            Student newStudent = Student.builder()
                    .studentId("STU" + String.format("%05d", currentUser.getId()))
                    .user(currentUser)
                    .department("General Studies")
                    .year(1)
                    .build();
            Student saved = studentRepository.save(newStudent);
            return ResponseEntity.ok(mapStudentToDTO(saved));
        }
        
        return ResponseEntity.ok(mapStudentToDTO(studentOpt.get()));
    }

    private StudentDTO mapStudentToDTO(Student student) {
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
}