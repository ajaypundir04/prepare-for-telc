package com.preparefortelc.grading.presentation;

import com.preparefortelc.grading.application.GradingApplicationService;
import com.preparefortelc.grading.application.dto.ExamResultResponse;
import com.preparefortelc.grading.application.dto.SubmissionRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final GradingApplicationService gradingService;

    public SubmissionController(GradingApplicationService gradingService) {
        this.gradingService = gradingService;
    }

    @PostMapping("/assignments/{id}/submit")
    public ResponseEntity<ExamResultResponse> submitExam(
            @PathVariable Long id,
            @Valid @RequestBody SubmissionRequest submission,
            Authentication authentication) {
        return ResponseEntity.ok(gradingService.gradeSubmission(id, submission, authentication.getName()));
    }

    @GetMapping("/results/assignment/{assignmentId}")
    public ResponseEntity<ExamResultResponse> getResultByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(gradingService.getResultByAssignmentId(assignmentId));
    }

    @GetMapping("/results/student")
    public ResponseEntity<List<ExamResultResponse>> getStudentResults(Authentication authentication) {
        return ResponseEntity.ok(gradingService.getResultsForStudent(authentication.getName()));
    }

    @GetMapping("/results/all")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<ExamResultResponse>> getAllResults() {
        return ResponseEntity.ok(gradingService.getAllResults());
    }
}
