package com.preparefortelc.exam.application.dto;

import com.preparefortelc.questionbank.domain.ExamLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ExamRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    private ExamLevel level;

    private Integer durationMinutes = 90;
    private Double passingPercentage = 60.0;

    @NotEmpty
    private List<Long> questionIds;

    public ExamRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ExamLevel getLevel() {
        return level;
    }

    public void setLevel(ExamLevel level) {
        this.level = level;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Double getPassingPercentage() {
        return passingPercentage;
    }

    public void setPassingPercentage(Double passingPercentage) {
        this.passingPercentage = passingPercentage;
    }

    public List<Long> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<Long> questionIds) {
        this.questionIds = questionIds;
    }
}
