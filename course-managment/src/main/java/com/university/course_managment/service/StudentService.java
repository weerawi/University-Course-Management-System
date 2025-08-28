package com.university.course_managment.service;  

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.course_managment.dto.CourseDTO;
import com.university.course_managment.dto.StudentDTO;
import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.User;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
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
    
    // GET all students
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    // GET student by ID
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToDTO(student);
    }
    
    // CREATE student
    public StudentDTO createStudent(StudentDTO studentDTO) {
        User user = userRepository.findById(studentDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + studentDTO.getUserId()));
        
        Student student = Student.builder()
                .studentId(studentDTO.getStudentId())
                .user(user)
                .department(studentDTO.getDepartment())
                .year(studentDTO.getYear())
                .build();
        
        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }
    
    // UPDATE student
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        student.setStudentId(studentDTO.getStudentId());
        student.setDepartment(studentDTO.getDepartment());
        student.setYear(studentDTO.getYear());
        
        Student updated = studentRepository.save(student);
        return mapToDTO(updated);
    }
    
    // DELETE student
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }
    
    // Existing methods
    public StudentDTO getStudentProfile(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return mapToDTO(student);
    }
    
    public List<CourseDTO> getEnrolledCourses(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        return student.getCourses().stream()
                .map(this::mapCourseToDTO)
                .collect(Collectors.toList());
    }
    
    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setStudentId(student.getStudentId());
        dto.setFirstName(student.getUser().getFirstName());
        dto.setLastName(student.getUser().getLastName());
        dto.setEmail(student.getUser().getEmail());
        dto.setDepartment(student.getDepartment());
        dto.setYear(student.getYear());
        if (student.getCourses() != null) {
            dto.setEnrolledCourses(student.getCourses().size());
        } else {
            dto.setEnrolledCourses(0);
        }
        return dto;
    }
    
    private CourseDTO mapCourseToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        dto.setCapacity(course.getCapacity());
        dto.setEnrolledStudents(course.getStudents() != null ? course.getStudents().size() : 0);
        if (course.getInstructor() != null) {
            dto.setInstructorName(course.getInstructor().getFirstName() + " " + 
                                 course.getInstructor().getLastName());
        }
        return dto;
    }
}