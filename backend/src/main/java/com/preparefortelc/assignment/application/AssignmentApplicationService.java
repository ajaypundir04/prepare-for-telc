package com.preparefortelc.assignment.application;

import com.preparefortelc.assignment.application.dto.AssignmentRequest;
import com.preparefortelc.assignment.domain.AssignmentStatus;
import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.assignment.domain.ExamAssignmentRepository;
import com.preparefortelc.exam.domain.Exam;
import com.preparefortelc.exam.domain.ExamRepository;
import com.preparefortelc.identity.domain.User;
import com.preparefortelc.identity.domain.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AssignmentApplicationService {

    private final ExamAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;

    public AssignmentApplicationService(ExamAssignmentRepository assignmentRepository,
                                        UserRepository userRepository,
                                        ExamRepository examRepository) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.examRepository = examRepository;
    }

    @Transactional
    public ExamAssignment dispatchExam(AssignmentRequest req, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found: " + teacherEmail));

        User student = userRepository.findByEmail(req.getStudentEmail())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with email: " + req.getStudentEmail()));

        Exam exam = examRepository.findById(req.getExamId())
                .orElseThrow(() -> new IllegalArgumentException("Exam not found with id: " + req.getExamId()));

        ExamAssignment assignment = new ExamAssignment();
        assignment.setStudent(student);
        assignment.setExam(exam);
        assignment.setAssignedBy(teacher);
        assignment.setAssignedAt(Instant.now());

        if (req.getExpiresAt() != null) {
            assignment.setExpiresAt(req.getExpiresAt());
        } else {
            int days = (req.getExpiresInDays() != null && req.getExpiresInDays() > 0) ? req.getExpiresInDays() : 7;
            assignment.setExpiresAt(Instant.now().plus(days, ChronoUnit.DAYS));
        }

        assignment.setStatus(AssignmentStatus.PENDING);
        return assignmentRepository.save(assignment);
    }

    @Transactional(readOnly = true)
    public List<ExamAssignment> getStudentAssignments(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentEmail));
        return assignmentRepository.findByStudent(student);
    }

    @Transactional(readOnly = true)
    public List<ExamAssignment> getAllAssignmentsForTeacher() {
        return assignmentRepository.findAll();
    }

    @Transactional
    public ExamAssignment getAssignmentById(Long id, String userEmail) {
        ExamAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found with id: " + id));

        if (assignment.getStatus() != AssignmentStatus.COMPLETED &&
                Instant.now().isAfter(assignment.getExpiresAt())) {
            assignment.setStatus(AssignmentStatus.EXPIRED);
            return assignmentRepository.save(assignment);
        }

        return assignment;
    }

    @Transactional
    public ExamAssignment startExam(Long id, String studentEmail) {
        ExamAssignment assignment = getAssignmentById(id, studentEmail);
        if (assignment.getStatus() == AssignmentStatus.PENDING) {
            assignment.setStatus(AssignmentStatus.IN_PROGRESS);
            return assignmentRepository.save(assignment);
        }
        return assignment;
    }
}
