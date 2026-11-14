package com.preparefortelc.grading.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.preparefortelc.assignment.domain.AssignmentStatus;
import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.exam.domain.Exam;
import com.preparefortelc.grading.application.dto.QuestionReviewDto;
import com.preparefortelc.grading.application.dto.SectionScoreDto;
import com.preparefortelc.questionbank.domain.ExamModule;
import com.preparefortelc.questionbank.domain.Question;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class GradingDomainService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public static class GradingEvaluationResult {
        public ExamResult examResult;
        public Map<ExamModule, SectionScoreDto> sectionScores;
        public List<QuestionReviewDto> reviewList;
    }

    public GradingEvaluationResult evaluate(ExamAssignment assignment, Map<Long, String> candidateAnswers) {
        Exam exam = assignment.getExam();
        List<Question> questions = exam.getQuestions();
        Map<Long, String> answers = candidateAnswers != null ? candidateAnswers : Collections.emptyMap();

        int totalScore = 0;
        int maxScore = 0;

        Map<ExamModule, Integer> moduleScores = new EnumMap<>(ExamModule.class);
        Map<ExamModule, Integer> moduleMaxScores = new EnumMap<>(ExamModule.class);
        for (ExamModule module : ExamModule.values()) {
            moduleScores.put(module, 0);
            moduleMaxScores.put(module, 0);
        }

        List<QuestionReviewDto> reviewList = new ArrayList<>();

        for (Question question : questions) {
            int qPoints = (question.getPoints() != null && question.getPoints() > 0) ? question.getPoints() : 5;
            maxScore += qPoints;

            ExamModule mod = question.getModule();
            moduleMaxScores.put(mod, moduleMaxScores.getOrDefault(mod, 0) + qPoints);

            String chosen = answers.get(question.getId());
            boolean isCorrect = chosen != null && chosen.trim().equalsIgnoreCase(question.getCorrectAnswer().trim());

            int earnedPoints = isCorrect ? qPoints : 0;
            totalScore += earnedPoints;
            moduleScores.put(mod, moduleScores.getOrDefault(mod, 0) + earnedPoints);

            QuestionReviewDto reviewDto = new QuestionReviewDto();
            reviewDto.setQuestionId(question.getId());
            reviewDto.setTitle(question.getTitle());
            reviewDto.setPassage(question.getPassage());
            reviewDto.setQuestionText(question.getQuestionText());
            reviewDto.setModule(question.getModule());
            reviewDto.setOptions(question.getOptions());
            reviewDto.setChosenAnswer(chosen);
            reviewDto.setCorrectAnswer(question.getCorrectAnswer());
            reviewDto.setCorrect(isCorrect);
            reviewDto.setPointsEarned(earnedPoints);
            reviewDto.setMaxPoints(qPoints);
            reviewDto.setExplanation(question.getExplanation());

            reviewList.add(reviewDto);
        }

        double overallPercentage = maxScore > 0 ? (totalScore * 100.0) / maxScore : 0.0;
        double passThreshold = exam.getPassingPercentage() != null ? exam.getPassingPercentage() : 60.0;
        boolean passed = overallPercentage >= passThreshold;

        Map<ExamModule, SectionScoreDto> sectionScoresMap = new EnumMap<>(ExamModule.class);
        for (ExamModule mod : ExamModule.values()) {
            int secScore = moduleScores.getOrDefault(mod, 0);
            int secMax = moduleMaxScores.getOrDefault(mod, 0);
            double secPct = secMax > 0 ? (secScore * 100.0) / secMax : 0.0;
            sectionScoresMap.put(mod, new SectionScoreDto(secScore, secMax, secPct));
        }

        String sectionScoresJson = "";
        String answersJson = "";
        try {
            sectionScoresJson = objectMapper.writeValueAsString(sectionScoresMap);
            answersJson = objectMapper.writeValueAsString(reviewList);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing exam grading results", e);
        }

        assignment.setStatus(AssignmentStatus.COMPLETED);

        ExamResult examResult = new ExamResult();
        examResult.setAssignment(assignment);
        examResult.setStudent(assignment.getStudent());
        examResult.setExam(exam);
        examResult.setTotalScore(totalScore);
        examResult.setMaxScore(maxScore);
        examResult.setPercentage(Math.round(overallPercentage * 10.0) / 10.0);
        examResult.setPassed(passed);
        examResult.setSubmittedAt(Instant.now());
        examResult.setSectionScoresJson(sectionScoresJson);
        examResult.setAnswersJson(answersJson);

        GradingEvaluationResult res = new GradingEvaluationResult();
        res.examResult = examResult;
        res.sectionScores = sectionScoresMap;
        res.reviewList = reviewList;
        return res;
    }
}
