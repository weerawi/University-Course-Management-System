package com.university.course_managment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.course_managment.dto.DashboardStats;
import com.university.course_managment.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
    
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStats> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }
    
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DashboardStats> getStudentStats() {
        return ResponseEntity.ok(dashboardService.getStudentDashboardStats());
    }
    
    @GetMapping("/instructor")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<DashboardStats> getInstructorStats() {
        return ResponseEntity.ok(dashboardService.getInstructorDashboardStats());
    }
}