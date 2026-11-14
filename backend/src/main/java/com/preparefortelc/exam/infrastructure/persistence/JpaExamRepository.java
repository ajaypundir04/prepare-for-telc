package com.preparefortelc.exam.infrastructure.persistence;

import com.preparefortelc.exam.domain.Exam;
import com.preparefortelc.questionbank.domain.ExamLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByLevel(ExamLevel level);
}
