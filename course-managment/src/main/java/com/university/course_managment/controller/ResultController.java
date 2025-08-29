package com.university.course_managment.controller; 

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.course_managment.dto.CreateResultRequest;
import com.university.course_managment.dto.ResultDTO;
import com.university.course_managment.service.ResultService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ResultController {
    
    private final ResultService resultService;
    
    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ResultDTO> createResult(@Valid @RequestBody CreateResultRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resultService.createResult(request));
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<ResultDTO>> getStudentResults(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getStudentResults(studentId));
    }
    
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<ResultDTO>> getCourseResults(@PathVariable Long courseId) {
        return ResponseEntity.ok(resultService.getCourseResults(courseId));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ResultDTO> updateResult(
            @PathVariable Long id,
            @Valid @RequestBody CreateResultRequest request
    ) {
        return ResponseEntity.ok(resultService.updateResult(id, request));
    }
 
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResultDTO>> getAllResults() {
        List<ResultDTO> results = resultService.getAllResults();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<ResultDTO> getResultById(@PathVariable Long id) {
        ResultDTO result = resultService.getResultById(id);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.noContent().build();
    }
}