package com.preparefortelc.assignment.domain;

import com.preparefortelc.identity.domain.User;

import java.util.List;
import java.util.Optional;

public interface ExamAssignmentRepository {
    ExamAssignment save(ExamAssignment assignment);
    Optional<ExamAssignment> findById(Long id);
    List<ExamAssignment> findAll();
    List<ExamAssignment> findByStudent(User student);
    List<ExamAssignment> findByStudentAndStatus(User student, AssignmentStatus status);
    List<ExamAssignment> findByAssignedBy(User assignedBy);
    long count();
}
