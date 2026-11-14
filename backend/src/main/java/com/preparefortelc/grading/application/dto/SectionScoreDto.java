package com.preparefortelc.grading.application.dto;

public class SectionScoreDto {
    private int score;
    private int maxScore;
    private double percentage;

    public SectionScoreDto() {}

    public SectionScoreDto(int score, int maxScore, double percentage) {
        this.score = score;
        this.maxScore = maxScore;
        this.percentage = percentage;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(int maxScore) {
        this.maxScore = maxScore;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
