package com.preparefortelc.grading.domain;

import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.exam.domain.Exam;
import com.preparefortelc.identity.domain.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "exam_results", indexes = {
    @Index(name = "idx_results_student", columnList = "student_id"),
    @Index(name = "idx_results_assignment", columnList = "assignment_id")
})
public class ExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    private ExamAssignment assignment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(nullable = false)
    private Integer totalScore;

    @Column(nullable = false)
    private Integer maxScore;

    @Column(nullable = false)
    private Double percentage;

    @Column(nullable = false)
    private Boolean passed;

    @Column(nullable = false)
    private Instant submittedAt = Instant.now();

    @Column(columnDefinition = "TEXT")
    private String sectionScoresJson;

    @Column(columnDefinition = "TEXT")
    private String answersJson;

    public ExamResult() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ExamAssignment getAssignment() {
        return assignment;
    }

    public void setAssignment(ExamAssignment assignment) {
        this.assignment = assignment;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
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

    public String getSectionScoresJson() {
        return sectionScoresJson;
    }

    public void setSectionScoresJson(String sectionScoresJson) {
        this.sectionScoresJson = sectionScoresJson;
    }

    public String getAnswersJson() {
        return answersJson;
    }

    public void setAnswersJson(String answersJson) {
        this.answersJson = answersJson;
    }
}
