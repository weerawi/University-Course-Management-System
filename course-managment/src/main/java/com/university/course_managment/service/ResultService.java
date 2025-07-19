package com.university.course_managment.service; 

import com.university.course_managment.dto.ResultDTO;
import com.university.course_managment.dto.CreateResultRequest;
import com.university.course_managment.entity.*;
import com.university.course_managment.exception.ResourceNotFoundException;
import com.university.course_managment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {
    
    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    
    @Transactional
    public ResultDTO createResult(CreateResultRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        // Check if result already exists
        if (resultRepository.findByStudentAndCourse(student, course).isPresent()) {
            throw new RuntimeException("Result already exists for this student and course");
        }
        
        Result result = Result.builder()
                .student(student)
                .course(course)
                .midtermScore(request.getMidtermScore())
                .finalScore(request.getFinalScore())
                .semester(request.getSemester())
                .build();
        
        // Calculate total score and grade
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
        result.setSemester(request.getSemester());
        
        double total = (request.getMidtermScore() * 0.4) + (request.getFinalScore() * 0.6);
        result.setTotalScore(total);
        result.setGrade(calculateGrade(total));
        
        result = resultRepository.save(result);
        return mapToDTO(result);
    }
    
    private String calculateGrade(double score) {
        if (score >= 90) return "A+";
        else if (score >= 85) return "A";
        else if (score >= 80) return "A-";
        else if (score >= 75) return "B+";
        else if (score >= 70) return "B";
        else if (score >= 65) return "B-";
        else if (score >= 60) return "C+";
        else if (score >= 55) return "C";
        else if (score >= 50) return "C-";
        else if (score >= 45) return "D";
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
        dto.setSemester(result.getSemester());
        return dto;
    }
}
