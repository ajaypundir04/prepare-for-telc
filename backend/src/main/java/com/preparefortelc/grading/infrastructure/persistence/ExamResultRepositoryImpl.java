package com.preparefortelc.grading.infrastructure.persistence;

import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.grading.domain.ExamResult;
import com.preparefortelc.grading.domain.ExamResultRepository;
import com.preparefortelc.identity.domain.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ExamResultRepositoryImpl implements ExamResultRepository {

    private final JpaExamResultRepository jpaRepository;

    public ExamResultRepositoryImpl(JpaExamResultRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public ExamResult save(ExamResult examResult) {
        return jpaRepository.save(examResult);
    }

    @Override
    public Optional<ExamResult> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<ExamResult> findByAssignment(ExamAssignment assignment) {
        return jpaRepository.findByAssignment(assignment);
    }

    @Override
    public List<ExamResult> findByStudentOrderBySubmittedAtDesc(User student) {
        return jpaRepository.findByStudentOrderBySubmittedAtDesc(student);
    }

    @Override
    public List<ExamResult> findAllByOrderBySubmittedAtDesc() {
        return jpaRepository.findAllByOrderBySubmittedAtDesc();
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }
}
