package com.preparefortelc.questionbank.domain;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository {
    Question save(Question question);
    List<Question> saveAll(Iterable<Question> questions);
    Optional<Question> findById(Long id);
    List<Question> findAll();
    List<Question> findByLevel(ExamLevel level);
    List<Question> findByModule(ExamModule module);
    List<Question> findByLevelAndModule(ExamLevel level, ExamModule module);
    boolean existsById(Long id);
    void deleteById(Long id);
    long count();
}
