package com.preparefortelc.assignment.infrastructure.persistence;

import com.preparefortelc.assignment.domain.AssignmentStatus;
import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaExamAssignmentRepository extends JpaRepository<ExamAssignment, Long> {
    List<ExamAssignment> findByStudent(User student);
    List<ExamAssignment> findByStudentAndStatus(User student, AssignmentStatus status);
    List<ExamAssignment> findByAssignedBy(User assignedBy);
}
