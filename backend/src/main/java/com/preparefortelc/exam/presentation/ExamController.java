package com.preparefortelc.exam.presentation;

import com.preparefortelc.exam.application.ExamApplicationService;
import com.preparefortelc.exam.application.dto.ExamRequest;
import com.preparefortelc.exam.domain.Exam;
import com.preparefortelc.questionbank.domain.ExamLevel;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamApplicationService examService;

    public ExamController(ExamApplicationService examService) {
        this.examService = examService;
    }

    @GetMapping
    public ResponseEntity<List<Exam>> getExams(@RequestParam(required = false) ExamLevel level) {
        return ResponseEntity.ok(examService.getExams(level));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExamById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Exam> createExam(@Valid @RequestBody ExamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examService.createExam(request));
    }
}
