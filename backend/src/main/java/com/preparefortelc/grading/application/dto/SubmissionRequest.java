package com.preparefortelc.grading.application.dto;

import jakarta.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

public class SubmissionRequest {
    @NotNull
    private Map<Long, String> answers = new HashMap<>();

    public SubmissionRequest() {}

    public SubmissionRequest(Map<Long, String> answers) {
        this.answers = answers;
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}
