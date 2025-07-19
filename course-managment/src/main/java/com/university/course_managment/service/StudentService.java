package com.university.course_managment.service;  

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.university.course_managment.dto.CourseDTO;
import com.university.course_managment.dto.StudentDTO;
import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Student;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.StudentRepository;
import com.university.course_managment.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {
    
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    
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
    
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDTO)
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
        dto.setEnrolledCourses(student.getCourses().size());
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
        dto.setEnrolledStudents(course.getStudents().size());
        if (course.getInstructor() != null) {
            dto.setInstructorName(course.getInstructor().getFirstName() + " " + 
                                 course.getInstructor().getLastName());
        }
        return dto;
    }
}