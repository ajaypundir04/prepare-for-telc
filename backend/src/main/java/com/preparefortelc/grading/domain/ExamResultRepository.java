package com.preparefortelc.grading.domain;

import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.identity.domain.User;

import java.util.List;
import java.util.Optional;

public interface ExamResultRepository {
    ExamResult save(ExamResult examResult);
    Optional<ExamResult> findById(Long id);
    Optional<ExamResult> findByAssignment(ExamAssignment assignment);
    List<ExamResult> findByStudentOrderBySubmittedAtDesc(User student);
    List<ExamResult> findAllByOrderBySubmittedAtDesc();
    long count();
}
