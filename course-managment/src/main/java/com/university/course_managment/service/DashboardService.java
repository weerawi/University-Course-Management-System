// package com.university.course_managment.service; 

// import com.university.course_managment.dto.DashboardStats;
// import com.university.course_managment.entity.User;
// import com.university.course_managment.repository.*;
// import lombok.RequiredArgsConstructor;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Service;

// import java.util.HashMap;
// import java.util.Map;
// import java.util.List;

// @Service
// @RequiredArgsConstructor
// public class DashboardService {
    
//     private final UserRepository userRepository;
//     private final CourseRepository courseRepository;
//     private final StudentRepository studentRepository;
//     private final ResultRepository resultRepository;
    
//     public DashboardStats getAdminDashboardStats() {
//         DashboardStats stats = new DashboardStats();
        
//         stats.setTotalStudents(studentRepository.count());
//         stats.setTotalCourses(courseRepository.count());
//         stats.setTotalInstructors(userRepository.countByRole(User.Role.INSTRUCTOR));
//         stats.setTotalResults(resultRepository.count());
        
//         // Additional statistics
//         Map<String, Object> additionalStats = new HashMap<>();
//         additionalStats.put("activeCourses", courseRepository.findAvailableCourses().size());
//         additionalStats.put("averageEnrollmentPerCourse", calculateAverageEnrollment());
//         stats.setAdditionalStats(additionalStats);
        
//         return stats;
//     }
    
//     public DashboardStats getStudentDashboardStats() {
//         User currentUser = (User) SecurityContextHolder.getContext()
//                 .getAuthentication().getPrincipal();
        
//         Student student = studentRepository.findByUser(currentUser)
//                 .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
//         DashboardStats stats = new DashboardStats();
//         stats.setEnrolledCourses(student.getCourses().size());
//         stats.setCompletedCourses(resultRepository.findByStudent(student).size());
        
//         // Calculate GPA
//         List<Result> results = resultRepository.findByStudent(student);
//         if (!results.isEmpty()) {
//             double totalScore = results.stream()
//                     .mapToDouble(Result::getTotalScore)
//                     .average()
//                     .orElse(0.0);
//             stats.setGpa(totalScore / 25.0); // Convert to 4.0 scale
//         }
        
//         return stats;
//     }
    
//     public DashboardStats getInstructorDashboardStats() {
//         User currentUser = (User) SecurityContextHolder.getContext()
//                 .getAuthentication().getPrincipal();
        
//         DashboardStats stats = new DashboardStats();
//         List<Course> courses = courseRepository.findByInstructor(currentUser);
        
//         stats.setTotalCourses((long) courses.size());
        
//         long totalStudents = courses.stream()
//                 .mapToLong(course -> course.getStudents().size())
//                 .sum();
//         stats.setTotalStudents(totalStudents);
        
//         return stats;
//     }
    
//     private double calculateAverageEnrollment() {
//         List<Course> allCourses = courseRepository.findAll();
//         if (allCourses.isEmpty()) return 0.0;
        
//         return allCourses.stream()
//                 .mapToInt(course -> course.getStudents().size())
//                 .average()
//                 .orElse(0.0);
//     }
// }


package com.university.course_managment.service;  

import com.university.course_managment.dto.DashboardStats;
import com.university.course_managment.entity.User;
import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Result;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final ResultRepository resultRepository;
    
    public DashboardStats getAdminDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalCourses(courseRepository.count());
        
        // Fix: Count instructors manually since countByRole might not exist
        long instructorCount = userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.INSTRUCTOR)
                .count();
        stats.setTotalInstructors(instructorCount);
        
        stats.setTotalResults(resultRepository.count());
        
        // Additional statistics
        Map<String, Object> additionalStats = new HashMap<>();
        additionalStats.put("activeCourses", courseRepository.findAll().size());
        additionalStats.put("averageEnrollmentPerCourse", calculateAverageEnrollment());
        stats.setAdditionalStats(additionalStats);
        
        return stats;
    }
    
    public DashboardStats getStudentDashboardStats() {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        
        // Fix: Find student by user ID instead
        Student student = studentRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        DashboardStats stats = new DashboardStats();
        stats.setEnrolledCourses(student.getCourses() != null ? student.getCourses().size() : 0);
        
        // Fix: Count results manually if findByStudentId doesn't exist
        List<Result> results = resultRepository.findAll().stream()
                .filter(result -> result.getStudent().getId().equals(student.getId()))
                .collect(java.util.stream.Collectors.toList());
        
        stats.setCompletedCourses(results.size());
        
        // Calculate GPA
        if (!results.isEmpty()) {
            double totalScore = results.stream()
                    .mapToDouble(Result::getTotalScore)
                    .average()
                    .orElse(0.0);
            stats.setGpa(totalScore / 25.0); // Convert to 4.0 scale
        }
        
        return stats;
    }
    
    public DashboardStats getInstructorDashboardStats() {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        
        DashboardStats stats = new DashboardStats();
        
        // Fix: Filter courses by instructor manually
        List<Course> courses = courseRepository.findAll().stream()
                .filter(course -> course.getInstructor() != null && 
                        course.getInstructor().getId().equals(currentUser.getId()))
                .collect(java.util.stream.Collectors.toList());
        
        stats.setTotalCourses((long) courses.size());
        
        long totalStudents = courses.stream()
                .mapToLong(course -> course.getStudents() != null ? course.getStudents().size() : 0)
                .sum();
        stats.setTotalStudents(totalStudents);
        
        return stats;
    }
    
    private double calculateAverageEnrollment() {
        List<Course> allCourses = courseRepository.findAll();
        if (allCourses.isEmpty()) return 0.0;
        
        return allCourses.stream()
                .mapToInt(course -> course.getStudents() != null ? course.getStudents().size() : 0)
                .average()
                .orElse(0.0);
    }
}