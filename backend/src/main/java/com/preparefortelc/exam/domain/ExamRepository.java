package com.preparefortelc.exam.domain;

import com.preparefortelc.questionbank.domain.ExamLevel;

import java.util.List;
import java.util.Optional;

public interface ExamRepository {
    Exam save(Exam exam);
    Optional<Exam> findById(Long id);
    List<Exam> findAll();
    List<Exam> findByLevel(ExamLevel level);
    long count();
}
