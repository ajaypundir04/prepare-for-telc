package com.preparefortelc.assignment.presentation;

import com.preparefortelc.assignment.application.AssignmentApplicationService;
import com.preparefortelc.assignment.application.dto.AssignmentRequest;
import com.preparefortelc.assignment.domain.ExamAssignment;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentApplicationService assignmentService;

    public AssignmentController(AssignmentApplicationService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/dispatch")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ExamAssignment> dispatchExam(
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assignmentService.dispatchExam(request, authentication.getName()));
    }

    @GetMapping("/student")
    public ResponseEntity<List<ExamAssignment>> getStudentAssignments(Authentication authentication) {
        return ResponseEntity.ok(assignmentService.getStudentAssignments(authentication.getName()));
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<ExamAssignment>> getTeacherAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignmentsForTeacher());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamAssignment> getAssignmentById(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id, authentication.getName()));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ExamAssignment> startExam(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(assignmentService.startExam(id, authentication.getName()));
    }
}
