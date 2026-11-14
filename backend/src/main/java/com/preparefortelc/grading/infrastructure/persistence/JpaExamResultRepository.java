package com.preparefortelc.grading.infrastructure.persistence;

import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.grading.domain.ExamResult;
import com.preparefortelc.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaExamResultRepository extends JpaRepository<ExamResult, Long> {
    Optional<ExamResult> findByAssignment(ExamAssignment assignment);
    List<ExamResult> findByStudentOrderBySubmittedAtDesc(User student);
    List<ExamResult> findAllByOrderBySubmittedAtDesc();
}
