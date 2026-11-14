package com.preparefortelc.grading.application;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.preparefortelc.assignment.domain.AssignmentStatus;
import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.assignment.domain.ExamAssignmentRepository;
import com.preparefortelc.grading.application.dto.ExamResultResponse;
import com.preparefortelc.grading.application.dto.QuestionReviewDto;
import com.preparefortelc.grading.application.dto.SectionScoreDto;
import com.preparefortelc.grading.application.dto.SubmissionRequest;
import com.preparefortelc.grading.domain.ExamResult;
import com.preparefortelc.grading.domain.ExamResultRepository;
import com.preparefortelc.grading.domain.GradingDomainService;
import com.preparefortelc.identity.domain.User;
import com.preparefortelc.identity.domain.UserRepository;
import com.preparefortelc.questionbank.domain.ExamModule;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class GradingApplicationService {

    private final ExamAssignmentRepository assignmentRepository;
    private final ExamResultRepository resultRepository;
    private final UserRepository userRepository;
    private final GradingDomainService gradingDomainService;
    private final ObjectMapper objectMapper;

    public GradingApplicationService(ExamAssignmentRepository assignmentRepository,
                                     ExamResultRepository resultRepository,
                                     UserRepository userRepository,
                                     GradingDomainService gradingDomainService) {
        this.assignmentRepository = assignmentRepository;
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
        this.gradingDomainService = gradingDomainService;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public ExamResultResponse gradeSubmission(Long assignmentId, SubmissionRequest submission, String studentEmail) {
        ExamAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found with id: " + assignmentId));

        if (!assignment.getStudent().getEmail().equalsIgnoreCase(studentEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized to submit for this assignment");
        }

        if (assignment.getStatus() == AssignmentStatus.COMPLETED) {
            return getResultByAssignmentId(assignmentId);
        }

        GradingDomainService.GradingEvaluationResult eval = gradingDomainService.evaluate(assignment, submission.getAnswers());
        assignmentRepository.save(assignment);
        ExamResult savedResult = resultRepository.save(eval.examResult);

        return mapToResponse(savedResult, eval.sectionScores, eval.reviewList);
    }

    @Transactional(readOnly = true)
    public ExamResultResponse getResultByAssignmentId(Long assignmentId) {
        ExamAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found with id: " + assignmentId));

        ExamResult result = resultRepository.findByAssignment(assignment)
                .orElseThrow(() -> new IllegalArgumentException("Result not found for assignment: " + assignmentId));

        return parseResultToDto(result);
    }

    @Transactional(readOnly = true)
    public List<ExamResultResponse> getResultsForStudent(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentEmail));
        List<ExamResult> results = resultRepository.findByStudentOrderBySubmittedAtDesc(student);

        List<ExamResultResponse> dtoList = new ArrayList<>();
        for (ExamResult r : results) {
            dtoList.add(parseResultToDto(r));
        }
        return dtoList;
    }

    @Transactional(readOnly = true)
    public List<ExamResultResponse> getAllResults() {
        List<ExamResult> results = resultRepository.findAllByOrderBySubmittedAtDesc();
        List<ExamResultResponse> dtoList = new ArrayList<>();
        for (ExamResult r : results) {
            dtoList.add(parseResultToDto(r));
        }
        return dtoList;
    }

    private ExamResultResponse parseResultToDto(ExamResult result) {
        Map<ExamModule, SectionScoreDto> sectionScoresMap = new EnumMap<>(ExamModule.class);
        List<QuestionReviewDto> reviewList = new ArrayList<>();

        try {
            if (result.getSectionScoresJson() != null && !result.getSectionScoresJson().isEmpty()) {
                sectionScoresMap = objectMapper.readValue(result.getSectionScoresJson(),
                        new TypeReference<Map<ExamModule, SectionScoreDto>>() {});
            }
            if (result.getAnswersJson() != null && !result.getAnswersJson().isEmpty()) {
                reviewList = objectMapper.readValue(result.getAnswersJson(),
                        new TypeReference<List<QuestionReviewDto>>() {});
            }
        } catch (Exception e) {
            // fallback
        }

        return mapToResponse(result, sectionScoresMap, reviewList);
    }

    private ExamResultResponse mapToResponse(ExamResult result,
                                             Map<ExamModule, SectionScoreDto> sectionScoresMap,
                                             List<QuestionReviewDto> reviewList) {
        ExamResultResponse resp = new ExamResultResponse();
        resp.setId(result.getId());
        resp.setAssignmentId(result.getAssignment().getId());
        resp.setExamId(result.getExam().getId());
        resp.setExamTitle(result.getExam().getTitle());
        resp.setLevel(result.getExam().getLevel());
        resp.setStudentEmail(result.getStudent().getEmail());
        resp.setStudentName(result.getStudent().getName());
        resp.setTotalScore(result.getTotalScore());
        resp.setMaxScore(result.getMaxScore());
        resp.setPercentage(result.getPercentage());
        resp.setPassed(result.getPassed());
        resp.setSubmittedAt(result.getSubmittedAt());
        resp.setSectionScores(sectionScoresMap);
        resp.setQuestionsReview(reviewList);
        return resp;
    }
}
