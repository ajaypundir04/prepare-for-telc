package com.preparefortelc.assignment.infrastructure.persistence;

import com.preparefortelc.assignment.domain.AssignmentStatus;
import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.assignment.domain.ExamAssignmentRepository;
import com.preparefortelc.identity.domain.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ExamAssignmentRepositoryImpl implements ExamAssignmentRepository {

    private final JpaExamAssignmentRepository jpaRepository;

    public ExamAssignmentRepositoryImpl(JpaExamAssignmentRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public ExamAssignment save(ExamAssignment assignment) {
        return jpaRepository.save(assignment);
    }

    @Override
    public Optional<ExamAssignment> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<ExamAssignment> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<ExamAssignment> findByStudent(User student) {
        return jpaRepository.findByStudent(student);
    }

    @Override
    public List<ExamAssignment> findByStudentAndStatus(User student, AssignmentStatus status) {
        return jpaRepository.findByStudentAndStatus(student, status);
    }

    @Override
    public List<ExamAssignment> findByAssignedBy(User assignedBy) {
        return jpaRepository.findByAssignedBy(assignedBy);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }
}
