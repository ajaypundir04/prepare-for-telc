package com.preparefortelc.questionbank.infrastructure.persistence;

import com.preparefortelc.questionbank.domain.ExamLevel;
import com.preparefortelc.questionbank.domain.ExamModule;
import com.preparefortelc.questionbank.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaQuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLevel(ExamLevel level);
    List<Question> findByModule(ExamModule module);
    List<Question> findByLevelAndModule(ExamLevel level, ExamModule module);
}
