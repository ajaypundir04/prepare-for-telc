package com.preparefortelc.grading.application.dto;

import com.preparefortelc.questionbank.domain.ExamLevel;
import com.preparefortelc.questionbank.domain.ExamModule;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public class ExamResultResponse {
    private Long id;
    private Long assignmentId;
    private Long examId;
    private String examTitle;
    private ExamLevel examLevel;
    private String studentEmail;
    private String studentName;
    private Integer totalScore;
    private Integer maxScore;
    private Double percentage;
    private Boolean passed;
    private Instant submittedAt;
    private Map<ExamModule, SectionScoreDto> sectionScores;
    private List<QuestionReviewDto> questionsReview;

    public ExamResultResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public ExamLevel getLevel() {
        return examLevel;
    }

    public void setLevel(ExamLevel examLevel) {
        this.examLevel = examLevel;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public Boolean getPassed() {
        return passed;
    }

    public void setPassed(Boolean passed) {
        this.passed = passed;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Map<ExamModule, SectionScoreDto> getSectionScores() {
        return sectionScores;
    }

    public void setSectionScores(Map<ExamModule, SectionScoreDto> sectionScores) {
        this.sectionScores = sectionScores;
    }

    public List<QuestionReviewDto> getQuestionsReview() {
        return questionsReview;
    }

    public void setQuestionsReview(List<QuestionReviewDto> questionsReview) {
        this.questionsReview = questionsReview;
    }
}
