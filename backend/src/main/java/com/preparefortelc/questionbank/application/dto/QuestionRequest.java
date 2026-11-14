package com.preparefortelc.questionbank.application.dto;

import com.preparefortelc.questionbank.domain.ExamLevel;
import com.preparefortelc.questionbank.domain.ExamModule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class QuestionRequest {
    @NotBlank
    private String title;

    private String passage;

    @NotBlank
    private String questionText;

    @NotNull
    private ExamLevel level;

    @NotNull
    private ExamModule module;

    private String audioUrl;
    private Integer maxAudioPlays = 2;

    @NotEmpty
    private List<String> options;

    @NotBlank
    private String correctAnswer;

    private String explanation;
    private Integer points = 5;

    public QuestionRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPassage() {
        return passage;
    }

    public void setPassage(String passage) {
        this.passage = passage;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public ExamLevel getLevel() {
        return level;
    }

    public void setLevel(ExamLevel level) {
        this.level = level;
    }

    public ExamModule getModule() {
        return module;
    }

    public void setModule(ExamModule module) {
        this.module = module;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public Integer getMaxAudioPlays() {
        return maxAudioPlays;
    }

    public void setMaxAudioPlays(Integer maxAudioPlays) {
        this.maxAudioPlays = maxAudioPlays;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}
