package com.university.course_managment.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.course_managment.dto.CreateResultRequest;
import com.university.course_managment.dto.ResultDTO;
import com.university.course_managment.entity.Course;
import com.university.course_managment.entity.Result;
import com.university.course_managment.entity.Student;
import com.university.course_managment.entity.User;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.CourseRepository;
import com.university.course_managment.repository.ResultRepository;
import com.university.course_managment.repository.StudentRepository;
import com.university.course_managment.repository.UserRepository;

@Service
public class ResultService {
    
    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    // Constructor injection instead of @RequiredArgsConstructor
    public ResultService(ResultRepository resultRepository,
                        StudentRepository studentRepository,
                        CourseRepository courseRepository,
                        UserRepository userRepository) {
        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public ResultDTO createResult(CreateResultRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        // Check if student is enrolled in the course
        if (!student.getCourses().contains(course)) {
            throw new RuntimeException("Student is not enrolled in this course");
        }
        
        // Check if result already exists for this student, course, year, and semester
        Optional<Result> existingResult = resultRepository.findByStudentAndCourseAndYearAndSemester(
                student, course, request.getYear(), request.getSemester());
        
        if (existingResult.isPresent()) {
            throw new RuntimeException("Result already exists for this student in this course for the specified year and semester");
        }
        
        Result result = Result.builder()
                .student(student)
                .course(course)
                .midtermScore(request.getMidtermScore())
                .finalScore(request.getFinalScore())
                .year(request.getYear())
                .semester(request.getSemester())
                .build();
        
        // Calculate total and grade
        double total = (request.getMidtermScore() * 0.4) + (request.getFinalScore() * 0.6);
        result.setTotalScore(total);
        result.setGrade(calculateGrade(total));
        
        result = resultRepository.save(result);
        return mapToDTO(result);
    }
    
    public List<ResultDTO> getStudentResults(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        return resultRepository.findByStudent(student).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ResultDTO> getCourseResults(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        return resultRepository.findByCourse(course).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ResultDTO updateResult(Long resultId, CreateResultRequest request) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));
        
        result.setMidtermScore(request.getMidtermScore());
        result.setFinalScore(request.getFinalScore());
        result.setYear(request.getYear());
        result.setSemester(request.getSemester());
        
        // Recalculate total and grade
        double total = (request.getMidtermScore() * 0.4) + (request.getFinalScore() * 0.6);
        result.setTotalScore(total);
        result.setGrade(calculateGrade(total));
        
        result = resultRepository.save(result);
        return mapToDTO(result);
    }
    
    public List<ResultDTO> getAllResults() {
        return resultRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ResultDTO getResultById(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + id));
        return mapToDTO(result);
    }

    @Transactional
    public void deleteResult(Long id) {
        if (!resultRepository.existsById(id)) {
            throw new ResourceNotFoundException("Result not found with id: " + id);
        }
        resultRepository.deleteById(id);
    }

    public List<ResultDTO> getResultsByStudentId(Long studentId) {
        return getStudentResults(studentId);
    }

    public List<ResultDTO> getResultsByCourseId(Long courseId) {
        return getCourseResults(courseId);
    }
    
    public List<ResultDTO> getResultsByInstructor(Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));
        
        List<Course> instructorCourses = courseRepository.findByInstructor(instructor);
        
        return instructorCourses.stream()
                .flatMap(course -> resultRepository.findByCourse(course).stream())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    // Fixed calculateGrade method
    private String calculateGrade(double score) {
        if (score >= 85) return "A+";
        else if (score >= 70) return "A";
        else if (score >= 65) return "A-";
        else if (score >= 60) return "B+";
        else if (score >= 55) return "B";
        else if (score >= 50) return "B-";
        else if (score >= 45) return "C+";
        else if (score >= 40) return "C";
        else if (score >= 35) return "C-";
        else if (score >= 30) return "D";
        else return "F";
    }
    
    private ResultDTO mapToDTO(Result result) {
        ResultDTO dto = new ResultDTO();
        dto.setId(result.getId());
        dto.setStudentId(result.getStudent().getId());
        dto.setStudentName(result.getStudent().getUser().getFirstName() + " " + 
                        result.getStudent().getUser().getLastName());
        dto.setCourseId(result.getCourse().getId());
        dto.setCourseCode(result.getCourse().getCode());
        dto.setCourseTitle(result.getCourse().getTitle());
        dto.setMidtermScore(result.getMidtermScore());
        dto.setFinalScore(result.getFinalScore());
        dto.setTotalScore(result.getTotalScore());
        dto.setGrade(result.getGrade());
        dto.setYear(result.getYear());
        dto.setSemester(result.getSemester());
        return dto;
    }
}