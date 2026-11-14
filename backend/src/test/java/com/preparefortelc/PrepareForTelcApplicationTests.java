package com.preparefortelc;

import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.assignment.domain.ExamAssignmentRepository;
import com.preparefortelc.grading.application.GradingApplicationService;
import com.preparefortelc.grading.application.dto.ExamResultResponse;
import com.preparefortelc.grading.application.dto.SubmissionRequest;
import com.preparefortelc.identity.application.AuthApplicationService;
import com.preparefortelc.identity.application.dto.AuthRequest;
import com.preparefortelc.identity.application.dto.AuthResponse;
import com.preparefortelc.questionbank.domain.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = PrepareForTelcApplication.class)
class PrepareForTelcApplicationTests {

    @Autowired
    private AuthApplicationService authService;

    @Autowired
    private GradingApplicationService gradingService;

    @Autowired
    private ExamAssignmentRepository assignmentRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Test
    void contextLoads() {
        assertNotNull(authService);
        assertNotNull(gradingService);
    }

    @Test
    @Transactional
    void testAuthLoginAndGradingFlow() {
        // Test seeded teacher login
        AuthResponse teacherAuth = authService.login(new AuthRequest("teacher@telc.com", "Password123!"));
        assertNotNull(teacherAuth.getToken());
        assertEquals("ROLE_TEACHER", teacherAuth.getRole().name());

        // Test seeded student login
        AuthResponse studentAuth = authService.login(new AuthRequest("student@telc.com", "Password123!"));
        assertNotNull(studentAuth.getToken());
        assertEquals("ROLE_STUDENT", studentAuth.getRole().name());

        // Test auto-grading engine
        ExamAssignment assignment = assignmentRepository.findAll().stream()
                .filter(a -> a.getStudent().getEmail().equals("student@telc.com"))
                .findFirst()
                .orElseThrow();

        // Submit correct answers for questions
        Map<Long, String> answers = new HashMap<>();
        assignment.getExam().getQuestions().forEach(q -> {
            answers.put(q.getId(), q.getCorrectAnswer());
        });

        SubmissionRequest submission = new SubmissionRequest(answers);
        ExamResultResponse result = gradingService.gradeSubmission(assignment.getId(), submission, "student@telc.com");

        assertNotNull(result);
        assertTrue(result.getPassed());
        assertEquals(100.0, result.getPercentage());
        assertEquals(result.getMaxScore(), result.getTotalScore());
        assertNotNull(result.getSectionScores());
    }
}
